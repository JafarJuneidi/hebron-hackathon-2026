import { Hono } from "hono"
import { eq, sql, inArray } from "drizzle-orm"
import { verifyToken } from "@clerk/backend"
import { db } from "../db/index.ts"
import { projects, users, likes, contributions, volunteerSignups } from "../db/schema.ts"
import { authMiddleware, type AuthEnv } from "../middleware/auth.ts"
import type {
  ApiResponse,
  Project,
  ProjectWithScore,
  ProjectDetail,
  ProjectCategory,
  SubmitProjectRequest,
} from "../../../shared/types.ts"

const PROJECT_CATEGORIES: readonly ProjectCategory[] = [
  "education",
  "environment",
  "health",
  "infrastructure",
  "community",
  "other",
]

const routes = new Hono<AuthEnv>()

// Helper: extract userId from Authorization header without requiring it
async function getOptionalUserId(authHeader: string | undefined): Promise<string | null> {
  if (!authHeader?.startsWith("Bearer ")) return null
  const token = authHeader.slice(7)
  try {
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY!,
    })
    return payload.sub
  } catch {
    return null
  }
}

// === PUBLIC ENDPOINTS (optional auth for userLiked) ===

// GET / — List projects in funding/funded/ready statuses
routes.get("/", async (c) => {
  const sort = c.req.query("sort") ?? "likes"
  const statusFilter = c.req.query("status")
  const userId = await getOptionalUserId(c.req.header("Authorization"))

  const allowedStatuses = ["funding", "funded", "ready"]

  // If a specific status filter is given, validate it
  if (statusFilter && !allowedStatuses.includes(statusFilter)) {
    const response: ApiResponse<null> = {
      data: null,
      error: `Invalid status filter. Must be one of: ${allowedStatuses.join(", ")}`,
    }
    return c.json(response, 400)
  }

  const targetStatuses = statusFilter ? [statusFilter] : allowedStatuses

  // Fetch projects with submitter name
  const rows = db
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
      likesCount: sql<number>`(SELECT COUNT(*) FROM likes WHERE likes.project_id = ${projects.id})`.as("likes_count"),
    })
    .from(projects)
    .leftJoin(users, eq(projects.submittedBy, users.id))
    .where(inArray(projects.status, targetStatuses))
    .all()

  // Get user's liked project IDs if authenticated
  let userLikedIds = new Set<number>()
  if (userId) {
    const userLikes = db
      .select({ projectId: likes.projectId })
      .from(likes)
      .where(eq(likes.userId, userId))
      .all()
    userLikedIds = new Set(userLikes.map((l) => l.projectId))
  }

  const result: ProjectWithScore[] = rows.map((row) => {
    const fundingPercent =
      row.fundingTarget && row.fundingTarget > 0
        ? Math.min(100, Math.round((row.fundingCurrent / row.fundingTarget) * 100))
        : 0

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      status: row.status,
      fundingTarget: row.fundingTarget,
      fundingCurrent: row.fundingCurrent,
      volunteersRequired: row.volunteersRequired,
      volunteersCurrent: row.volunteersCurrent,
      submittedBy: row.submittedBy,
      reviewedBy: row.reviewedBy,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      submitterName: row.submitterName ?? "Unknown",
      likes: row.likesCount,
      userLiked: userLikedIds.has(row.id),
      fundingPercent,
    } as ProjectWithScore
  })

  // Sort
  if (sort === "funding") {
    result.sort((a, b) => b.fundingPercent - a.fundingPercent)
  } else {
    result.sort((a, b) => b.likes - a.likes)
  }

  const response: ApiResponse<ProjectWithScore[]> = { data: result, error: null }
  return c.json(response)
})

// === AUTH-PROTECTED ENDPOINTS ===

