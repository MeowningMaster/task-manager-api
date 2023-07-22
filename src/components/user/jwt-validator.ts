import { Config } from '#root/config/index.js'
import { ServerError } from '#root/error/server-error.js'
import { ioc } from '#root/ioc/index.js'
import { tokenSecuritySchema } from '#root/server/documentation/index.js'
import { Plugin } from '#root/server/plugin.js'
import { JwtPayload } from './schema.js'
import jwt from 'jsonwebtoken'

declare module 'fastify' {
    interface FastifyRequest {
        jwt: JwtPayload
    }
}

export const tokenHeader = 'authorization' as const

type Security = { [securityLabel: string]: readonly string[] }

export const JwtValidator = ioc.add([Config], (config) =>
    Plugin()((server, {}, done) => {
        server.addHook('onRoute', (route) => {
            route.schema ??= {}
            route.schema.security ??= []
            ;(route.schema.security as Security[]).push({
                [tokenSecuritySchema]: [],
            })
        })

        server.decorateRequest('jwt', null)

        server.addHook('preHandler', (request, reply, done) => {
            const token = request.headers[tokenHeader]
            if (!token) {
                done(new ServerError('No Authorization header'))
                return
            }

            try {
                const payload = jwt.verify(token, config.jwt.secret)
                request.jwt = payload as JwtPayload
                done()
            } catch (error) {
                if (error instanceof Error) {
                    // todo: handle jwt errors gently
                    done(error)
                } else {
                    done(
                        new ServerError('Unknown error during JWT validation', {
                            context: { token, error },
                        }),
                    )
                }
            }
        })

        done()
    }),
)
