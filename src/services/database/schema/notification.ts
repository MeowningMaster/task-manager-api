import { mysqlTable, serial, int, index } from 'drizzle-orm/mysql-core'
import { task } from './task.js'

export const notification = mysqlTable(
    'notification',
    {
        taskId: serial('task_id')
            .primaryKey()
            .references(() => task.id, { onDelete: 'cascade' }),
        /** bullmq job id */
        jobId: int('job_id').notNull(),
    },
    (task) => ({
        jobIdIndex: index('job_id_idx').on(task.taskId),
    }),
)
