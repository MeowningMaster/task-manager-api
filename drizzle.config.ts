import type { Config } from 'drizzle-kit'

export default {
    schema: './dist/database/schema/**/*.js',
    out: './migrations',
} satisfies Config
