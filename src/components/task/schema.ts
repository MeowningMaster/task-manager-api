import { RouteSchema } from '#root/server/schema.js'
import { Static, Type } from '@sinclair/typebox'
import * as TypeApi from '#root/validator/open-api.js'

const Status = TypeApi.StringEnum(['pending', 'in-progress', 'completed'])

export const Task = Type.Object({
    id: Type.Integer({ minimum: 0 }),
    userId: Type.Integer({ minimum: 0 }),
    title: Type.String(),
    description: Type.String(),
    status: Status,
    notifyDate: TypeApi.Nullable(TypeApi.Date()),
    dueDate: TypeApi.Nullable(TypeApi.Date()),
})

export type Pagination = Static<typeof Pagination>
const Pagination = Type.Object({
    skip: Type.Optional(Type.Integer({ minimum: 0 })),
    take: Type.Integer({ minimum: 1, default: 50 }),
})

export const List = {
    querystring: Pagination,
    response: {
        200: Type.Array(Task),
    },
} satisfies RouteSchema

export const Get = {
    params: Type.Object({
        id: Type.Integer({ minimum: 0 }),
    }),
    response: {
        200: Task,
    },
} satisfies RouteSchema
