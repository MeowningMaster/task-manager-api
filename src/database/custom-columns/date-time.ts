import { customType } from 'drizzle-orm/mysql-core'

/** Workaround from [issue](https://github.com/drizzle-team/drizzle-orm/discussions/833#discussioncomment-6502556) */
export const utc = (name: string, precision = 3) =>
    customType<{ data: string; driverData: string }>({
        dataType() {
            return `datetime(${precision})`
        },
        toDriver(date) {
            return date.slice(0, 19).replace('T', ' ')
        },
        fromDriver(date) {
            return date.replace(' ', 'T') + 'Z'
        },
    })(name)
