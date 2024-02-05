import { ioc } from '#root/ioc/index.js'
import { InferModel, SQL, and, asc, desc, eq } from 'drizzle-orm'
import { List, Post, Put, Sort } from './schema.js'
import { ServerError } from '#root/error/server-error.js'
import { Database } from '#root/services/database/index.js'
import { task } from '#root/services/database/schema/task.js'
import { adaptConditions } from '#root/services/database/adapt-conditions.js'
import { Notifier } from '#root/services/notifier.js'

export const Logic = ioc.add([Database, Notifier], (db, notifier) => {
    return {
        async list(userId: number, options: List['querystring']) {
            let query = db
                .select()
                .from(task)
                .limit(options.limit)
                .offset(options.offset ?? 0)
								.$dynamic()
            const conditions: SQL<unknown>[] = [eq(task.userId, userId)]
            if (options.filter) {
                conditions.push(...adaptConditions(task, options.filter))
            }
            query = query.where(and(...conditions))
            if (options.sort) {
                query = query.orderBy(
                    ...Object.entries(options.sort).map(([field, order]) => {
                        const operation = order === 'asc' ? asc : desc
                        return operation(task[field as keyof Sort])
                    }),
                )
            }
            return await query
        },

        async get(
            userId: number,
            taskId: number,
        ): Promise<InferModel<typeof task> | undefined> {
            const [record] = await db
                .select()
                .from(task)
                .where(and(eq(task.userId, userId), eq(task.id, taskId)))

            if (!record) {
                throw new ServerError('Task not found', {
                    code: 400,
                    context: { userId, taskId },
                })
            }

            return record
        },

        async post(userId: number, options: Post['body']) {
            const [result] = await db
                .insert(task)
                .values({ ...options, userId })
            const taskId = result.insertId

            if (options.notifyDate) {
                await notifier.set(userId, taskId, options.notifyDate)
            }

            return taskId
        },

        async put(userId: number, taskId: number, options: Put['body']) {
            await db
                .update(task)
                .set(options)
                .where(and(eq(task.userId, userId), eq(task.id, taskId)))

            await notifier.set(userId, taskId, options.notifyDate ?? null)
        },

        async delete(userId: number, taskId: number) {
            await db
                .delete(task)
                .where(and(eq(task.userId, userId), eq(task.id, taskId)))

            await notifier.set(userId, taskId, null)
        },
    }
})
