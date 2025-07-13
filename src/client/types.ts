import {createClient} from "./utils.js";

export type AllowedTypes = string | number | boolean

export interface DurableObjectProps<T extends AllowedTypes> {
    key: string
    defaultValue: T
}

export type RPCClient = ReturnType<typeof createClient>