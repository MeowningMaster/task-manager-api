import { Static, TSchema, Type } from '@sinclair/typebox'

export function Nullable<T extends TSchema>(schema: T) {
    return Type.Unsafe<Static<T> | null>({ ...schema, nullable: true })
}

export function StringEnum<T extends string[]>(values: [...T]) {
    return Type.Unsafe<T[number]>({ type: 'string', enum: values })
}

export function Date() {
    return Type.Unsafe<Date>({ type: 'string', format: 'date-time' })
}
