import { Elysia } from "elysia"
import { ApiTags } from "./tags.js"

export const guardTags = (...tags: ApiTags[]) =>
	new Elysia().guard({
		detail: {
			tags,
		},
	})
