import { ioc } from '#root/ioc/index.js'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'

export const Controller = ioc.add(
    [],
    (): FastifyPluginAsyncTypebox => async (server) => {
        server.get('/:id', () => {})

        server.get('/list', () => {})

        server.post('/', () => {})

        server.put('/:id', () => {})
    },
)
