import {
    mysqlTable,
    serial,
    varchar,
    int,
    text,
    mysqlEnum,
} from 'drizzle-orm/mysql-core'
import { user } from './user.js'
import { utc } from '../custom-columns/date-time.js'

export const task = mysqlTable('task', {
    id: serial('id').primaryKey(),
    userId: int('user_id')
        .references(() => user.id)
        .notNull(),
    title: varchar('name', { length: 256 }).notNull(),
    description: text('description').notNull(),
    status: mysqlEnum('status', ['pending', 'in-progress', 'completed'])
        .notNull()
        .default('pending'),
    notifyDate: utc('notify_date'),
    dueDate: utc('due_date'),
})
