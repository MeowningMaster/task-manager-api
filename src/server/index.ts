import { Config } from '#root/config/index.js'
import { ioc } from '#root/ioc/index.js'
import { Logger } from '#root/logger/index.js'
import { validator } from '#root/validator/index.js'
import fastify from 'fastify'

export const Server = ioc.add([Config, Logger], async (config, log) => {
    const server = fastify({
        trustProxy: config.trustProxy,
    })
    server.setValidatorCompiler(({ schema }) => validator.compile(schema))

    return {
        async listen() {
            const host = config.expose
                ? '0.0.0.0' // all interfaces
                : '127.0.0.1' // localhost
            await server.listen({ port: config.port, host })

            log.info(
                {
                    local: `http://${host}:${config.port}`,
                    external: config.externalUrl,
                },
                'Server listening',
            )
        },
    }
})
