import { useLingui } from "@lingui/react/macro"
import { Badge } from "@/components/ui/badge"
import type { ProjectStatus } from "@shared/types"

interface ProjectStatusBadgeProps {
  status: ProjectStatus
}

const STATUS_STYLE: Record<ProjectStatus, { variant: "default" | "secondary" | "outline"; className?: string }> = {
  pending: { variant: "outline" },
  funding: { variant: "default" },
  funded: { variant: "secondary", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
  ready: { variant: "default", className: "bg-green-600 text-white dark:bg-green-700" },
  rejected: { variant: "outline", className: "text-red-600 border-red-300 dark:text-red-400 dark:border-red-700" },
}

export function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
  const { t } = useLingui()
  const style = STATUS_STYLE[status]

  const STATUS_LABELS: Record<ProjectStatus, string> = {
    pending: t`Pending`,
    funding: t`Funding`,
    funded: t`Funded`,
    ready: t`Ready`,
    rejected: t`Rejected`,
  }

  return (
    <Badge variant={style.variant} className={style.className}>
      {STATUS_LABELS[status]}
    </Badge>
  )
}
