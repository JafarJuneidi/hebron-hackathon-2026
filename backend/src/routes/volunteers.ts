import { Hono } from "hono"
import { eq, and } from "drizzle-orm"
import { db } from "../db/index.ts"
import { volunteerSignups, projects } from "../db/schema.ts"
import { authMiddleware, type AuthEnv } from "../middleware/auth.ts"
import type { ApiResponse, VolunteerResponse, ProjectStatus } from "../../../shared/types.ts"

const routes = new Hono<AuthEnv>()

// POST /:id/volunteer — Sign up as volunteer (auth required)
routes.post("/:id/volunteer", authMiddleware, async (c) => {
  const projectId = Number(c.req.param("id"))
  if (isNaN(projectId)) {
    const response: ApiResponse<null> = { data: null, error: "Invalid project ID" }
    return c.json(response, 400)
  }

  const userId = c.get("userId")

  // Verify project exists and is in funded status
  const project = db.select().from(projects).where(eq(projects.id, projectId)).get()
  if (!project) {
    const response: ApiResponse<null> = { data: null, error: "Project not found" }
    return c.json(response, 404)
  }

  if (project.status !== "funded") {
    const response: ApiResponse<null> = {
      data: null,
      error: `Project is not accepting volunteers (status: ${project.status})`,
    }
    return c.json(response, 400)
  }

  // Check if already signed up
  const existing = db
    .select()
    .from(volunteerSignups)
    .where(and(eq(volunteerSignups.projectId, projectId), eq(volunteerSignups.userId, userId)))
    .get()

  if (existing) {
    const response: ApiResponse<null> = {
      data: null,
      error: "You have already signed up for this project",
    }
    return c.json(response, 409)
  }

  // Insert signup
  db.insert(volunteerSignups)
    .values({
      projectId,
      userId,
      createdAt: new Date().toISOString(),
    })
    .run()

  // Increment volunteers_current
  const newVolunteersCurrent = project.volunteersCurrent + 1
  const isReady = project.volunteersRequired !== null && newVolunteersCurrent >= project.volunteersRequired
  const newStatus: ProjectStatus = isReady ? "ready" : (project.status as ProjectStatus)

  db.update(projects)
    .set({
      volunteersCurrent: newVolunteersCurrent,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(projects.id, projectId))
    .run()

  const response: ApiResponse<VolunteerResponse> = {
    data: {
      volunteersCurrent: newVolunteersCurrent,
      volunteersRequired: project.volunteersRequired ?? 0,
      status: newStatus,
    },
    error: null,
  }
  return c.json(response)
})

// DELETE /:id/volunteer — Withdraw from volunteering (auth required)
routes.delete("/:id/volunteer", authMiddleware, async (c) => {
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

  // Check signup exists
  const existing = db
    .select()
    .from(volunteerSignups)
    .where(and(eq(volunteerSignups.projectId, projectId), eq(volunteerSignups.userId, userId)))
    .get()

  if (!existing) {
    const response: ApiResponse<null> = {
      data: null,
      error: "You are not signed up for this project",
    }
    return c.json(response, 404)
  }

  // Delete signup
  db.delete(volunteerSignups)
    .where(and(eq(volunteerSignups.projectId, projectId), eq(volunteerSignups.userId, userId)))
    .run()

  // Decrement volunteers_current
  const newVolunteersCurrent = Math.max(0, project.volunteersCurrent - 1)

  // If project was "ready" and now below threshold, revert to "funded"
  const shouldRevert =
    project.status === "ready" &&
    project.volunteersRequired !== null &&
    newVolunteersCurrent < project.volunteersRequired
  const newStatus = shouldRevert ? "funded" : project.status

  db.update(projects)
    .set({
      volunteersCurrent: newVolunteersCurrent,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(projects.id, projectId))
    .run()

  const response: ApiResponse<VolunteerResponse> = {
    data: {
      volunteersCurrent: newVolunteersCurrent,
      volunteersRequired: project.volunteersRequired ?? 0,
      status: newStatus as ProjectStatus,
    },
    error: null,
  }
  return c.json(response)
})

export { routes as volunteerRoutes }
