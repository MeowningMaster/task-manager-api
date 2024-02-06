import { Elysia } from "elysia"
import { Ioc } from "../ioc"

export default function featuresController({ userController }: Ioc) {
	const controllers: Record<string, Elysia> = { "/user": userController }
	const plugin = new Elysia()
	for (const path in controllers) {
		const controller = controllers[path]
		plugin.group(path, (app) => app.use(controller))
	}
	return plugin
}
