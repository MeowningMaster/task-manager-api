import { ioc } from './ioc/index.js'
import { Server } from './server/index.js'

const server = await ioc.resolve(Server)
await server.listen()
