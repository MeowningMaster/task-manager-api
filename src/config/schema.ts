import { Type } from '@sinclair/typebox'

const Jwt = Type.Object({
    secret: Type.String(),
    expiresIn: Type.String(),
})

const Log = Type.Object({
    console: Type.Boolean(),
    file: Type.Optional(Type.String()),
})

const Database = Type.Object({
    host: Type.String(),
    port: Type.Integer({ minimum: 1, maximum: 65535 }),
    database: Type.String(),
    user: Type.String(),
    password: Type.String(),
})

export const Config = Type.Object({
    port: Type.Integer({ minimum: 1, maximum: 65535 }),
    externalUrl: Type.String({ format: 'uri' }),
    trustProxy: Type.Boolean(),
    expose: Type.Boolean(),
    jwt: Jwt,
    log: Log,
    database: Database,
})

export const PackageJson = Type.Object({
    name: Type.String(),
    description: Type.String(),
    version: Type.String(),
})
