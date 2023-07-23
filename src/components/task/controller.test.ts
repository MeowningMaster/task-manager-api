import { ioc } from '#root/ioc/index.js'
import { Server } from '#root/server/index.js'
import { afterAll, beforeAll, expect, test } from 'vitest'
import { Credentials } from '../user/schema.js'
import { faker } from '@faker-js/faker'
import * as user from '../user/index.js'
import { Get, List, Post, Task, statuses } from './schema.js'
import { partial } from '#root/ioc/partial.js'

const userLogic = await ioc.resolve(user.Logic)

const credentials: Credentials = {
    login: faker.internet.userName(),
    password: faker.internet.password(),
}

let bearer: string
let userId: number

beforeAll(async () => {
    userId = await userLogic.register(credentials)
    const token = await userLogic.login(credentials)
    bearer = `Bearer ${token}`
})

afterAll(() => {
    userLogic.delete(userId)
})

partial(ioc, {
    controllers: ['task'],
    services: ['database'],
})
const { inject } = await ioc.resolve(Server)

function generateTask(): Omit<Task, 'id' | 'userId'> {
    return {
        title: faker.lorem.words(),
        description: faker.lorem.paragraph(),
        status: faker.helpers.arrayElement(statuses),
        notifyDate:
            faker.helpers.maybe(() => faker.date.future().toISOString()) ??
            null,
        dueDate:
            faker.helpers.maybe(() => faker.date.future().toISOString()) ??
            null,
    }
}

const tasks = faker.helpers.multiple(generateTask)
const ids = new Array<number>()

test('Create', async () => {
    for (const task of tasks) {
        const { body: id } = await inject<Post>({
            method: 'POST',
            path: '/v1/task/',
            headers: { authorization: bearer },
            body: task,
        })
        ids.push(id)
    }
})

test('Get', async () => {
    const { body: record } = await inject<Get>({
        method: 'GET',
        path: `/v1/task/${ids[0]}`,
        headers: { authorization: bearer },
    })
    expect(record).to.include(tasks[0])
})

test('List', async () => {
    const { body: records } = await inject<List>({
        method: 'GET',
        path: '/v1/task/list',
        headers: { authorization: bearer },
    })
    tasks.forEach((task, index) => expect(records[index]).to.include(task))
})

test('Delete', async () => {
    for (const id of ids) {
        await inject({
            method: 'DELETE',
            path: `/v1/task/${id}`,
            headers: { authorization: bearer },
        })
    }
})
