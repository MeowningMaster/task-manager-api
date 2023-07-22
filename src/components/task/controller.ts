import { ioc } from '#root/ioc/index.js'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { List } from './schema.js'
import { Logic } from './logic.js'
import { tagsAdder } from '#root/server/documentation/tags-adder.js'
import { JwtValidator } from '../user/jwt-validator.js'

export const Controller = ioc.add(
    [Logic, JwtValidator],
    (logic, jwtValidator): FastifyPluginAsyncTypebox =>
        async (server) => {
            await server.register(tagsAdder, { tags: ['task'] })
            await server.register(jwtValidator)

            server.get('/:id', () => {})

            server.get(
                '/list',
                {
                    schema: List,
                },
                (request) => {
                    return logic.list(request.jwt.id, request.query)
                },
            )

            server.post('/', () => {})

            server.put('/:id', () => {})
        },
)
