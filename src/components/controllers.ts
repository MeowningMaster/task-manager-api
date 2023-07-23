import { Provider, ioc } from '#root/ioc/index.js'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'

import * as task from './task/index.js'
import * as user from './user/index.js'
import * as email from './email/index.js'

const controllers: Array<
    [
        prefix: string,
        component: { Controller: Provider<FastifyPluginAsyncTypebox> },
    ]
> = [
    ['/task', task],
    ['/user', user],
    ['/email', email],
]

export const Controllers = ioc.add(
    controllers.map(([, component]) => component.Controller),
    (...plugins): FastifyPluginAsyncTypebox =>
        async (server) => {
            await Promise.all(
                plugins.map((plugin, index) => {
                    const [prefix] = controllers[index]
                    return server.register(plugin, { prefix })
                }),
            )
        },
)
