import type {AllowedTypes, DurableObjectProps, RPCClient} from "./types.js"

export class DurableObject<T extends AllowedTypes> {
    private _value: T

    constructor(
        private readonly client: RPCClient,
        private readonly config: DurableObjectProps<T>
    ) {
        this._value = this.config.defaultValue
    }

    async get() {
        return this._value
    }

    async put(value: T) {
        const res = await this.client.put.$post({
            form: {
                key: this.config.key,
                value: value
            }
        })
        if (!res.ok) throw new Error(`Failed to put value`)
        this._value = value
        return value
    }

    async resync() {
        const res = await this.client.get.$get({
            query: {
                key: this.config.key
            }
        })
        if (!res.ok) throw new Error(`Failed to get value`)
        const {value} = await res.json()
        return this._value = value as T
    }
}