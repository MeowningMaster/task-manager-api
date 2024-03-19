import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import jwt from "jsonwebtoken"
import { ServerError } from "#root/src/error/server-error.js"
import type { Ioc } from "#root/src/ioc/index.js"
import { user } from "#src/services/database/schema/user.js"
import type { Credentials, JwtPayload } from "./schema.js"

export default function userLogic({ database: db, config }: Ioc) {
	return {
		async register({ login, password }: Credentials) {
			const existing = await db.select().from(user).where(eq(user.login, login))
			if (existing.length > 0) {
				throw new ServerError("The login is already taken", {
					code: 400,
					context: { login },
				})
			}

			const salt = await bcrypt.genSalt()
			const passwordHash = await bcrypt.hash(password, salt)

			const [result] = await db.insert(user).values({ login, passwordHash })
			return result.insertId
		},

		async login({ login, password }: Credentials) {
			const [userRecord] = await db
				.select()
				.from(user)
				.where(eq(user.login, login))
			if (!userRecord) {
				throw new ServerError("The user is not registed", {
					code: 400,
					context: { login },
				})
			}

			const permitted = await bcrypt.compare(password, userRecord.passwordHash)
			if (!permitted) {
				throw new ServerError("The password is incorrect", {
					code: 400,
					context: { login },
				})
			}

			const tokenPayload: JwtPayload = {
				id: userRecord.id,
				login,
			}

			return jwt.sign(tokenPayload, config.jwt.secret, {
				expiresIn: config.jwt.expiresIn,
			})
		},

		async delete(userId: number) {
			await db.delete(user).where(eq(user.id, userId))
		},
	}
}
