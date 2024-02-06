import { Delete, Get, List, Post, Put } from "./schema.js"
import { JwtValidator } from "../../server/plugins/jwt-validator.js"
import { Elysia } from "elysia"
import { guardTags } from "#root/src/server/plugins/documentation/guard.js"

export const taskController = new Elysia().use(guardTags("task"))

// export const Controller = ioc.add(
//     [Logic, JwtValidator],
//     (logic, jwtValidator): FastifyPluginAsyncTypebox =>
//         async (server) => {
//             await server.register(tagsAdder, { tags: ['task'] })
//             await server.register(jwtValidator)

//             server.get('/:id', { schema: Get }, (request) => {
//                 return logic.get(request.jwt.id, request.params.id)
//             })

//             server.get('/list', { schema: List }, (request) => {
//                 return logic.list(request.jwt.id, request.query)
//             })

//             server.post('/', { schema: Post }, async (request) => {
//                 return logic.post(request.jwt.id, request.body)
//             })

//             server.put('/:id', { schema: Put }, async (request) => {
//                 await logic.put(request.jwt.id, request.params.id, request.body)
//             })

//             server.delete('/:id', { schema: Delete }, async (request) => {
//                 await logic.delete(request.jwt.id, request.params.id)
//             })
//         },
// )
