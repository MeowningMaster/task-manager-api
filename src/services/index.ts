import { Provider } from '#root/ioc/index.js'
import { Database } from './database/index.js'
import { Mailer } from './mailer.js'
import { Notifier } from './notifier.js'

const services = {
    database: Database,
    mailer: Mailer,
    notifier: Notifier,
} as const satisfies Record<string, Provider>
