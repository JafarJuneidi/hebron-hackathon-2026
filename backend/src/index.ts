import "dotenv/config"
import { serve } from "@hono/node-server"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { healthRoutes } from "./routes/health.ts"
import { projectRoutes } from "./routes/projects.ts"
import { adminRoutes } from "./routes/admin.ts"
import { likesRoutes } from "./routes/likes.ts"
import { contributionRoutes } from "./routes/contributions.ts"
import { volunteerRoutes } from "./routes/volunteers.ts"
import { userRoutes } from "./routes/users.ts"
import { leaderboardRoutes } from "./routes/leaderboard.ts"

// Import DB to ensure tables are created on startup
import "./db/index.ts"

const app = new Hono()

app.use("*", cors({ origin: "*" }))

app.route("/api/health", healthRoutes)
app.route("/api/projects", projectRoutes)
app.route("/api/projects", likesRoutes)
app.route("/api/projects", contributionRoutes)
app.route("/api/projects", volunteerRoutes)
app.route("/api/admin", adminRoutes)
app.route("/api/users", userRoutes)
app.route("/api/leaderboard", leaderboardRoutes)

const PORT = 3000

serve({ fetch: app.fetch, port: PORT, hostname: "0.0.0.0" }, () => {
  console.log(`Backend running on http://0.0.0.0:${PORT}`)
})
