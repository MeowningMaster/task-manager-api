import yaml from 'yaml'
import { ioc } from '#root/ioc/index.js'
import fs from 'node:fs'
import { validate } from '#root/validator/index.js'
import * as schema from './schema.js'

export const Config = ioc.add([], async () => {
    const text = await fs.promises.readFile('config.yaml', 'utf-8')
    const object = yaml.parse(text)
    if (!validate(schema.Config, object)) {
        throw new Error('Config is invalid')
    }
    return object
})
