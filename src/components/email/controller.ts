import { ioc } from '#root/ioc/index.js'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Logic } from './logic.js'
import { Confirm, Get, Put } from './schema.js'
import { tagsAdder } from '#root/server/documentation/tags-adder.js'
import { JwtValidator } from '../user/jwt-validator.js'

export const Controller = ioc.add(
    [Logic, JwtValidator],
    (logic, jwtValidator): FastifyPluginAsyncTypebox =>
        async (server) => {
            await server.register(tagsAdder, { tags: ['email'] })

            server.get('/confirm', { schema: Confirm }, async (request) => {
                await logic.confirm(request.query.token)
            })

            const secureRoutes: FastifyPluginAsyncTypebox = async (server) => {
                await server.register(jwtValidator)

                server.get('/', { schema: Get }, (request) => {
                    return logic.get(request.jwt.id)
                })

                server.put('/', { schema: Put }, async (request) => {
                    await logic.put(request.jwt.id, request.body.email)
                    return {
                        message: 'Check your inbox for confirmation email',
                    }
                })

                server.delete('/', async (request) => {
                    await logic.delete(request.jwt.id)
                })
            }
            await server.register(secureRoutes)
        },
)
