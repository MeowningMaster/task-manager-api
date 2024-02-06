import { createContainer, asFunction, type AwilixContainer } from "awilix"

// biome-ignore lint/suspicious/noExplicitAny: permissive type
export type Component<R = any> = (...params: any[]) => R
export type ResolveComponent<T extends Component> = ReturnType<T>
// biome-ignore lint/suspicious/noExplicitAny: permissive type
export type Module<R = any> = Record<string, Component<R>>
export type ResolveModule<T extends Module> = {
	[K in keyof T]: ResolveComponent<T[K]>
}

export type Container<M extends Module = Module> = AwilixContainer<
	ResolveModule<M>
>
export function Container<M extends Module>(
	module: M,
): AwilixContainer<ResolveModule<M>> {
	const container = createContainer({
		strict: true,
	})
	for (const [name, factory] of Object.entries(module)) {
		container.register(name, asFunction(factory).singleton())
	}
	return container
}
