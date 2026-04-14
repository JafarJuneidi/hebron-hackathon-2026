import { Hono } from "hono"
import { eq } from "drizzle-orm"
import { Resend } from "resend"
import { db } from "../db/index.ts"
import { projects, users } from "../db/schema.ts"
import { authMiddleware, adminMiddleware, type AuthEnv } from "../middleware/auth.ts"
import type { ApiResponse, Project, ApproveProjectRequest, BulkInviteRequest, BulkInviteResponse } from "../../../shared/types.ts"

const resend = new Resend(process.env.RESEND_API_KEY)

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

// POST /projects/:id/invite — Bulk invite volunteers by email
routes.post("/projects/:id/invite", async (c) => {
  const id = Number(c.req.param("id"))
  const body = await c.req.json<BulkInviteRequest>()

  if (!Array.isArray(body.emails) || body.emails.length === 0) {
    const response: ApiResponse<null> = {
      data: null,
      error: "At least one email is required",
    }
    return c.json(response, 400)
  }

  // Check project exists and is funded
  const project = db
    .select()
    .from(projects)
    .where(eq(projects.id, id))
    .get()

  if (!project) {
    const response: ApiResponse<null> = {
      data: null,
      error: "Project not found",
    }
    return c.json(response, 404)
  }

  if (project.status !== "funded") {
    const response: ApiResponse<null> = {
      data: null,
      error: "Project must be in funded status to send invites",
    }
    return c.json(response, 400)
  }

  // Deduplicate and validate emails
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const unique = [...new Set(body.emails.map((e) => e.trim().toLowerCase()))].filter(
    (e) => EMAIL_RE.test(e)
  )

  if (unique.length === 0) {
    const response: ApiResponse<null> = {
      data: null,
      error: "No valid email addresses provided",
    }
    return c.json(response, 400)
  }

  const appUrl = process.env.APP_URL ?? "http://localhost:5173"
  const projectUrl = `${appUrl}/projects/${id}`

  const sent: string[] = []
  const failed: string[] = []

  for (const email of unique) {
    try {
      await resend.emails.send({
        from: "Hebron Community <onboarding@resend.dev>",
        to: email,
        subject: `You're invited to volunteer for ${project.title}`,
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2>You're invited to volunteer!</h2>
            <p>You've been invited to volunteer for <strong>${project.title}</strong> on Hebron Community Projects.</p>
            <p>${project.description}</p>
            <a href="${projectUrl}" style="display: inline-block; padding: 10px 20px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin-top: 8px;">
              View Project &amp; Sign Up
            </a>
            <p style="color: #6b7280; font-size: 14px; margin-top: 16px;">
              If you didn't expect this email, you can safely ignore it.
            </p>
          </div>
        `,
      })
      sent.push(email)
    } catch {
      failed.push(email)
    }
  }

  const response: ApiResponse<BulkInviteResponse> = {
    data: { sent, failed },
    error: null,
  }
  return c.json(response)
})

export { routes as adminRoutes }
