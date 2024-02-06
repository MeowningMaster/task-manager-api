import { TypeCompiler } from "@sinclair/typebox/compiler"
import type { TAnySchema, Static } from "@sinclair/typebox"

export function validate<Schema extends TAnySchema>(
	data: unknown,
	schema: Schema,
): data is Static<Schema> {
	return TypeCompiler.Compile(schema).Check(data)
}

export function validateOrThrow<Schema extends TAnySchema>(
	data: unknown,
	schema: Schema,
	context: string,
): Static<Schema> {
	const validator = TypeCompiler.Compile(schema)
	if (!validator.Check(data)) {
		const errors = [...validator.Errors(data)]
		throw new Error(`Validation failed (${context}): ${JSON.stringify(errors)}`)
	}
	return data as Static<Schema>
}
