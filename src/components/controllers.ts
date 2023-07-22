import { Provider, ioc } from '#root/ioc/index.js'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'

import * as task from '#root/components/task/index.js'
import * as user from '#root/components/user/index.js'

const controllers: Array<
    [
        prefix: string,
        component: { Controller: Provider<FastifyPluginAsyncTypebox> },
    ]
> = [
    ['/task', task],
    ['/user', user],
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
