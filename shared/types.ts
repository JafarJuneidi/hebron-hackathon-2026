// Consistent API response wrapper — all endpoints return this shape
export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

// Health check
export interface HealthCheck {
  status: "ok" | "degraded"
  uptime: number
}

// === Project Types ===

export const PROJECT_STATUSES = [
  "pending",
  "funding",
  "funded",
  "ready",
  "rejected",
] as const
export type ProjectStatus = (typeof PROJECT_STATUSES)[number]

export const PROJECT_CATEGORIES = [
  "education",
  "environment",
  "health",
  "infrastructure",
  "community",
  "other",
] as const
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number]

export interface Project {
  id: number
  title: string
  description: string
  category: ProjectCategory
  status: ProjectStatus
  fundingTarget: number | null
  fundingCurrent: number
  volunteersRequired: number | null
  volunteersCurrent: number
  submittedBy: string
  reviewedBy: string | null
  createdAt: string
  updatedAt: string
}

export interface ProjectWithScore extends Project {
  likes: number
  userLiked: boolean
  fundingPercent: number
  submitterName: string
}

export interface ProjectDetail extends ProjectWithScore {
  isVolunteered: boolean
  userContributionTotal: number
}

// === User Types ===

export interface User {
  id: string
  email: string
  displayName: string
  imageUrl: string | null
  isAdmin: boolean
  createdAt: string
}

// === Like Types ===

export interface LikeResponse {
  likes: number
  userLiked: boolean
}

// === Contribution Types ===

export interface ContributeRequest {
  amount: number // dollars
}

export interface ContributeResponse {
  fundingCurrent: number
  fundingTarget: number
  status: ProjectStatus
}

export interface Contribution {
  id: number
  userId: string
  displayName: string
  amount: number // cents
  createdAt: string
}

// === Volunteer Types ===

export interface VolunteerResponse {
  volunteersCurrent: number
  volunteersRequired: number
  status: ProjectStatus
}

export interface VolunteerSignup {
  id: number
  userId: string
  displayName: string
  imageUrl: string | null
  createdAt: string
}

// === Request Types ===

export interface SubmitProjectRequest {
  title: string
  description: string
  category: ProjectCategory
}

export interface ApproveProjectRequest {
  fundingTarget: number // dollars
  volunteersRequired: number
}

// === Leaderboard Types ===

export interface LeaderboardEntry {
  userId: string
  displayName: string
  imageUrl: string | null
  totalContributed: number // cents
  projectsFunded: number
}
