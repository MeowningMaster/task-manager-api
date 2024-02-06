import { createPinoLogger } from "@bogeychan/elysia-logger"
import type { TransportTargetOptions } from "pino"
import fs from "node:fs"
import path from "node:path"
import type { PrettyOptions } from "pino-pretty"
import { Ioc } from "../ioc"

function createDirs(to: string) {
	const dir = path.dirname(to)
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true })
	}
}

export default function log({ config }: Ioc) {
	const targets: TransportTargetOptions[] = []

	if (config.log.console) {
		if (config.mode === "development") {
			const options: PrettyOptions = {
				translateTime: "HH:MM:ss Z",
				ignore: ["pid", "hostname"].join(","),
				colorize: true,
			}
			targets.push({
				target: "pino-pretty",
				level: "trace",
				options,
			})
		} else {
			targets.push({
				target: "pino/file",
				level: "info",
				options: { destination: 1 }, // this writes to STDOUT
			})
		}
	}

	if (config.log.file) {
		createDirs(config.log.file)
		targets.push({
			target: "pino/file",
			level: "info",
			options: { destination: config.log.file },
		})
	}

	return createPinoLogger({
		level: config.mode === "development" ? "trace" : "info",
		transport: { targets },
	})
}
