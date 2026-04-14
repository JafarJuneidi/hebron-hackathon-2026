import { createFileRoute, Link } from "@tanstack/react-router"
import { Trans } from "@lingui/react/macro"
import { usePendingProjects } from "@/hooks/use-admin"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { ProjectCategory } from "@shared/types"

export const Route = createFileRoute("/admin/")({
  component: AdminPage,
})

const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  education: "Education",
  environment: "Environment",
  health: "Health",
  infrastructure: "Infrastructure",
  community: "Community",
  other: "Other",
}

function AdminPage() {
  const { data: projects, isLoading } = usePendingProjects()

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">
          <Trans>Admin Dashboard</Trans>
        </h1>
        <p className="text-muted-foreground mt-1">
          <Trans>Review and approve submitted project ideas.</Trans>
        </p>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32 mt-1" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && (!projects || projects.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              <Trans>No pending projects to review.</Trans>
            </p>
          </CardContent>
        </Card>
      )}

      {!isLoading && projects && projects.length > 0 && (
        <div className="flex flex-col gap-4">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="text-base text-foreground sm:text-lg">
                      {project.title}
                    </CardTitle>
                    <Badge variant="secondary">
                      {CATEGORY_LABELS[project.category]}
                    </Badge>
                  </div>
                  <Link to="/admin/review/$projectId" params={{ projectId: String(project.id) }}>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      <Trans>Review</Trans>
                    </Button>
                  </Link>
                </div>
                <CardDescription>
                  <Trans>Submitted by {project.submittedBy} on{" "}
                  {new Date(project.createdAt).toLocaleDateString()}</Trans>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/90 line-clamp-2">
                  {project.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
