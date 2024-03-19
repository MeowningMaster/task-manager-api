import { drizzle } from "drizzle-orm/mysql2"
import { migrate } from "drizzle-orm/mysql2/migrator"
import mysql from "mysql2/promise"
import type { Ioc } from "#root/src/ioc/index.js"
import { delay } from "#src/utilities/delay.js"
import * as schema from "./schema/index.js"

export default async function databaseInit({ config, log }: Ioc) {
	async function waitForConnection(maxRetries = 20, retryIntervalMs = 3000) {
		for (let attempt = 1; attempt <= maxRetries; attempt++) {
			try {
				const connenction = await mysql.createConnection(config.database)
				await connenction.end()
				return
			} catch (error) {
				log.warn(
					{
						attempt,
						maxRetries,
						error,
					},
					"Database connection not established",
				)
				await delay(retryIntervalMs)
			}
		}
		throw new Error("Unable to establish database connection")
	}
	await waitForConnection()
	const connection = await mysql.createConnection(config.database)
	const db = drizzle(connection, { schema, mode: "default" })
	await migrate(db, { migrationsFolder: "./migrations" })
}
