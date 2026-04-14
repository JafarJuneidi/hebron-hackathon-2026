import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { Trans } from "@lingui/react/macro"
import { useLingui } from "@lingui/react/macro"
import { useProjects } from "@/hooks/use-projects"
import { ProjectCard } from "@/components/project-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/projects/")({
  component: ProjectsPage,
})

type SortOption = "likes" | "funding"
type StatusFilter = "" | "funding" | "funded" | "ready"

function ProjectsPage() {
  const { t } = useLingui()
  const [sort, setSort] = useState<SortOption>("likes")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("")

  const { data: projects, isLoading } = useProjects(
    sort,
    statusFilter || undefined
  )

  const count = projects?.length ?? 0

  const statusOptions: { value: StatusFilter; label: string }[] = [
    { value: "", label: t`All` },
    { value: "funding", label: t`Funding` },
    { value: "funded", label: t`Funded` },
    { value: "ready", label: t`Ready` },
  ]

  const filterSubtitles: Record<StatusFilter, React.ReactNode> = {
    "": null,
    funding: <Trans>These projects need your financial support</Trans>,
    funded: <Trans>Fully funded and looking for volunteers</Trans>,
    ready: <Trans>All set and about to launch!</Trans>,
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">
          <Trans>Browse Projects</Trans>
        </h1>
        <p className="text-muted-foreground mt-1">
          <Trans>Discover and support community volunteering projects.</Trans>
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-sm text-muted-foreground"><Trans>Sort:</Trans></span>
          <div className="flex gap-1">
            <Button
              variant={sort === "likes" ? "default" : "outline"}
              size="sm"
              className="rounded-full"
              onClick={() => setSort("likes")}
            >
              <Trans>Most Liked</Trans>
            </Button>
            <Button
              variant={sort === "funding" ? "default" : "outline"}
              size="sm"
              className="rounded-full"
              onClick={() => setSort("funding")}
            >
              <Trans>Funding</Trans>
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="shrink-0 text-sm text-muted-foreground">
            <Trans>Status:</Trans>
          </span>
          <div className="flex flex-wrap gap-1">
            {statusOptions.map((opt) => (
              <Button
                key={opt.value}
                variant={statusFilter === opt.value ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => setStatusFilter(opt.value)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-4 space-y-1">
        <p className="text-sm text-muted-foreground">{t`Showing ${count} projects`}</p>
        {filterSubtitles[statusFilter] && (
          <p className="text-sm text-muted-foreground">
            {filterSubtitles[statusFilter]}
          </p>
        )}
      </div>

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="space-y-3 p-6">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-2 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && (!projects || projects.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              <Trans>No projects found. Be the first to submit an idea!</Trans>
            </p>
          </CardContent>
        </Card>
      )}

      {!isLoading && projects && projects.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
