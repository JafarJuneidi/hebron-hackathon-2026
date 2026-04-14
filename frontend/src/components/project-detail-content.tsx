import { useProject } from "@/hooks/use-projects"
import { useCurrentUser } from "@/hooks/use-current-user"
import { Trans } from "@lingui/react/macro"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { ProjectStatusBadge } from "@/components/project-status-badge"
import { FundingBar } from "@/components/funding-bar"
import { LikeButton } from "@/components/like-button"
import { ContributeForm } from "@/components/contribute-form"
import { ShareButton } from "@/components/share-button"
import { VolunteerButton } from "@/components/volunteer-button"
import { BulkInviteForm } from "@/components/bulk-invite-form"
import type { ProjectCategory } from "@shared/types"
import { CheckCircle, DollarSign, Users } from "lucide-react"

const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  education: "Education",
  environment: "Environment",
  health: "Health",
  infrastructure: "Infrastructure",
  community: "Community",
  other: "Other",
}

interface ProjectDetailContentProps {
  projectId: string
}

export function ProjectDetailContent({
  projectId,
}: ProjectDetailContentProps) {
  const { data: project, isLoading } = useProject(projectId)
  const { data: currentUser } = useCurrentUser()

  if (isLoading) {
    return (
      <div className="space-y-4 p-1">
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-2 w-full" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground"><Trans>Project not found.</Trans></p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
        {project.title}
      </h2>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">
          {CATEGORY_LABELS[project.category as ProjectCategory]}
        </Badge>
        <ProjectStatusBadge status={project.status} />
      </div>

      {/* Description */}
      <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
        {project.description}
      </p>

      {/* Funding */}
      {project.fundingTarget != null && project.fundingTarget > 0 && (
        <>
          <Separator />
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <DollarSign className="size-4 text-primary" />
              <Trans>Funding</Trans>
            </h3>
            <FundingBar
              current={project.fundingCurrent}
              target={project.fundingTarget}
            />
            {project.status === "funding" && (
              <ContributeForm
                projectId={project.id}
                fundingCurrent={project.fundingCurrent}
                fundingTarget={project.fundingTarget}
              />
            )}
            {project.userContributionTotal > 0 && (
              <p className="text-xs text-muted-foreground">
                <Trans>Your contribution: ${(project.userContributionTotal / 100).toLocaleString()}</Trans>
              </p>
            )}
          </div>
        </>
      )}

      {/* Volunteers */}
      {(project.status === "funded" || project.status === "ready") &&
        project.volunteersRequired != null && (
          <>
            <Separator />
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <Users className="size-4 text-primary" />
                <Trans>Volunteers</Trans>
              </h3>
              {project.status === "funded" && (
                <>
                  <VolunteerButton
                    projectId={project.id}
                    isVolunteered={project.isVolunteered}
                    volunteersCurrent={project.volunteersCurrent}
                    volunteersRequired={project.volunteersRequired}
                  />
                  {currentUser?.isAdmin && (
                    <BulkInviteForm projectId={project.id} />
                  )}
                </>
              )}
              {project.status === "ready" && (
                <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-4 flex items-center gap-2 text-green-700 dark:text-green-400">
                  <CheckCircle className="size-5" />
                  <span className="text-sm font-medium">
                    <Trans>This project is fully funded and staffed! Stay tuned for updates.</Trans>
                  </span>
                </div>
              )}
            </div>
          </>
        )}

      {/* Like */}
      <Separator />
      <div className="flex justify-center gap-4">
        <LikeButton
          projectId={project.id}
          likes={project.likes}
          userLiked={project.userLiked}
        />
        <ShareButton projectId={project.id} title={project.title} />
      </div>
    </div>
  )
}
