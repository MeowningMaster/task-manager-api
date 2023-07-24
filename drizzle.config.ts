import type { Config } from 'drizzle-kit'

export default {
    schema: './dist/services/database/schema/**/*.js',
    out: './migrations',
} satisfies Config
