import { ioc } from '#root/ioc/index.js'
import { Queue } from 'bullmq'

export const Notifier = ioc.add([], () => {
    const queue = new Queue('notifications', {
        connection: {
            host: 'localhost',
            port: 7379,
        },
    })
})
