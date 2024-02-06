import { Elysia } from "elysia"
// import { ip } from "elysia-ip"
import { Ioc } from "../ioc"

export default function rootLocator({ config, log }: Ioc) {
	return (
		new Elysia({ name: "setup" })
			//* ip does not show in context
			// .use(
			// 	ip({
			// 		checkHeaders: cradle.config.trustProxy
			// 			? ["X-Forwarded-For", "Forwarded", "CF-Connecting-IP", "X-Client-IP"]
			// 			: [],
			// 	}),
			// )
			.use(log.into({ autoLogging: false }))
	)
}
