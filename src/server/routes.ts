import {zValidator} from "@hono/zod-validator";
import {z} from "zod/v4";
import {Hono} from "hono";

export const app = new Hono()
    .post(
        '/put',
        zValidator(
            'form',
            z.object({
                key: z.string(),
                value: z.any()
            })
        ),
        (ctx) => {
            const {value} = ctx.req.valid(`form`)
            return ctx.json({
                value
            }, 200)
        }
    )
    .get(
        `/get`,
        zValidator(
            'query',
            z.object({
                key: z.string()
            })
        ),
        (ctx) => {
            return ctx.json({
                value: 0
            }, 200)
        }
    )

export type AppType = typeof app
