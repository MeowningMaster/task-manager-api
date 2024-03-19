import { Elysia } from "elysia"
import type { Ioc } from "../ioc"

export default function featuresController({
	userController,
	taskController,
	emailController,
}: Ioc) {
	const controllers: Record<string, Elysia> = {
		"/user": userController,
		"/task": taskController,
		"/email": emailController,
	}

	const plugin = new Elysia()
	for (const path in controllers) {
		const controller = controllers[path]
		plugin.group(path, { detail: { tags: [path.slice(1)] } }, (app) =>
			app.use(controller),
		)
	}
	return plugin
}
