import { type ConnectionOptions, Queue, Worker } from "bullmq"
import { type Ioc, cradle } from "../ioc/index.js"

const queueName = "notifications"

type JobData = {
	userId: number
}

const jobIdManager = {
	prefix: "task-",
	create(taskId: number) {
		return `${this.prefix}${taskId}`
	},
	parse(jobId: string) {
		return Number.parseInt(jobId.substring(this.prefix.length))
	},
}

export default function notifier(ioc: Ioc) {
	const { config, mailer, emailLogic } = ioc
	const connection: ConnectionOptions = config.redis

	if (config.redis.auth) {
		connection.username = config.redis.auth.user
		connection.password = config.redis.auth.pass
	}

	const queue = new Queue<JobData>(queueName, {
		connection,
	})

	new Worker<JobData>(
		queueName,
		async (job) => {
			const taskLogic = cradle.taskLogic

			// biome-ignore lint/style/noNonNullAssertion: todo
			const taskId = jobIdManager.parse(job.id!)
			const { userId } = job.data

			const taskRecord = await taskLogic.get(userId, taskId)
			if (!taskRecord) {
				return "Task not found"
			}

			const emailRecord = await emailLogic.get(userId)
			if (!emailRecord) {
				return "No email"
			}
			if (!emailRecord.confirmed) {
				return "Email not confirmed"
			}

			await mailer.sendTaskNotification(emailRecord.email, taskRecord)
			return `Sent to ${emailRecord.email}`
		},
		{
			connection,
			removeOnComplete: {
				count: 1000,
			},
			removeOnFail: {
				count: 5000,
			},
		},
	)

	return {
		async set(userId: number, taskId: number, notifyDate: Date | null) {
			const jobId = jobIdManager.create(taskId)

			const job = await queue.getJob(jobId)

			if (notifyDate === null || notifyDate <= new Date()) {
				if (job) {
					await job.remove()
				}
				return
			}

			const delay = Number(notifyDate) - Date.now()

			if (job) {
				await job.changeDelay(delay)
			} else {
				await queue.add("Notify", { userId }, { jobId, delay })
			}
		},
	}
}
