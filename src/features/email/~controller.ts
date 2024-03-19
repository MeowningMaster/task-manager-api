import { Elysia } from "elysia"
import type { Ioc } from "#root/src/ioc/index.js"
import { Confirm, Get, Put } from "./schema.js"

export default function emailController({ jwtValidator, emailLogic }: Ioc) {
	return new Elysia()
		.get("/confirm", ({ query }) => emailLogic.confirm(query.token), {
			...Confirm,
		})
		.use(jwtValidator)
		.get("", ({ jwt }) => emailLogic.get(jwt.id), { ...Get })
		.put(
			"",
			async ({ jwt, body }) => {
				await emailLogic.put(jwt.id, body.email)
				return {
					message: "Check your inbox for confirmation email",
				}
			},
			{ ...Put },
		)
		.delete("", ({ jwt }) => emailLogic.delete(jwt.id), {
			detail: {
				description: "Delete the current user's email address",
			},
		})
}
