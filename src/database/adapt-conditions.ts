import { ServerError } from '#root/error/server-error.js'
import {
    CompareOperations,
    Conditions,
    compareOperations,
} from '#root/validator/conditions-adapter.js'
import { SQL, eq, isNotNull, isNull, lt, ne, lte, gt, gte } from 'drizzle-orm'
import { MySqlTableWithColumns } from 'drizzle-orm/mysql-core'

const comparators = {
    lt,
    lte,
    gt,
    gte,
} as const satisfies Record<CompareOperations, (letf: SQL, right: SQL) => SQL>

export function adaptConditions(
    table: MySqlTableWithColumns<any>,
    conditions: Conditions,
): SQL<unknown>[] {
    const result: SQL<unknown>[] = []
    for (const [field, params] of Object.entries(conditions)) {
        const colunm = table[field]
        if (params.eq !== undefined) {
            result.push(
                params.eq === null ? isNull(colunm) : eq(colunm, params.eq),
            )
        }
        if (params.ne !== undefined) {
            result.push(
                params.ne === null ? isNotNull(colunm) : ne(colunm, params.ne),
            )
        }
        for (const operation of compareOperations) {
            const value = params[operation]
            if (value === undefined) {
                continue
            }
            if (value === null) {
                throw new ServerError(`${operation} can't be null`, {
                    context: { field },
                })
            }
            result.push(comparators[operation](colunm, value))
        }
    }
    return result
}
