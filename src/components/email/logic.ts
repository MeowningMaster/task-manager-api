import { Config } from '#root/config/index.js'
import { Database } from '#root/database/index.js'
import { email } from '#root/database/schema/email.js'
import { ioc } from '#root/ioc/index.js'
import { InferModel, and, eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'
import { JwtPayload } from './schema.js'
import { Mailer } from './mailer.js'

export const Logic = ioc.add(
    [Database, Config, Mailer],
    (db, config, mailer) => {
        return {
            async get(
                userId: number,
            ): Promise<InferModel<typeof email> | undefined> {
                const [record] = await db
                    .select()
                    .from(email)
                    .where(and(eq(email.userId, userId)))
                return record
            },

            async put(userId: number, emailValue: string) {
                const existing = await this.get(userId)

                if (existing === undefined) {
                    await db
                        .insert(email)
                        .values({ userId, email: emailValue, confirmed: false })
                } else {
                    await db
                        .update(email)
                        .set({ email: emailValue, confirmed: false })
                        .where(eq(email.userId, userId))
                }

                const payload: JwtPayload = { email: emailValue }
                const token = jwt.sign(payload, config.jwt.secret)

                await mailer.sendEmailConfirmation(emailValue, token)
            },

            async confirm(token: string) {
                const { email: emailValue } = jwt.verify(
                    token,
                    config.jwt.secret,
                ) as JwtPayload

                await db
                    .update(email)
                    .set({ confirmed: true })
                    .where(eq(email.email, emailValue))
            },

            async delete(userId: number) {
                await db.delete(email).where(eq(email.userId, userId))
            },
        }
    },
)
