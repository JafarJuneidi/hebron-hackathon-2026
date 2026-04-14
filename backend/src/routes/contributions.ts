import { Hono } from "hono"
import { eq } from "drizzle-orm"
import { db } from "../db/index.ts"
import { contributions, projects } from "../db/schema.ts"
import { authMiddleware, type AuthEnv } from "../middleware/auth.ts"
import type { ApiResponse, ContributeRequest, ContributeResponse, ProjectStatus } from "../../../shared/types.ts"

const DOLLARS_TO_CENTS = 100

const routes = new Hono<AuthEnv>()

// POST /:id/contribute — Add funds (auth required)
routes.post("/:id/contribute", authMiddleware, async (c) => {
  const projectId = Number(c.req.param("id"))
  if (isNaN(projectId)) {
    const response: ApiResponse<null> = { data: null, error: "Invalid project ID" }
    return c.json(response, 400)
  }

  const userId = c.get("userId")
  const body = await c.req.json<ContributeRequest>()

  // Validate amount
  if (!body.amount || body.amount <= 0) {
    const response: ApiResponse<null> = {
      data: null,
      error: "Amount must be greater than 0",
    }
    return c.json(response, 400)
  }

  const amountCents = Math.round(body.amount * DOLLARS_TO_CENTS)

  // Verify project exists and is in funding status
  const project = db.select().from(projects).where(eq(projects.id, projectId)).get()
  if (!project) {
    const response: ApiResponse<null> = { data: null, error: "Project not found" }
    return c.json(response, 404)
  }

  if (project.status !== "funding") {
    const response: ApiResponse<null> = {
      data: null,
      error: `Project is not accepting funding (status: ${project.status})`,
    }
    return c.json(response, 400)
  }

  // Insert contribution
  db.insert(contributions)
    .values({
      projectId,
      userId,
      amount: amountCents,
      createdAt: new Date().toISOString(),
    })
    .run()

  // Update project funding
  const newFundingCurrent = project.fundingCurrent + amountCents
  const isFunded = project.fundingTarget !== null && newFundingCurrent >= project.fundingTarget
  const newStatus: ProjectStatus = isFunded ? "funded" : (project.status as ProjectStatus)

  db.update(projects)
    .set({
      fundingCurrent: newFundingCurrent,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(projects.id, projectId))
    .run()

  const response: ApiResponse<ContributeResponse> = {
    data: {
      fundingCurrent: newFundingCurrent,
      fundingTarget: project.fundingTarget ?? 0,
      status: newStatus,
    },
    error: null,
  }
  return c.json(response)
})

export { routes as contributionRoutes }
