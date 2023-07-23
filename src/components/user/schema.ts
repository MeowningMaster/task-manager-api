import { RouteSchema } from '#root/server/schema.js'
import { Static, Type } from '@sinclair/typebox'

export type Credentials = Static<typeof Credentials>
export const Credentials = Type.Object({
    login: Type.String({ minLength: 4 }),
    password: Type.String({ minLength: 8 }),
})

export const Register = {
    description: 'Register a new user',
    body: Credentials,
} satisfies RouteSchema

export const Login = {
    description:
        'Get a JWT token for temporary access. The token should be used as a bearer auth',
    body: Credentials,
    response: {
        200: Type.String({ description: 'Auth token' }),
    },
} satisfies RouteSchema

export type JwtPayload = {
    id: number
    login: string
}
