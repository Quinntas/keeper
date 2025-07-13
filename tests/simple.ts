import {createClient, createDurableObject} from "../src/client/utils.js";

async function main() {
    const client = createClient("http://localhost:3000/")
    const counter = await createDurableObject<number>(client, {
        key: 'counter',
        defaultValue: 0
    })

    console.log(await counter.put(1))
    console.log(await counter.get())
    await counter.resync()
    console.log(await counter.get())
}

main()