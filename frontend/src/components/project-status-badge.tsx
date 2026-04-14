import { useLingui } from "@lingui/react/macro"
import { CircleDollarSign, CheckCircle, Rocket, Clock, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { ProjectStatus } from "@shared/types"
import type { LucideIcon } from "lucide-react"

interface ProjectStatusBadgeProps {
  status: ProjectStatus
}

const STATUS_CONFIG: Record<ProjectStatus, {
  variant: "default" | "secondary" | "outline"
  className?: string
  icon: LucideIcon
}> = {
  pending: {
    variant: "outline",
    icon: Clock,
  },
  funding: {
    variant: "default",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    icon: CircleDollarSign,
  },
  funded: {
    variant: "secondary",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    icon: CheckCircle,
  },
  ready: {
    variant: "default",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    icon: Rocket,
  },
  rejected: {
    variant: "outline",
    className: "text-red-600 border-red-300 dark:text-red-400 dark:border-red-700",
    icon: XCircle,
  },
}

export function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
  const { t } = useLingui()
  const config = STATUS_CONFIG[status]
  const Icon = config.icon

  const STATUS_LABELS: Record<ProjectStatus, string> = {
    pending: t`Pending`,
    funding: t`Funding`,
    funded: t`Funded`,
    ready: t`Ready`,
    rejected: t`Rejected`,
  }

  return (
    <Badge variant={config.variant} className={config.className}>
      <Icon className="size-3" />
      <span className="ml-1">{STATUS_LABELS[status]}</span>
    </Badge>
  )
}
