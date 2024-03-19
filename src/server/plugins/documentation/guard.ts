import { Elysia } from "elysia"
import type { ApiTags } from "./tags.js"

// doesn't work well with guard in jwtValidator
export const guardTags = (...tags: ApiTags[]) =>
	new Elysia().guard({
		detail: {
			tags,
		},
	})
