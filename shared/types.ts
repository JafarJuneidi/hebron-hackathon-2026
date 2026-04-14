// Consistent API response wrapper — all endpoints return this shape
export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

// Example: health check
export interface HealthCheck {
  status: "ok" | "degraded"
  uptime: number
}
