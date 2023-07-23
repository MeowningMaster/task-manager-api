import { Database } from '#root/database/index.js'
import { task } from '#root/database/schema/task.js'
import { ioc } from '#root/ioc/index.js'
import { SQL, and, asc, desc, eq, isNull } from 'drizzle-orm'
import { Filter, List, Post, Put, Sort } from './schema.js'
import { ServerError } from '#root/error/server-error.js'

export const Logic = ioc.add([Database], (db) => {
    return {
        async list(userId: number, options: List['querystring']) {
            let query = db
                .select()
                .from(task)
                .limit(options.limit)
                .offset(options.offset ?? 0)
            const conditions: SQL<unknown>[] = [eq(task.userId, userId)]
            if (options.filter) {
                for (const [field, value] of Object.entries(options.filter)) {
                    const colunm = task[field as keyof Filter]
                    conditions.push(
                        value === null ? isNull(colunm) : eq(colunm, value),
                    )
                }
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

        async get(userId: number, taskId: number) {
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
            await db.insert(task).values({ ...options, userId })
        },

        async put(userId: number, taskId: number, options: Put['body']) {
            await db
                .update(task)
                .set(options)
                .where(and(eq(task.userId, userId), eq(task.id, taskId)))
        },

        async delete(userId: number, taskId: number) {
            await db
                .delete(task)
                .where(and(eq(task.userId, userId), eq(task.id, taskId)))
        },
    }
})
