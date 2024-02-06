import { cradle } from "./ioc"

const { server, databaseInit } = cradle
await databaseInit
server.listen()
