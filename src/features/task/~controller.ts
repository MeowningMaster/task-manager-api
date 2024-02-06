import { Delete, Get, List, Post, Put } from "./schema.js"
import { Elysia } from "elysia"
import { Ioc } from "#root/src/ioc/index.js"

export default function taskController({ taskLogic, jwtValidator }: Ioc) {
	return new Elysia()
		.use(jwtValidator)
		.get(":id", ({ jwt, params }) => taskLogic.get(jwt.id, params.id), {
			...Get,
		})
		.get("list", ({ jwt, query }) => taskLogic.list(jwt.id, query), {
			...List,
		})
		.post("", ({ jwt, body }) => taskLogic.post(jwt.id, body), {
			...Post,
		})
		.put(
			":id",
			({ jwt, params, body }) => taskLogic.put(jwt.id, params.id, body),
			{ ...Put },
		)
		.delete(":id", ({ jwt, params }) => taskLogic.delete(jwt.id, params.id), {
			...Delete,
		})
}
