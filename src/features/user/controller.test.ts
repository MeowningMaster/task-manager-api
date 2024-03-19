import { faker } from "@faker-js/faker"
import { test } from "vitest"
import { ioc } from "#root/ioc/index.js"
import { partial } from "#root/ioc/partial.js"
import { Server } from "#root/server/index.js"
import type { Credentials, Login, Register } from "./schema.js"

partial(ioc, {
	controllers: ["user"],
	services: ["database"],
})
const { inject } = await ioc.resolve(Server)

const credentials: Credentials = {
	login: faker.internet.userName(),
	password: faker.internet.password(),
}

test("Register", async () => {
	await inject<Register>({
		method: "POST",
		path: "/v1/user/register",
		body: credentials,
	})
})

let bearer: string

test("Login", async () => {
	const { body: token } = await inject<Login>({
		method: "POST",
		path: "/v1/user/login",
		body: credentials,
	})
	bearer = `Bearer ${token}`
})

test("Delete", async () => {
	await inject({
		method: "DELETE",
		path: "/v1/user",
		headers: { authorization: bearer },
	})
})
