import { TSchema, Type } from "@sinclair/typebox"

function Nullable<T extends TSchema>(schema: T) {
	return Type.Union([Type.Null(), schema])
}

function StringEnum<T extends readonly string[]>(values: readonly [...T]) {
	return Type.Unsafe<T[number]>({ type: "string", enum: values })
}

/** [docs](https://swagger.io/docs/specification/serialization) */
function Deep<T extends TSchema>(schema: T) {
	return Type.Unsafe({
		...schema,
		style: "deepObject",
	}) as T
}

export const tApi = {
	Nullable,
	StringEnum,
	Deep,
}
