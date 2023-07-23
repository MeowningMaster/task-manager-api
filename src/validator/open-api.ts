import { Static, TObject, TSchema, Type } from '@sinclair/typebox'

export function Nullable<T extends TSchema>(schema: T) {
    return Type.Unsafe<Static<T> | null>({ ...schema, nullable: true })
}

export function StringEnum<T extends string[]>(values: [...T]) {
    return Type.Unsafe<T[number]>({ type: 'string', enum: values })
}

/** [docs](https://swagger.io/docs/specification/serialization) */
export function Deep<T extends TObject>(object: T) {
    return Type.Unsafe({
        ...object,
        style: 'deepObject',
        explode: true,
    }) as T
}
