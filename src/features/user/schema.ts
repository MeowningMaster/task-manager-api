import { Static } from "@sinclair/typebox"
import { RouteSchema, UnwrapRoute, t } from "elysia"

export type Credentials = Static<typeof Credentials>
export const Credentials = t.Object({
	login: t.String({ minLength: 4 }),
	password: t.String({ minLength: 8 }),
})

export type Register = UnwrapRoute<typeof Register>
export const Register = {
	body: Credentials,
	response: {
		200: t.Number({ minimum: 0, description: "id" }),
	},
} satisfies RouteSchema

export type Login = UnwrapRoute<typeof Login>
export const Login = {
	body: Credentials,
	response: {
		200: t.String({ description: "Auth token" }),
	},
} satisfies RouteSchema

export type JwtPayload = {
	id: number
	login: string
}
