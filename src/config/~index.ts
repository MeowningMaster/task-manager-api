import { default as configLib } from "config"
import packageJson from "#root/package.json"
import * as schema from "./schema"
import { validateOrThrow } from "#src/validator"

export default function config() {
	return {
		mode: Bun.env.NODE_ENV as "development" | "production",
		...validateOrThrow(configLib.util.toObject(), schema.Config, "config"),
		packageJson: validateOrThrow(
			packageJson,
			schema.PackageJson,
			"packageJson",
		),
	}
}
