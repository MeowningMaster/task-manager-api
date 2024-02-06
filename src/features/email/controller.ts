import { Confirm, Get, Put } from "./schema.js"
import { JwtValidator } from "../../server/plugins/jwt-validator.js"
import { Elysia } from "elysia"
import { guardTags } from "#root/src/server/plugins/documentation/guard.js"

export const emailController = new Elysia().use(guardTags("email"))

// export const Controller = ioc.add(
// 	[Logic, JwtValidator],
// 	(logic, jwtValidator): FastifyPluginAsyncTypebox =>
// 		async (server) => {
// 			await server.register(tagsAdder, { tags: ["email"] })

// 			server.get("/confirm", { schema: Confirm }, async (request) => {
// 				await logic.confirm(request.query.token)
// 			})

// 			const secureRoutes: FastifyPluginAsyncTypebox = async (server) => {
// 				await server.register(jwtValidator)

// 				server.get("/", { schema: Get }, (request) => {
// 					return logic.get(request.jwt.id)
// 				})

// 				server.put("/", { schema: Put }, async (request) => {
// 					await logic.put(request.jwt.id, request.body.email)
// 					return {
// 						message: "Check your inbox for confirmation email",
// 					}
// 				})

// 				server.delete(
// 					"/",
// 					{
// 						schema: {
// 							description: "Delete the current user's email address",
// 						},
// 					},
// 					async (request) => {
// 						await logic.delete(request.jwt.id)
// 					},
// 				)
// 			}
// 			await server.register(secureRoutes)
// 		},
// )
