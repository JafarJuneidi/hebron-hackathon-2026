import { createFileRoute, Link } from "@tanstack/react-router"
import { Card, CardContent } from "@/components/ui/card"
import { ProjectDetailContent } from "@/components/project-detail-content"
import { ArrowLeft } from "lucide-react"

export const Route = createFileRoute("/projects/$projectId")({
  component: ProjectDetailPage,
})

function ProjectDetailPage() {
  const { projectId } = Route.useParams()

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        to="/projects"
        className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1 text-sm transition-colors"
      >
        <ArrowLeft className="size-3.5" />
        Back to projects
      </Link>

      <Card>
        <CardContent className="p-6">
          <ProjectDetailContent projectId={projectId} />
        </CardContent>
      </Card>
    </div>
  )
}
