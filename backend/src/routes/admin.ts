import { Hono } from "hono"
import { eq } from "drizzle-orm"
import { db } from "../db/index.ts"
import { projects, users } from "../db/schema.ts"
import { authMiddleware, adminMiddleware, type AuthEnv } from "../middleware/auth.ts"
import type { ApiResponse, Project, ApproveProjectRequest } from "../../../shared/types.ts"

const DOLLARS_TO_CENTS = 100

const routes = new Hono<AuthEnv>()

// All admin routes require auth + admin
routes.use("*", authMiddleware)
routes.use("*", adminMiddleware)

// GET /projects/pending — List all pending projects with submitter name
routes.get("/projects/pending", async (c) => {
  const pendingProjects = db
    .select({
      id: projects.id,
      title: projects.title,
      description: projects.description,
      category: projects.category,
      status: projects.status,
      fundingTarget: projects.fundingTarget,
      fundingCurrent: projects.fundingCurrent,
      volunteersRequired: projects.volunteersRequired,
      volunteersCurrent: projects.volunteersCurrent,
      submittedBy: projects.submittedBy,
      reviewedBy: projects.reviewedBy,
      createdAt: projects.createdAt,
      updatedAt: projects.updatedAt,
      submitterName: users.displayName,
    })
    .from(projects)
    .leftJoin(users, eq(projects.submittedBy, users.id))
    .where(eq(projects.status, "pending"))
    .all()

  const response: ApiResponse<typeof pendingProjects> = {
    data: pendingProjects,
    error: null,
  }
  return c.json(response)
})

// POST /projects/:id/approve — Approve a project
routes.post("/projects/:id/approve", async (c) => {
  const id = Number(c.req.param("id"))
  const userId = c.get("userId")
  const body = await c.req.json<ApproveProjectRequest>()

  // Validate required fields
  if (!body.fundingTarget || !body.volunteersRequired) {
    const response: ApiResponse<null> = {
      data: null,
      error: "fundingTarget and volunteersRequired are required",
    }
    return c.json(response, 400)
  }

  if (body.fundingTarget <= 0 || body.volunteersRequired <= 0) {
    const response: ApiResponse<null> = {
      data: null,
      error: "fundingTarget and volunteersRequired must be positive numbers",
    }
    return c.json(response, 400)
  }

  // Check project exists and is pending
  const existing = db
    .select()
    .from(projects)
    .where(eq(projects.id, id))
    .get()

  if (!existing) {
    const response: ApiResponse<null> = {
      data: null,
      error: "Project not found",
    }
    return c.json(response, 404)
  }

  if (existing.status !== "pending") {
    const response: ApiResponse<null> = {
      data: null,
      error: `Project is already ${existing.status}`,
    }
    return c.json(response, 400)
  }

  const now = new Date().toISOString()

  const updated = db
    .update(projects)
    .set({
      status: "funding",
      fundingTarget: Math.round(body.fundingTarget * DOLLARS_TO_CENTS),
      volunteersRequired: body.volunteersRequired,
      reviewedBy: userId,
      updatedAt: now,
    })
    .where(eq(projects.id, id))
    .returning()
    .get()

  const response: ApiResponse<Project> = {
    data: updated as Project,
    error: null,
  }
  return c.json(response)
})

// POST /projects/:id/reject — Reject a project
routes.post("/projects/:id/reject", async (c) => {
  const id = Number(c.req.param("id"))
  const userId = c.get("userId")

  // Check project exists and is pending
  const existing = db
    .select()
    .from(projects)
    .where(eq(projects.id, id))
    .get()

  if (!existing) {
    const response: ApiResponse<null> = {
      data: null,
      error: "Project not found",
    }
    return c.json(response, 404)
  }

  if (existing.status !== "pending") {
    const response: ApiResponse<null> = {
      data: null,
      error: `Project is already ${existing.status}`,
    }
    return c.json(response, 400)
  }

  const now = new Date().toISOString()

  const updated = db
    .update(projects)
    .set({
      status: "rejected",
      reviewedBy: userId,
      updatedAt: now,
    })
    .where(eq(projects.id, id))
    .returning()
    .get()

  const response: ApiResponse<Project> = {
    data: updated as Project,
    error: null,
  }
  return c.json(response)
})

export { routes as adminRoutes }
