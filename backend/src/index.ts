import { serve } from "@hono/node-server"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { healthRoutes } from "./routes/health.ts"

const app = new Hono()

app.use("*", cors({ origin: "http://localhost:5173" }))

app.route("/api/health", healthRoutes)

const PORT = 3000

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})
