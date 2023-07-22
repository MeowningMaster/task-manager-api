import { ioc } from '#root/ioc/index.js'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { Plugin } from './plugin.js'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'

type Options = {
    routePrefix: string
}

export const Documentation = ioc.add(
    [],
    (): FastifyPluginAsyncTypebox<Options> =>
        Plugin<Options>()(async (server, { routePrefix }) => {
            await server.register(fastifySwagger)
            await server.register(fastifySwaggerUi, {
                routePrefix,
            })
        }),
)
