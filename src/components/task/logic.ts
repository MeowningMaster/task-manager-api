import { Database } from '#root/database/index.js'
import { task } from '#root/database/schema.js'
import { ioc } from '#root/ioc/index.js'
import { and, eq } from 'drizzle-orm'
import { Pagination, Post, Put } from './schema.js'
import { ServerError } from '#root/error/server-error.js'

export const Logic = ioc.add([Database], (db) => {
    return {
        async list(userId: number, pagination: Pagination) {
            return db
                .select()
                .from(task)
                .where(eq(task.userId, userId))
                .limit(pagination.take)
                .offset(pagination.skip ?? 0)
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
