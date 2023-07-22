import { ioc } from '#root/ioc/index.js'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { List } from './schema.js'
import { Logic } from './logic.js'

export const Controller = ioc.add(
    [Logic],
    (logic): FastifyPluginAsyncTypebox =>
        async (server) => {
            server.get('/:id', () => {})

            server.get(
                '/list',
                {
                    schema: List,
                },
                (request) => {
                    const pagination = request.query
                    return logic.list(1, pagination)
                },
            )

            server.post('/', () => {})

            server.put('/:id', () => {})
        },
)