// POST /submit — Submit a new project idea (auth required)
routes.post("/", authMiddleware, async (c) => {
  const body = await c.req.json<SubmitProjectRequest>()
  const userId = c.get("userId")

  // Validate required fields
  if (!body.title?.trim() || !body.description?.trim() || !body.category) {
    const response: ApiResponse<null> = {
      data: null,
      error: "title, description, and category are required",
    }
    return c.json(response, 400)
  }

  // Validate category
  if (!PROJECT_CATEGORIES.includes(body.category)) {
    const response: ApiResponse<null> = {
      data: null,
      error: `Invalid category. Must be one of: ${PROJECT_CATEGORIES.join(", ")}`,
    }
    return c.json(response, 400)
  }

  const now = new Date().toISOString()

  const result = db
    .insert(projects)
    .values({
      title: body.title.trim(),
      description: body.description.trim(),
      category: body.category,
      status: "pending",
      submittedBy: userId,
      createdAt: now,
      updatedAt: now,
    })
    .returning()
    .get()

  const response: ApiResponse<Project> = {
    data: result as Project,
    error: null,
  }
  return c.json(response, 201)
})

// GET /my — Get current user's submitted projects (auth required)
routes.get("/my", authMiddleware, async (c) => {
  const userId = c.get("userId")

  const userProjects = db
    .select()
    .from(projects)
    .where(eq(projects.submittedBy, userId))
    .all()

  const response: ApiResponse<Project[]> = {
    data: userProjects as Project[],
    error: null,
  }
  return c.json(response)
})

// GET /:id — Single project detail (public, optional auth)
routes.get("/:id", async (c) => {
  const id = Number(c.req.param("id"))
  if (isNaN(id)) {
    const response: ApiResponse<null> = { data: null, error: "Invalid project ID" }
    return c.json(response, 400)
  }

  const userId = await getOptionalUserId(c.req.header("Authorization"))

  const row = db
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
      likesCount: sql<number>`(SELECT COUNT(*) FROM likes WHERE likes.project_id = ${projects.id})`.as("likes_count"),
    })
    .from(projects)
    .leftJoin(users, eq(projects.submittedBy, users.id))
    .where(eq(projects.id, id))
    .get()

  if (!row) {
    const response: ApiResponse<null> = { data: null, error: "Project not found" }
    return c.json(response, 404)
  }

  // Check user-specific data
  let userLiked = false
  let isVolunteered = false
  let userContributionTotal = 0

  if (userId) {
    const likeRow = db
      .select()
      .from(likes)
      .where(sql`${likes.projectId} = ${id} AND ${likes.userId} = ${userId}`)
      .get()
    userLiked = !!likeRow

    const volunteerRow = db
      .select()
      .from(volunteerSignups)
      .where(sql`${volunteerSignups.projectId} = ${id} AND ${volunteerSignups.userId} = ${userId}`)
      .get()
    isVolunteered = !!volunteerRow

    const contribRow = db
      .select({
        total: sql<number>`COALESCE(SUM(${contributions.amount}), 0)`,
      })
      .from(contributions)
      .where(sql`${contributions.projectId} = ${id} AND ${contributions.userId} = ${userId}`)
      .get()
    userContributionTotal = contribRow?.total ?? 0
  }

  const fundingPercent =
    row.fundingTarget && row.fundingTarget > 0
      ? Math.min(100, Math.round((row.fundingCurrent / row.fundingTarget) * 100))
      : 0

  const detail: ProjectDetail = {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    status: row.status,
    fundingTarget: row.fundingTarget,
    fundingCurrent: row.fundingCurrent,
    volunteersRequired: row.volunteersRequired,
    volunteersCurrent: row.volunteersCurrent,
    submittedBy: row.submittedBy,
    reviewedBy: row.reviewedBy,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    submitterName: row.submitterName ?? "Unknown",
    likes: row.likesCount,
    userLiked,
    fundingPercent,
    isVolunteered,
    userContributionTotal,
  } as ProjectDetail

  const response: ApiResponse<ProjectDetail> = { data: detail, error: null }
  return c.json(response)
})

export { routes as projectRoutes }
