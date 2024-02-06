import { Elysia } from "elysia"
import { userController } from "./user/controller"

export const featuresController = new Elysia().group("/user", (app) =>
	app.use(userController),
)
