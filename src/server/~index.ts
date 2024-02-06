import { Elysia } from "elysia"
import { Ioc } from "../ioc/index.js"
import { swagger } from "@elysiajs/swagger"
import { rateLimit } from "elysia-rate-limit"
import { featuresController } from "../features/controller.js"

export default function server({ log, config, rootLocator }: Ioc) {
	const server = new Elysia()
		.use(rootLocator)
		.use(swagger({ path: "/docs" }))
		.use(
			rateLimit({
				duration: 60_000, // 1 minute
				max: 100,
				responseCode: 429,
			}),
		)
		.use(featuresController)

	// await server.register(errorHandler)
	// await server.register(fastifyQs.default)
	// await server.register(controllers, { prefix: "/v1" })

	return {
		instance: server,

		listen() {
			const hostname = config.expose
				? "0.0.0.0" // all interfaces
				: "127.0.0.1" // localhost
			server.listen({ port: config.port, hostname })

			log.info(
				{
					local: `http://${hostname}:${config.port}`,
					external: config.externalUrl,
				},
				"Server listening",
			)
		},
	}
}
