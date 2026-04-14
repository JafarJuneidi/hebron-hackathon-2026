import { Badge } from "@/components/ui/badge"
import type { ProjectStatus } from "@shared/types"

interface ProjectStatusBadgeProps {
  status: ProjectStatus
}

const STATUS_CONFIG: Record<ProjectStatus, { label: string; variant: "default" | "secondary" | "outline"; className?: string }> = {
  pending: { label: "Pending", variant: "outline" },
  funding: { label: "Funding", variant: "default" },
  funded: { label: "Funded", variant: "secondary", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
  ready: { label: "Ready", variant: "default", className: "bg-green-600 text-white dark:bg-green-700" },
  rejected: { label: "Rejected", variant: "outline", className: "text-red-600 border-red-300 dark:text-red-400 dark:border-red-700" },
}

export function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
  const config = STATUS_CONFIG[status]

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  )
}
