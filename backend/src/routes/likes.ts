import { Hono } from "hono"
import { eq, and, sql } from "drizzle-orm"
import { db } from "../db/index.ts"
import { likes, projects } from "../db/schema.ts"
import { authMiddleware, type AuthEnv } from "../middleware/auth.ts"
import type { ApiResponse, LikeResponse } from "../../../shared/types.ts"

const routes = new Hono<AuthEnv>()

// POST /:id/like — Toggle like (auth required)
routes.post("/:id/like", authMiddleware, async (c) => {
  const projectId = Number(c.req.param("id"))
  if (isNaN(projectId)) {
    const response: ApiResponse<null> = { data: null, error: "Invalid project ID" }
    return c.json(response, 400)
  }

  const userId = c.get("userId")

  // Verify project exists
  const project = db.select().from(projects).where(eq(projects.id, projectId)).get()
  if (!project) {
    const response: ApiResponse<null> = { data: null, error: "Project not found" }
    return c.json(response, 404)
  }

  // Check if already liked
  const existing = db
    .select()
    .from(likes)
    .where(and(eq(likes.projectId, projectId), eq(likes.userId, userId)))
    .get()

  if (existing) {
    // Unlike
    db.delete(likes)
      .where(and(eq(likes.projectId, projectId), eq(likes.userId, userId)))
      .run()
  } else {
    // Like
    db.insert(likes)
      .values({
        projectId,
        userId,
        createdAt: new Date().toISOString(),
      })
      .run()
  }

  // Get updated count
  const countRow = db
    .select({ count: sql<number>`COUNT(*)` })
    .from(likes)
    .where(eq(likes.projectId, projectId))
    .get()

  const response: ApiResponse<LikeResponse> = {
    data: {
      likes: countRow?.count ?? 0,
      userLiked: !existing,
    },
    error: null,
  }
  return c.json(response)
})

export { routes as likesRoutes }
