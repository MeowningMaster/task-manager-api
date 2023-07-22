export class ServerError extends Error {
    code: number
    /** Context is shown to user */
    context?: unknown
    /** Only logged. Isn't shown to user */
    logs?: unknown

    constructor(options: {
        message: string
        code?: number
        context?: unknown
        logs?: unknown
    }) {
        super(options.message)
        this.message = options.message
        this.code = options.code ?? 500
        this.context = options.context
        this.logs = options.logs
    }
}
