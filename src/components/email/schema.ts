import { RouteSchema } from '#root/server/route-schema.js'
import { Type } from '@sinclair/typebox'
import * as TypeApi from '#root/validator/open-api.js'

export const Get = {
    description: "Get the current user's email address",
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
    description:
        "Set the current user's email address. It should be confirmed by the link in the email",
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
    description: "Confirm the current user's email address via token",
    querystring: Type.Object({
        token: Type.String(),
    }),
} satisfies RouteSchema

export type JwtPayload = { email: string }
