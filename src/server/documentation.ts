import { ioc } from '#root/ioc/index.js'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { Plugin } from './plugin.js'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Config } from '#root/config/index.js'

type Options = {
    routePrefix: string
}

export const Documentation = ioc.add(
    [Config],
    (config): FastifyPluginAsyncTypebox<Options> =>
        Plugin<Options>()(async (server, { routePrefix }) => {
            await server.register(fastifySwagger, {
                openapi: {
                    info: {
                        title: config.packageJson.name,
                        version: config.packageJson.version,
                        description: config.packageJson.version,
                    },
                    servers: [{ url: config.externalUrl }],
                },
            })
            await server.register(fastifySwaggerUi, {
                routePrefix,
            })
        }),
)
