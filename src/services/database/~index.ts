import { drizzle } from "drizzle-orm/mysql2"
import mysql from "mysql2/promise"
import type { Ioc } from "#root/src/ioc/index.js"
import * as schema from "./schema/index.js"

export default function database({ config }: Ioc) {
	const pool = mysql.createPool(config.database)
	const db = drizzle(pool, { schema, mode: "default" })
	return db
}
