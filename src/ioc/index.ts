export type Provider<R = unknown, P extends any[] = any[]> = {
    (...parameters: P): R
}

type Parameters = readonly Provider[]

type ProviderState<Instance = unknown> = {
    parameters?: Parameters
    /** Promise of instance */
    promise?: Promise<Instance>
    /** For debugging and tests */
    name?: string
}

export type Resolve<TProvider extends Provider> = TProvider extends Provider
    ? Awaited<ReturnType<TProvider>>
    : never
export type ResolveParameters<TParameters extends Parameters> = {
    [Key in keyof TParameters]: Resolve<TParameters[Key]>
}

type Writable<T> = { -readonly [P in keyof T]: T[P] }

/** Inverse of control container that resolves providers and theirs dependencies */
export function Container(options: { debug: boolean } = { debug: false }) {
    const states = new Map<Provider, ProviderState>()

    return {
        add<
            const TParameters extends Parameters,
            ResolvedParameters extends unknown[] = Writable<
                ResolveParameters<TParameters>
            >,
            TProvider extends Provider = Provider<unknown, ResolvedParameters>,
        >(
            parameters: TParameters,
            provider: TProvider,
            name?: string,
        ): TProvider {
            states.set(provider, { parameters, name })
            return provider
        },

        get<TProvider extends Provider>(provider: TProvider) {
            return states.get(provider) as
                | ProviderState<Resolve<TProvider>>
                | undefined
        },

        getOrThrow<TProvider extends Provider>(provider: TProvider) {
            const state = this.get(provider)
            if (state === undefined) {
                throw new Error(`Provider isn't registered`)
            }
            return state
        },

        async resolve<TProvider extends Provider>(provider: TProvider) {
            const state = this.getOrThrow(provider)
            if (state.promise !== undefined) {
                return state.promise
            }

            let resolveInstance!: (
                instance: Resolve<TProvider> | PromiseLike<Resolve<TProvider>>,
            ) => void

            state.promise = new Promise((resolve) => {
                resolveInstance = resolve
            })

            const parametersPromises = new Array<Promise<unknown>>()
            if (state.parameters) {
                for (const parameterProvider of state.parameters) {
                    parametersPromises.push(this.resolve(parameterProvider))
                }
            }
            const parametersInstances = await Promise.all(parametersPromises)

            const instance = (await provider(
                ...parametersInstances,
            )) as Promise<Resolve<TProvider>>
            resolveInstance(instance)
            if (options.debug) {
                console.log(`Resolved ${state.name}`)
            }
            return state.promise
        },

        delete(provider: Provider) {
            states.delete(provider)
        },

        clear() {
            states.clear()
        },
    }
}

export const ioc = Container()
