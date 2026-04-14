import { createFileRoute, Link } from "@tanstack/react-router"
import { Trans } from "@lingui/react/macro"
import { useAuth } from "@clerk/react"
import { useProjects } from "@/hooks/use-projects"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, DollarSign, Users, ArrowRight } from "lucide-react"

export const Route = createFileRoute("/")({
  component: HomePage,
})

function HomePage() {
  const { isSignedIn } = useAuth()
  const { data: projects, isLoading } = useProjects("likes")

  const featured = projects?.slice(0, 3) ?? []

  return (
    <div className="space-y-12 py-4 sm:space-y-16 sm:py-8">
      {/* Hero */}
      <section className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
          <Trans>Takatuf</Trans>
        </h1>
        <p className="mx-auto max-w-xl text-base text-muted-foreground sm:text-lg">
          <Trans>Connecting volunteers with sponsors to fund and execute community
          projects. Suggest ideas, fund what matters, and volunteer to make it
          happen.</Trans>
        </p>
        <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
          <Link to="/projects">
            <Button size="lg">
              <Trans>Browse Projects</Trans>
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </Link>
          {isSignedIn && (
            <Link to="/submit">
              <Button size="lg" variant="outline">
                <Trans>Submit an Idea</Trans>
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="space-y-6">
        <h2 className="text-center text-xl font-semibold text-foreground">
          <Trans>How It Works</Trans>
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="text-center space-y-2">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10">
              <Heart className="size-6 text-primary" />
            </div>
            <h3 className="font-medium text-foreground"><Trans>Suggest & Vote</Trans></h3>
            <p className="text-sm text-muted-foreground">
              <Trans>Submit volunteering ideas and like the projects you believe in.</Trans>
            </p>
          </div>
          <div className="text-center space-y-2">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10">
              <DollarSign className="size-6 text-primary" />
            </div>
            <h3 className="font-medium text-foreground"><Trans>Fund</Trans></h3>
            <p className="text-sm text-muted-foreground">
              <Trans>Contribute to projects you care about and watch them reach their
              funding goals.</Trans>
            </p>
          </div>
          <div className="text-center space-y-2">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10">
              <Users className="size-6 text-primary" />
            </div>
            <h3 className="font-medium text-foreground"><Trans>Volunteer</Trans></h3>
            <p className="text-sm text-muted-foreground">
              <Trans>Once funded, sign up to volunteer and help bring the project to
              life.</Trans>
            </p>
          </div>
        </div>
      </section>

      {/* Featured projects */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            <Trans>Featured Projects</Trans>
          </h2>
          <Link
            to="/projects"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Trans>View all</Trans>
          </Link>
        </div>

        {isLoading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="space-y-3 p-6">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-2 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && featured.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                <Trans>No projects yet. Be the first to submit an idea!</Trans>
              </p>
            </CardContent>
          </Card>
        )}

        {!isLoading && featured.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
