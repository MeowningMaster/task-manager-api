import { Elysia } from "elysia"
import { rateLimit } from "elysia-rate-limit"
import type { Ioc } from "../ioc/index.js"
import { documentationPlugin } from "./plugins/documentation/index.js"

export default function server({
	log,
	config,
	rootLocator,
	featuresController,
}: Ioc) {
	const server = new Elysia()
		.use(rootLocator)
		// .use(
		// 	rateLimit({
		// 		duration: 60_000, // 1 minute
		// 		max: 100,
		// 		responseCode: 429,
		// 	}),
		// )
		.group("/v1", (app) =>
			app.use(documentationPlugin()).use(featuresController),
		)

	// await server.register(errorHandler)
	// await server.register(fastifyQs.default)

	return {
		instance: server,

		listen() {
			const hostname = config.expose
				? "0.0.0.0" // all interfaces
				: "127.0.0.1" // localhost
			server.listen({ port: config.port, hostname })

			log.info(
				{
					link: config.externalUrl,
					hostname,
					port: config.port,
				},
				"Server listening",
			)
		},
	}
}
