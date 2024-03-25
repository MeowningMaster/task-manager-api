import { Elysia } from "elysia"
import type { Ioc } from "../ioc"
import { guardTags } from "../server/plugins/documentation/guard"
import type { ApiTags } from "../server/plugins/documentation/tags"

export default function featuresController({
	userController,
	taskController,
	emailController,
}: Ioc) {
	const controllers: Record<string, Elysia> = {
		user: userController,
		task: taskController,
		email: emailController,
	}

	const plugin = new Elysia()
	for (const path in controllers) {
		const controller = controllers[path]
		plugin.group(`/${path}`, (app) =>
			app.use(guardTags(path as ApiTags)).use(controller),
		)
	}
	return plugin
}
