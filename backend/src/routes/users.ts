import { Hono } from "hono"
import { authMiddleware, type AuthEnv } from "../middleware/auth.ts"
import type { ApiResponse, User } from "../../../shared/types.ts"

const routes = new Hono<AuthEnv>()

routes.get("/me", authMiddleware, async (c) => {
  const user = c.get("user")

  const response: ApiResponse<User> = {
    data: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      imageUrl: user.imageUrl,
      isAdmin: user.isAdmin === 1,
      createdAt: user.createdAt,
    },
    error: null,
  }
  return c.json(response)
})

export { routes as userRoutes }
