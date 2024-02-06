type ApiTag = {
	name: string
	description?: string
}

export type ApiTags = keyof typeof apiTags
export const apiTags = reflect({
	user: {},
	task: {},
	email: {
		description: "A user can have maximum of one email address",
	},
})

type RawTags = Record<string, Partial<ApiTag>>
type Reflect<T extends RawTags> = { [K in keyof T]: T & { name: K } }
function reflect<T extends RawTags>(tags: T) {
	for (const key in tags) {
		tags[key].name = key
	}
	return tags as unknown as Reflect<T>
}
