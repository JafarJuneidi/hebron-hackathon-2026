import { Hono } from "hono"
import { sql } from "drizzle-orm"
import { db } from "../db/index.ts"
import { contributions, users } from "../db/schema.ts"
import type { ApiResponse, LeaderboardEntry } from "../../../shared/types.ts"

const routes = new Hono()

// GET / — Top contributors by total funds
routes.get("/", async (c) => {
  const rows = db
    .select({
      userId: contributions.userId,
      displayName: users.displayName,
      imageUrl: users.imageUrl,
      totalContributed:
        sql<number>`SUM(${contributions.amount})`.as("total_contributed"),
      projectsFunded:
        sql<number>`COUNT(DISTINCT ${contributions.projectId})`.as(
          "projects_funded"
        ),
    })
    .from(contributions)
    .leftJoin(users, sql`${contributions.userId} = ${users.id}`)
    .groupBy(contributions.userId)
    .orderBy(sql`total_contributed DESC`)
    .limit(20)
    .all()

  const data: LeaderboardEntry[] = rows.map((row) => ({
    userId: row.userId,
    displayName: row.displayName ?? "Anonymous",
    imageUrl: row.imageUrl,
    totalContributed: row.totalContributed,
    projectsFunded: row.projectsFunded,
  }))

  const response: ApiResponse<LeaderboardEntry[]> = { data, error: null }
  return c.json(response)
})

export { routes as leaderboardRoutes }
