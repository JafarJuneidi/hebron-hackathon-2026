import { createMiddleware } from "hono/factory"
import { verifyToken, createClerkClient } from "@clerk/backend"
import { db } from "../db/index.ts"
import { users } from "../db/schema.ts"
import { eq } from "drizzle-orm"

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY!,
})

export type AuthEnv = {
  Variables: {
    userId: string
    user: typeof users.$inferSelect
  }
}

export const authMiddleware = createMiddleware<AuthEnv>(async (c, next) => {
  const authHeader = c.req.header("Authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ data: null, error: "Unauthorized" }, 401)
  }

  const token = authHeader.slice(7)

  try {
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY!,
    })
    const clerkUserId = payload.sub

    let user = db
      .select()
      .from(users)
      .where(eq(users.id, clerkUserId))
      .get()

    if (!user) {
      const clerkUser = await clerkClient.users.getUser(clerkUserId)
      const now = new Date().toISOString()
      const displayName =
        `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() ||
        (clerkUser.emailAddresses[0]?.emailAddress ?? "Unknown")

      user = {
        id: clerkUserId,
        email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
        displayName,
        imageUrl: clerkUser.imageUrl ?? null,
        isAdmin: 0,
        createdAt: now,
      }

      db.insert(users).values(user).run()
    }

    c.set("userId", clerkUserId)
    c.set("user", user)
    return next()
  } catch {
    return c.json({ data: null, error: "Invalid token" }, 401)
  }
})

export const adminMiddleware = createMiddleware<AuthEnv>(async (c, next) => {
  const user = c.get("user")
  if (!user || user.isAdmin !== 1) {
    return c.json({ data: null, error: "Forbidden" }, 403)
  }
  return next()
})
