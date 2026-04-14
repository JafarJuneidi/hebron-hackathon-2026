import { useState } from "react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { useApproveProject, useRejectProject } from "@/hooks/use-admin"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import type { Project, ProjectCategory } from "@shared/types"

export const Route = createFileRoute("/admin/review/$projectId")({
  component: AdminReviewPage,
})

const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  education: "Education",
  environment: "Environment",
  health: "Health",
  infrastructure: "Infrastructure",
  community: "Community",
  other: "Other",
}

function AdminReviewPage() {
  const { projectId } = Route.useParams()
  const navigate = useNavigate()

  const [fundingTarget, setFundingTarget] = useState("")
  const [volunteersRequired, setVolunteersRequired] = useState("")

  const {
    data: project,
    isLoading,
  } = useQuery({
    queryKey: ["admin", "project", projectId],
    queryFn: () => api.get<Project>(`/api/admin/projects/pending`).then(
      (projects) => {
        // The pending endpoint returns an array; find the specific project
        const list = projects as unknown as Project[]
        const found = list.find((p) => String(p.id) === projectId)
        if (!found) throw new Error("Project not found")
        return found
      }
    ),
  })

  const approveMutation = useApproveProject()
  const rejectMutation = useRejectProject()

  function handleApprove(e: React.FormEvent) {
    e.preventDefault()

    const funding = parseFloat(fundingTarget)
    const volunteers = parseInt(volunteersRequired, 10)

    if (isNaN(funding) || funding <= 0) {
      toast.error("Please enter a valid funding target")
      return
    }

    if (isNaN(volunteers) || volunteers <= 0) {
      toast.error("Please enter a valid number of volunteers")
      return
    }

    approveMutation.mutate(
      {
        id: Number(projectId),
        fundingTarget: funding,
        volunteersRequired: volunteers,
      },
      {
        onSuccess: () => {
          toast.success("Project approved!")
          void navigate({ to: "/admin" })
        },
        onError: (error: Error) => {
          toast.error(error.message || "Failed to approve project")
        },
      }
    )
  }

  function handleReject() {
    rejectMutation.mutate(Number(projectId), {
      onSuccess: () => {
        toast.success("Project rejected")
        void navigate({ to: "/admin" })
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to reject project")
      },
    })
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-32 mt-1" />
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Project not found.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isPending = approveMutation.isPending || rejectMutation.isPending

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <CardTitle className="text-2xl font-semibold text-foreground">
              {project.title}
            </CardTitle>
            <Badge variant="secondary">
              {CATEGORY_LABELS[project.category]}
            </Badge>
          </div>
          <CardDescription>
            Submitted by {project.submittedBy} on{" "}
            {new Date(project.createdAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
            {project.description}
          </p>

          <Separator />

          <form onSubmit={handleApprove} className="flex flex-col gap-6">
            <h3 className="text-lg font-medium text-foreground">
              Approve Project
            </h3>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="funding"
                className="text-sm font-medium text-foreground/90"
              >
                Funding Target ($)
              </label>
              <Input
                id="funding"
                type="number"
                min="1"
                step="1"
                placeholder="e.g. 5000"
                value={fundingTarget}
                onChange={(e) => setFundingTarget(e.target.value)}
                disabled={isPending}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="volunteers"
                className="text-sm font-medium text-foreground/90"
              >
                Volunteers Required
              </label>
              <Input
                id="volunteers"
                type="number"
                min="1"
                step="1"
                placeholder="e.g. 10"
                value={volunteersRequired}
                onChange={(e) => setVolunteersRequired(e.target.value)}
                disabled={isPending}
              />
            </div>

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={isPending}>
                {approveMutation.isPending ? "Approving..." : "Approve"}
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleReject}
                disabled={isPending}
              >
                {rejectMutation.isPending ? "Rejecting..." : "Reject"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
