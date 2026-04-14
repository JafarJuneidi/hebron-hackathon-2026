import { Hono } from "hono"
import type { ApiResponse, HealthCheck } from "../../../shared/types.ts"

const startTime = Date.now()

export const healthRoutes = new Hono()

healthRoutes.get("/", (c) => {
  const response: ApiResponse<HealthCheck> = {
    data: {
      status: "ok",
      uptime: Math.floor((Date.now() - startTime) / 1000),
    },
    error: null,
  }
  return c.json(response)
})
