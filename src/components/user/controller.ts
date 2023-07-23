import { ioc } from '#root/ioc/index.js'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Logic } from './logic.js'
import { Login, Register } from './schema.js'
import { tagsAdder } from '#root/server/documentation/tags-adder.js'
import { JwtValidator } from './jwt-validator.js'

export const Controller = ioc.add(
    [Logic, JwtValidator],
    (logic, jwtValidator): FastifyPluginAsyncTypebox =>
        async (server) => {
            await server.register(tagsAdder, { tags: ['user'] })

            server.post('/register', { schema: Register }, async (request) => {
                await logic.register(request.body)
            })

            server.post(
                '/login',
                { schema: Login, config: { rateLimit: { max: 5 } } },
                async (request) => {
                    return logic.login(request.body)
                },
            )

            await server.register(async () => {
                await server.register(jwtValidator)

                server.delete('/', async (request) => {
                    await logic.delete(request.jwt.id)
                })
            })
        },
)
