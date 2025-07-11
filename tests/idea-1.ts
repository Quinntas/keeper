abstract class DurableObject<T> {
    protected constructor(
        private readonly key: string
    ) {
    }

    protected abstract sync(value: T): Promise<void> | Promise<number>

    protected async put(value: T): Promise<T> {
        return value
    }

    protected async get(): Promise<T> {
        return 0 as T
    }

    async resync() {
        return this.sync(await this.get())
    }
}

class Counter extends DurableObject<number> {
    constructor(
        private counter: number
    ) {
        super("counter");
    }

    async sync(value: number): Promise<number> {
        this.counter = await this.put(value);
        return this.counter
    }

    increment(value: number = 1): Promise<number> {
        return this.sync(this.counter + value)
    }

    decrement(value: number = 1): Promise<number> {
        return this.sync(this.counter - value)
    }
}

async function instantiate<T extends DurableObject<any>, Args extends any[]>(
    obj: new (...args: Args) => T,
    ...args: Args
) {
    const instance = new obj(...args);
    await instance.resync();
    return instance
}

async function main() {
    const counter = await instantiate(Counter, 0);
    console.log(await counter.increment(10));
    console.log(await counter.decrement(5));
}

main()