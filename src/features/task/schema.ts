import { Static } from "@sinclair/typebox"
import { ConditionsAdapter } from "#src/validator/conditions-adapter.js"
import { tApi } from "#root/src/validator/open-api"
import { RouteSchema, UnwrapRoute, t } from "elysia"

export const statuses = ["pending", "in-progress", "completed"] as const
const Status = tApi.StringEnum(statuses)

export type Task = Static<typeof Task>
export const Task = t.Object({
	id: t.Integer({ minimum: 0 }),
	userId: t.Integer({ minimum: 0 }),
	title: t.String(),
	description: t.String(),
	status: Status,
	notifyDate: t.Nullable(t.Date()),
	dueDate: t.Nullable(t.Date()),
})

const Pagination = t.Object({
	offset: t.Integer({ minimum: 0, default: 0 }),
	limit: t.Integer({ minimum: 1, default: 50 }),
})

export type Filter = Static<typeof Filter>
const Filter = t.Omit(Task, ["id", "userId"], {
	description:
		"[Explanation of operators](https://orm.drizzle.team/docs/operators)",
	examples: [
		null,
		{ status: { eq: "pending" } },
		{ title: { like: "%work%" } },
		{ dueDate: { gt: "2020-01-20T00:00:00Z", lt: "2024-01-01T00:00:00Z" } },
		{
			notifyDate: {
				gte: "2020-01-20T00:00:00Z",
				lte: "2024-01-01T00:00:00Z",
			},
		},
	],
})

const SortOptions = tApi.StringEnum(["asc", "desc"])

export type Sort = Static<typeof Sort>
const Sort = t.Object(
	{
		title: t.Optional(SortOptions),
		status: t.Optional(SortOptions),
		dueDate: t.Optional(SortOptions),
	},
	{ examples: [null, { title: "asc" }, { dueDate: "desc", status: "asc" }] },
)

export type List = UnwrapRoute<typeof List>
export const List = {
	// description: "Get an array of tasks with pagination, filtration and sorting",
	query: tApi.Deep(
		t.Composite([
			Pagination,
			t.Object({
				filter: t.Optional(ConditionsAdapter(Filter)),
				sort: t.Optional(Sort),
			}),
		]),
	),
	response: {
		200: t.Array(Task),
	},
} satisfies RouteSchema

export type Get = UnwrapRoute<typeof Get>
export const Get = {
	// description: "Get a task by id",
	params: t.Object({
		id: t.Integer({ minimum: 0 }),
	}),
	response: t.Nullable(Task),
} satisfies RouteSchema

export type Post = UnwrapRoute<typeof Post>
export const Post = {
	// description: "Create a new task",
	body: t.Omit(Task, ["id", "userId"]),
	response: {
		200: t.Number({ minimum: 0, description: "id" }),
	},
} satisfies RouteSchema

export type Put = UnwrapRoute<typeof Put>
export const Put = {
	// description: "Modify an existing task",
	params: t.Object({
		id: t.Number({ minimum: 0 }),
	}),
	body: t.Partial(t.Omit(Task, ["id", "userId"])),
} satisfies RouteSchema

export const Delete = {
	// description: "Delete a task by id",
	params: t.Object({
		id: t.Number({ minimum: 0 }),
	}),
} satisfies RouteSchema
