import { Config } from '#root/config/index.js'
import { ioc } from '#root/ioc/index.js'
import mysql from 'mysql2/promise'
import { drizzle } from 'drizzle-orm/mysql2'
import { migrate } from 'drizzle-orm/mysql2/migrator'

export const Database = ioc.add([Config], async (config) => {
    const pool = mysql.createPool(config.database)

    const db = drizzle(pool)
    await migrate(db, { migrationsFolder: './migrations' })
    return db
})
