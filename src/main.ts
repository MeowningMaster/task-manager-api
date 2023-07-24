import { ioc } from './ioc/index.js'
import { partial } from './ioc/partial.js'
import { Server } from './server/index.js'

partial(ioc, {
    controllers: ['task'],
    services: ['database', 'notifier'],
})
const server = await ioc.resolve(Server)
await server.listen()
