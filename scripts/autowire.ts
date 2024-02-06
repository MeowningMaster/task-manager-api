import chokidar from "chokidar"
import { relative, join, dirname } from "node:path"
import { readFile, writeFile } from "node:fs/promises"
import { Argument, Option, program } from "commander"

program
	.addArgument(
		new Argument("[watch-dir]", "Directory to watch").default(undefined, "CWD"),
	)
	.addOption(
		new Option("-o, --out-file <path>", "File to generate").default(
			undefined,
			"<watch-dir>/_module.ts",
		),
	)

program.parse()

const args = program.args
const options = program.opts()

const watchDir = args[0] ?? process.cwd()
const outFile = options.outFile ?? join(watchDir, "_module.ts")
const baseDir = dirname(outFile)

let initial = true

chokidar
	.watch(watchDir)
	.on("add", (path) => handleEvent("add", path))
	.on("change", (path) => handleEvent("change", path))
	.on("unlink", (path) => handleEvent("unlink", path))
	.on("error", (error) => console.error("watcher error:", error))
	.on("ready", async () => {
		initial = false
		await recreateOutput()
	})

type Event = "add" | "change" | "unlink"

async function handleEvent(event: Event, path: string) {
	if (isModule(path)) {
		handleModule(event, path)
	}
}

function isModule(path: string) {
	const match = toPosix(path).match(/\/~[^\/]+\.ts$/)
	return Boolean(match)
}

const cache = new Map<string, string>()

async function handleModule(event: Event, path: string) {
	if (event === "add" || event === "change") {
		const name = await parseDefaultExportName(path)
		if (name) {
			cache.set(path, name)
		} else {
			cache.delete(path)
		}
		console.info(event, path, name)
	} else if (event === "unlink") {
		cache.delete(path)
		console.info(event, path)
	} else {
		console.error("unknown fs event:", event)
	}

	if (!initial) {
		await recreateOutput()
	}
}

async function parseDefaultExportName(path: string) {
	const file = await readFile(path, "utf8")
	const match = file.match(
		/export\s+default\s+(async\s+)?function\s+(\w+)\s*\(/,
	)
	return match?.[2]
}

async function recreateOutput() {
	const entries = Array.from(cache.entries())

	const imports = entries
		.map(([path, name]) => {
			const importPath = toPosix(relative(baseDir, path).replace(".ts", ".js"))
			return `import ${name} from "./${importPath}"`
		})
		.join("\n")

	const indentation = "\t"
	const exportsContent = entries
		.map(([_, name]) => `${indentation}${name}`)
		.join(",\n")
	const exports = `export default {\n${exportsContent}\n}`

	const warning = "// This file is auto-generated. Do not edit it manually."
	const content = `${warning}\n\n${imports}\n\n${exports}`
	await writeFile(outFile, content)
}

function toPosix(path: string) {
	return path.replace(/\\/g, "/")
}
