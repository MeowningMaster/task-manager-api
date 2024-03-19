// This file is auto-generated. Do not edit it manually.

import config from "./config/~index.js"
import emailController from "./features/email/~controller.js"
import emailLogic from "./features/email/~logic.js"
import taskController from "./features/task/~controller.js"
import taskLogic from "./features/task/~logic.js"
import userController from "./features/user/~controller.js"
import userLogic from "./features/user/~logic.js"
import featuresController from "./features/~controller.js"
import log from "./logger/~index.js"
import jwtValidator from "./server/plugins/~jwt-validator.js"
import server from "./server/~index.js"
import rootLocator from "./server/~locator.js"
import database from "./services/database/~index.js"
import databaseInit from "./services/database/~init.js"
import mailer from "./services/~mailer.js"
import notifier from "./services/~notifier.js"

export default {
	mailer,
	notifier,
	rootLocator,
	log,
	config,
	featuresController,
	server,
	databaseInit,
	database,
	emailController,
	emailLogic,
	jwtValidator,
	taskController,
	taskLogic,
	userLogic,
	userController,
}
