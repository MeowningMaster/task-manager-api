import { RouteSchema, StaticRoute } from '#root/server/schema.js'
import { Static, Type } from '@sinclair/typebox'
import * as TypeApi from '#root/validator/open-api.js'
import { ConditionsAdapter } from '#root/validator/conditions-adapter.js'

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
    offset: Type.Integer({ minimum: 0, default: 0 }),
    limit: Type.Integer({ minimum: 1, default: 50 }),
})

export type Filter = Static<typeof Filter>
const Filter = Type.Omit(Task, ['id', 'userId'], {
    description:
        '[Explanation of operators](https://orm.drizzle.team/docs/operators)',
    examples: [
        null,
        { status: { eq: 'pending' } },
        { title: { like: '%work%' } },
        { dueDate: { gt: '2020-00-20T00:00:00Z', lt: '2024-00-00T00:00:00Z' } },
        {
            notifyDate: {
                gte: '2020-00-20T00:00:00Z',
                lte: '2024-00-00T00:00:00Z',
            },
        },
    ],
})

const SortOptions = TypeApi.StringEnum(['asc', 'desc'])

export type Sort = Static<typeof Sort>
const Sort = Type.Object(
    {
        title: Type.Optional(SortOptions),
        status: Type.Optional(SortOptions),
        dueDate: Type.Optional(SortOptions),
    },
    { examples: [null, { title: 'asc' }, { dueDate: 'desc', status: 'asc' }] },
)

export type List = StaticRoute<typeof List>
export const List = {
    description:
        'Get an array of tasks with pagination, filtration and sorting',
    querystring: TypeApi.Deep(
        Type.Intersect([
            Pagination,
            Type.Object({
                filter: Type.Optional(ConditionsAdapter(Filter)),
                sort: Type.Optional(Sort),
            }),
        ]),
    ),
    response: {
        200: Type.Array(Task),
    },
} satisfies RouteSchema

export const Get = {
    description: 'Get a task by id',
    params: Type.Object({
        id: Type.Integer({ minimum: 0 }),
    }),
    response: {
        200: Task,
    },
} satisfies RouteSchema

export type Post = StaticRoute<typeof Post>
export const Post = {
    description: 'Create a new task',
    body: Type.Omit(Task, ['id', 'userId']),
} satisfies RouteSchema

export type Put = StaticRoute<typeof Put>
export const Put = {
    description: 'Modify an existing task',
    params: Type.Object({
        id: Type.Number({ minimum: 0 }),
    }),
    body: Type.Partial(Type.Omit(Task, ['id', 'userId'])),
} satisfies RouteSchema

export const Delete = {
    description: 'Delete a task by id',
    params: Type.Object({
        id: Type.Number({ minimum: 0 }),
    }),
} satisfies RouteSchema
