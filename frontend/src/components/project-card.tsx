import { useState } from "react"
import { useLingui } from "@lingui/react/macro"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProjectStatusBadge } from "@/components/project-status-badge"
import { FundingBar } from "@/components/funding-bar"
import { LikeButton } from "@/components/like-button"
import { ProjectDetailContent } from "@/components/project-detail-content"
import { cn } from "@/lib/utils"
import type { ProjectWithScore } from "@shared/types"

interface ProjectCardProps {
  project: ProjectWithScore
}

const STATUS_BORDER: Record<string, string> = {
  funding: "border-l-blue-500",
  funded: "border-l-amber-500",
  ready: "border-l-emerald-500",
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { t } = useLingui()
  const [open, setOpen] = useState(false)

  const borderClass = STATUS_BORDER[project.status] ?? ""

  function getContextHelpText(): string | null {
    if (project.status === "funding" && project.fundingTarget != null) {
      const remaining = (project.fundingTarget - project.fundingCurrent) / 100
      return t`Needs $${remaining} more`
    }
    if (project.status === "funded" && project.volunteersRequired != null) {
      const needed = project.volunteersRequired - project.volunteersCurrent
      return t`Looking for ${needed} more volunteers`
    }
    if (project.status === "ready") {
      return t`Launching soon!`
    }
    return null
  }

  const helpText = getContextHelpText()

  return (
    <>
      <Card
        className={cn(
          "cursor-pointer transition-shadow hover:shadow-md border-l-4",
          borderClass
        )}
        onClick={() => setOpen(true)}
      >
        <CardHeader>
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-foreground">
              {project.title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="capitalize">
                {project.category}
              </Badge>
              <ProjectStatusBadge status={project.status} />
            </div>
            {helpText && (
              <p className="text-xs text-muted-foreground">{helpText}</p>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
          {project.fundingTarget != null && project.fundingTarget > 0 && (
            <FundingBar
              current={project.fundingCurrent}
              target={project.fundingTarget}
            />
          )}
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              by {project.submitterName}
            </p>
            <div onClick={(e) => e.stopPropagation()}>
              <LikeButton
                projectId={project.id}
                likes={project.likes}
                userLiked={project.userLiked}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogTitle className="sr-only">{project.title}</DialogTitle>
          <ProjectDetailContent projectId={String(project.id)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
