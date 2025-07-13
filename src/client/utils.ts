import {DurableObject} from "./durableObject.js"
import type {AllowedTypes, DurableObjectProps, RPCClient} from "./types.js"
import {hc} from "hono/client";
import type {AppType} from "../server/routes.js";

export async function createDurableObject<T extends AllowedTypes>(client: RPCClient, config: DurableObjectProps<T>) {
    const instance = new DurableObject(client, config)
    await instance.resync()
    return instance
}

export function createClient(url: string) {
    return hc<AppType>(url)
}