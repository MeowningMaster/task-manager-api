import { RouteSchema } from '#root/server/schema.js'
import { Type } from '@sinclair/typebox'
import * as TypeApi from '#root/validator/open-api.js'

export const Get = {
    response: {
        200: TypeApi.Nullable(
            Type.Object({
                email: Type.String(),
                confirmed: Type.Boolean(),
            }),
        ),
    },
} satisfies RouteSchema

export const Put = {
    body: Type.Object({
        email: Type.String({ format: 'email' }),
    }),
    response: {
        200: Type.Object({
            message: Type.String(),
        }),
    },
} satisfies RouteSchema

export const Confirm = {
    querystring: Type.Object({
        token: Type.String(),
    }),
} satisfies RouteSchema

export type JwtPayload = { email: string }
