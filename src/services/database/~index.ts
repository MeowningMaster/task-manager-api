import mysql from "mysql2/promise"
import { drizzle } from "drizzle-orm/mysql2"
import * as schema from "./schema/index.js"
import { Ioc } from "#root/src/ioc/index.js"

export default function database({ config }: Ioc) {
	const pool = mysql.createPool(config.database)
	const db = drizzle(pool, { schema, mode: "default" })
	return db
}
