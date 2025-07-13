import {hc} from 'hono/client'
import type {AppType} from "../server/routes.js";

export const client = hc<AppType>("http://localhost:3000/")
