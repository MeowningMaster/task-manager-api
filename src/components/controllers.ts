import { Provider, ioc } from '#root/ioc/index.js'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'

import * as task from './task/index.js'
import * as user from './user/index.js'
import * as email from './email/index.js'

export type Controllers = keyof typeof controllers

export const controllers = {
    task: ['/task', task],
    user: ['/user', user],
    email: ['/email', email],
} as const satisfies Record<
    string,
    readonly [
        prefix: string,
        component: { Controller: Provider<FastifyPluginAsyncTypebox> },
    ]
>

export const Controllers = ioc.add(
    [],
    (): FastifyPluginAsyncTypebox => async (server) => {
        const enabledControllers = Object.values(controllers).filter(
            ([, component]) => {
                const state = ioc.getOrThrow(component.Controller)
                return !state.disabled
            },
        )
        await Promise.all(
            enabledControllers.map(async ([prefix, component]) => {
                const plugin = await ioc.resolve(component.Controller)
                server.register(plugin, { prefix })
            }),
        )
    },
)
