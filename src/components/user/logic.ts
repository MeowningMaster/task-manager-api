import { Database } from '#root/database/index.js'
import { user } from '#root/database/schema.js'
import { ioc } from '#root/ioc/index.js'
import { eq } from 'drizzle-orm'
import { JwtPayload, Credentials } from './schema.js'
import { ServerError } from '#root/error/server-error.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Config } from '#root/config/index.js'

export const Logic = ioc.add([Database, Config], (db, config) => {
    return {
        async register({ login, password }: Credentials) {
            const existing = await db
                .select()
                .from(user)
                .where(eq(user.login, login))
            if (existing.length > 0) {
                throw new ServerError('The login is already taken', {
                    code: 400,
                    context: { login },
                })
            }

            const salt = await bcrypt.genSalt()
            const passwordHash = await bcrypt.hash(password, salt)

            await db.insert(user).values({ login, passwordHash })
        },

        async login({ login, password }: Credentials) {
            const [record] = await db
                .select()
                .from(user)
                .where(eq(user.login, login))
            if (!record) {
                throw new ServerError('The user is not registed', {
                    code: 400,
                    context: { login },
                })
            }

            const permitted = await bcrypt.compare(
                password,
                record.passwordHash,
            )
            if (!permitted) {
                throw new ServerError('The password is incorrect', {
                    code: 400,
                    context: { login },
                })
            }

            const tokenPayload: JwtPayload = { id: record.id, login }

            return jwt.sign(tokenPayload, config.jwt.secret, {
                expiresIn: config.jwt.expiresIn,
            })
        },
    }
})
