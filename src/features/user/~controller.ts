import { Login, Register } from "./schema.js"
import { Elysia } from "elysia"
import { guardTags } from "#root/src/server/plugins/documentation/guard.js"
import { Ioc } from "#root/src/ioc/index.js"

export default function userController({ userLogic, jwtValidator }: Ioc) {
	return new Elysia()
		.use(guardTags("user"))
		.post("/register", ({ body }) => userLogic.register(body), {
			...Register,
			detail: { description: "Register a new user" },
		})
		.post("/login", ({ body }) => userLogic.login(body), {
			...Login,
			// per-route rate limit is not supported yet: max 5 requests per minute
			detail: {
				description:
					"Get a JWT token for temporary access. The token should be used as a bearer auth",
			},
		})
		.group("", (app) =>
			app.use(jwtValidator).delete(
				"",
				async ({ jwt }) => {
					await userLogic.delete(jwt.id)
				},
				{
					detail: { description: "Delete current user" },
				},
			),
		)
}
