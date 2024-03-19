import rootModule from "../_module"
import { Container, type ResolveModule } from "./lib"

export type Ioc = ResolveModule<typeof rootModule>

export const ioc = Container(rootModule)
export const { cradle } = ioc
