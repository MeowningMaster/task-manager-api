import { ServerError } from "#src/error/server-error.js"
import { tokenSecuritySchema } from "#src/server/plugins/documentation/index.js"
import { Elysia } from "elysia"
import { JwtPayload } from "../../features/user/schema.js"
import jwt from "jsonwebtoken"
import { Ioc } from "#root/src/ioc/index.js"

export const tokenHeader = "authorization" as const
const bearerPrefix = "Bearer " as const

export function jwtValidator({ config }: Ioc) {
	return new Elysia()
		.guard({
			detail: {
				security: [{ [tokenSecuritySchema]: [] }],
			},
		})
		.state("jwt", null as JwtPayload | null)
		.onRequest(({ request, store }) => {
			const header = request.headers.get(tokenHeader)
			if (!header) {
				throw new ServerError("No Authorization header", { code: 401 })
			}

			if (!header.startsWith(bearerPrefix)) {
				throw new ServerError("Authorization must be Bearer", {
					code: 400,
					context: { header },
				})
			}

			const token = header.substring(bearerPrefix.length)

			try {
				const payload = jwt.verify(token, config.jwt.secret)
				store.jwt = payload as JwtPayload
			} catch (error) {
				if (error instanceof Error) {
					throw new ServerError(error.message, {
						code: 400,
						context: { header },
					})
				}

				throw new ServerError("Unknown error during JWT validation", {
					context: { header, error },
				})
			}
		})
}
