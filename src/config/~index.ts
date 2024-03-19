import { default as configLib } from "config"
import packageJson from "#root/package.json"
import { validateOrThrow } from "#src/validator"
import * as schema from "./schema"

export default function config() {
	const config = validateOrThrow(
		configLib.util.toObject(),
		schema.Config,
		"config",
	)

	config.port = toInt(config.port)
	config.database.port = toInt(config.database.port)
	config.mailer.port = toInt(config.mailer.port)
	config.redis.port = toInt(config.redis.port)

	return {
		mode: Bun.env.NODE_ENV as "development" | "production",
		...config,
		packageJson: validateOrThrow(
			packageJson,
			schema.PackageJson,
			"packageJson",
		),
	}
}

function toInt(value: string | number) {
	if (typeof value === "number") return value
	return Number.parseInt(value)
}
