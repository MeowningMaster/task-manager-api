import { Login, Register } from "./schema.js"
import { JwtValidator } from "../../server/plugins/jwt-validator.js"
import { Elysia } from "elysia"
import { guardTags } from "#root/src/server/plugins/documentation/guard.js"
import { cradle } from "#root/src/ioc/index.js"

export const userController = new Elysia()
	.use(guardTags("user"))
	.post("/register", ({ body }) => cradle.userLogic.register(body), {
		...Register,
		detail: { description: "Register a new user" },
	})
	.post("/login", ({ body }) => cradle.userLogic.login(body), {
		...Login,
		// per-route rate limit is not supported yet: max 5 requests per minute
		detail: {
			description:
				"Get a JWT token for temporary access. The token should be used as a bearer auth",
		},
	})

// export const Controller = ioc.add(
// 	[Logic, JwtValidator],
// 	(logic, jwtValidator): FastifyPluginAsyncTypebox =>
// 			await server.register(async (server) => {
// 				await server.register(jwtValidator)

// 				server.delete(
// 					"/",
// 					{ schema: { description: "Delete the current user" } },
// 					async (request) => {
// 						await logic.delete(request.jwt.id)
// 					},
// 				)
// 			})
// 		},
// )
