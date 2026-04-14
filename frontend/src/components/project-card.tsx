import { useState } from "react"
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
import type { ProjectWithScore } from "@shared/types"

interface ProjectCardProps {
  project: ProjectWithScore
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Card
        className="cursor-pointer transition-shadow hover:shadow-md"
        onClick={() => setOpen(true)}
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
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
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <LikeButton
                projectId={project.id}
                likes={project.likes}
                userLiked={project.userLiked}
              />
            </div>
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
          <p className="text-xs text-muted-foreground">
            by {project.submitterName}
          </p>
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
