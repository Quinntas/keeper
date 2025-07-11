interface DurableObjectProps<T> {
    key: string
    defaultValue: T
}

class DurableObject<T> {
    private _value: T

    constructor(config: DurableObjectProps<T>) {
        this._value = config.defaultValue
    }

    async get() {
        return this._value
    }

    async put(value: T) {
        this._value = value
        return value
    }

    async resync() {
        return await this.put(await this.get())
    }
}

async function createDurableObject<T>(config: DurableObjectProps<T>) {
    const instance = new DurableObject(config)
    await instance.resync()
    return instance
}

async function main() {
    const counter = await createDurableObject({
        key: "counter",
        defaultValue: 0
    })

    console.log(await counter.put(10))
    console.log(await counter.put(5))
}

main()