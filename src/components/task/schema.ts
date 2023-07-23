import { RouteSchema, StaticRoute } from '#root/server/schema.js'
import { Static, Type } from '@sinclair/typebox'
import * as TypeApi from '#root/validator/open-api.js'

const Status = TypeApi.StringEnum(['pending', 'in-progress', 'completed'])

export const Task = Type.Object({
    id: Type.Integer({ minimum: 0 }),
    userId: Type.Integer({ minimum: 0 }),
    title: Type.String(),
    description: Type.String(),
    status: Status,
    notifyDate: TypeApi.Nullable(Type.String({ format: 'date-time' })),
    dueDate: TypeApi.Nullable(Type.String({ format: 'date-time' })),
})

const Pagination = Type.Object({
    offset: Type.Optional(Type.Integer({ minimum: 0 })),
    limit: Type.Integer({ minimum: 1, default: 50 }),
})

export type Filter = Static<typeof Filter>
const Filter = Type.Partial(Type.Omit(Task, ['id', 'userId']))

const SortOptions = TypeApi.StringEnum(['asc', 'desc'])

export type Sort = Static<typeof Sort>
const Sort = Type.Object({
    title: Type.Optional(SortOptions),
    status: Type.Optional(SortOptions),
    dueDate: Type.Optional(SortOptions),
})

export type List = StaticRoute<typeof List>
export const List = {
    querystring: TypeApi.Deep(
        Type.Intersect([
            Pagination,
            Type.Object({
                filter: Type.Optional(Filter),
                sort: Type.Optional(Sort),
            }),
        ]),
    ),
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

export type Post = StaticRoute<typeof Post>
export const Post = {
    body: Type.Omit(Task, ['id', 'userId']),
} satisfies RouteSchema

export type Put = StaticRoute<typeof Put>
export const Put = {
    params: Type.Object({
        id: Type.Number({ minimum: 0 }),
    }),
    body: Type.Partial(Type.Omit(Task, ['id', 'userId'])),
} satisfies RouteSchema

export const Delete = {
    params: Type.Object({
        id: Type.Number({ minimum: 0 }),
    }),
} satisfies RouteSchema
