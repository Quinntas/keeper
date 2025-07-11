interface DurableObjectConfig<T> {
    key: string;
    defaultValue: T;
    onSync?: (value: T) => Promise<void>;
}

class DurableObject<T> {
    private _value: T;
    private readonly _key: string;
    private readonly _onSync?: (value: T) => Promise<void>;

    constructor(config: DurableObjectConfig<T>) {
        this._key = config.key;
        this._value = config.defaultValue;
        this._onSync = config.onSync;
    }

    get value(): T {
        return this._value;
    }

    async setValue(value: T): Promise<T> {
        this._value = value;

        if (this._onSync) {
            await this._onSync(value);
        }

        return value;
    }

    async update(updater: (current: T) => T): Promise<T> {
        return this.setValue(updater(this._value));
    }

    get key(): string {
        return this._key;
    }
}

class Counter extends DurableObject<number> {
    constructor(key: string, initialValue: number = 0) {
        super({key, defaultValue: initialValue});
    }

    async increment(amount: number = 1): Promise<number> {
        return this.update(current => current + amount);
    }

    async decrement(amount: number = 1): Promise<number> {
        return this.update(current => current - amount);
    }

    async reset(): Promise<number> {
        return this.setValue(0);
    }
}

function createDurableObject<T>(config: DurableObjectConfig<T>): DurableObject<T> {
    return new DurableObject(config);
}

async function main() {
    const counter = new Counter("my-counter", 0);

    console.log(await counter.increment(10));
    console.log(await counter.decrement(5));
    console.log(counter.value);

    const stringStore = createDurableObject({
        key: "text-store",
        defaultValue: "hello",
        onSync: async (value) => {
            console.log(`Syncing value: ${value}`);
        }
    });

    await stringStore.setValue("world");
    console.log(stringStore.value);
}

main();