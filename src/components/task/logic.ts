import { Database } from '#root/database/index.js'
import { task } from '#root/database/schema.js'
import { ioc } from '#root/ioc/index.js'
import { eq } from 'drizzle-orm'
import { Pagination } from './schema.js'

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
    }
})
