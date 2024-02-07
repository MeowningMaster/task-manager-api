import { cradle } from "./ioc"

const { server, databaseInit, config } = cradle
await databaseInit
server.listen()

console.info(config)
