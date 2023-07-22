import { Static, Type } from '@sinclair/typebox'

const Jwt = Type.Object({
    secret: Type.String(),
    expiresIn: Type.String(),
})

const Log = Type.Object({
    console: Type.Boolean(),
    file: Type.Optional(Type.String()),
})

export type Config = Static<typeof Config>
export const Config = Type.Object({
    port: Type.Integer({ minimum: 1, maximum: 65535 }),
    externalUrl: Type.String({ format: 'uri' }),
    trustProxy: Type.Boolean(),
    expose: Type.Boolean(),
    jwt: Jwt,
    log: Log,
})
