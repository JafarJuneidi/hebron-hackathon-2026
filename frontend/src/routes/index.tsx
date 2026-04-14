import { createFileRoute, Link } from "@tanstack/react-router"
import { Trans } from "@lingui/react/macro"
import { useLingui } from "@lingui/react/macro"
import { useProjects } from "@/hooks/use-projects"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

export const Route = createFileRoute("/")({
  component: HomePage,
})

function HomePage() {
  const { t } = useLingui()
  const { data: projects, isLoading } = useProjects("likes")

  const featured = projects?.slice(0, 3) ?? []

  const steps = [
    {
      title: t`Submit an Idea`,
      desc: t`Propose a volunteering project for your community.`,
    },
    {
      title: t`Community Funds It`,
      desc: t`People contribute to make it happen.`,
    },
    {
      title: t`Volunteers Join`,
      desc: t`Sign up and bring the project to life.`,
    },
  ]

  return (
    <div className="space-y-12 py-4 sm:space-y-16 sm:py-8">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-transparent -mx-4 px-4 py-12 sm:py-16 text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl">
          <Trans>Takatuf</Trans>
        </h1>
        <p className="mx-auto max-w-xl text-base text-muted-foreground sm:text-lg">
          <Trans>Fund community projects. Volunteer to make them happen.</Trans>
        </p>
        <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
          <Link to="/projects">
            <Button size="lg">
              <Trans>Explore Projects</Trans>
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </Link>
          <Link to="/submit">
            <Button size="lg" variant="outline">
              <Trans>Submit an Idea</Trans>
            </Button>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="space-y-6">
        <h2 className="text-center text-xl font-semibold text-foreground">
          <Trans>How It Works</Trans>
        </h2>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 sm:gap-4">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center flex-1 relative">
              {/* connector line on desktop */}
              {i < steps.length - 1 && (
                <div className="hidden sm:block absolute top-5 start-[calc(50%+24px)] end-[calc(-50%+24px)] h-px bg-border" />
              )}
              <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm mb-3">
                {i + 1}
              </div>
              <h3 className="font-medium text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured projects */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              <Trans>Projects That Need You</Trans>
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              <Trans>Support these community initiatives with funding or volunteering.</Trans>
            </p>
          </div>
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
                <Trans>No active projects yet — check back soon or submit your own idea!</Trans>
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
