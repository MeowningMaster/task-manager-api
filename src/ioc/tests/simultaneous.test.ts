import { Container } from '../index.js'
import { expect, test } from 'vitest'

const ioc = Container({ debug: true })

const message: string = 'hello world'

const A = ioc.add(
    [],
    () => ({
        getMessage: () => message,
    }),
    'A',
)
const B = ioc.add([A], (a) => a, 'B')
const C = ioc.add([A], (a) => a, 'C')

test('simultaneous', async () => {
    const providers = [B, C, A]
    const [b, c, a] = await Promise.all(providers.map(ioc.resolve.bind(ioc)))
    expect(b.getMessage()).toBe(message)
    expect(c.getMessage()).toBe(message)
    expect(a.getMessage()).toBe(message)
})
