import { swagger } from "@elysiajs/swagger"
import { cradle } from "#root/src/ioc/index.js"
import { apiTags } from "./tags"

export const tokenSecuritySchema = "tokenAuth"

export function documentationPlugin({
	path = "/docs",
}: { path?: string } = {}) {
	const { config } = cradle
	return swagger({
		path,
		documentation: {
			openapi: "3.1.0",
			info: {
				title: config.packageJson.name,
				version: config.packageJson.version,
				description: config.packageJson.description,
			},
			tags: Object.values(apiTags),
			servers: [{ url: config.externalUrl }],
			components: {
				securitySchemes: {
					[tokenSecuritySchema]: {
						type: "http",
						scheme: "bearer",
						bearerFormat: "JWT",
					},
				},
			},
		},
	})
}
