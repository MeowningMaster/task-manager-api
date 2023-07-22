import {
    mysqlTable,
    serial,
    varchar,
    char,
    int,
    text,
    mysqlEnum,
    datetime,
    uniqueIndex,
} from 'drizzle-orm/mysql-core'

export const user = mysqlTable(
    'user',
    {
        id: int('id').autoincrement().primaryKey(),
        login: varchar('login', { length: 256 }).notNull(),
        passwordHash: char('password_hash', { length: 60 }).notNull(),
    },
    (user) => ({
        loginIndex: uniqueIndex('login_idx').on(user.login),
    }),
)

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
    notifyDate: datetime('notify_date'),
    dueDate: datetime('due_date'),
})
