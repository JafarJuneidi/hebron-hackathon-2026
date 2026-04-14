import { createFileRoute, Link } from "@tanstack/react-router"
import { Trans } from "@lingui/react/macro"
import { useLingui } from "@lingui/react/macro"
import { motion } from "motion/react"
import { useProjects } from "@/hooks/use-projects"
import { ProjectCard } from "@/components/project-card"
import { AnimatedSection, AnimatedItem } from "@/components/animated-section"
import { CountUp } from "@/components/count-up"
import { CommunityIllustration } from "@/components/community-illustration"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Lightbulb, HandCoins, UsersRound } from "lucide-react"
import type { ProjectWithScore } from "@shared/types"

export const Route = createFileRoute("/")({
  component: HomePage,
})

function computeStats(projects: ProjectWithScore[]) {
  let funded = 0
  let volunteers = 0
  let raised = 0
  for (const p of projects) {
    if (p.status === "funded" || p.status === "ready") funded++
    volunteers += p.volunteersCurrent
    raised += p.fundingCurrent
  }
  return { funded, volunteers, raisedDollars: Math.floor(raised / 100) }
}

function HomePage() {
  const { t } = useLingui()
  const { data: projects, isLoading } = useProjects("likes")

  const featured = projects?.slice(0, 3) ?? []
  const stats = projects ? computeStats(projects) : null

  const steps = [
    {
      icon: Lightbulb,
      title: t`Submit an Idea`,
      desc: t`Propose a volunteering project for your community.`,
    },
    {
      icon: HandCoins,
      title: t`Community Funds It`,
      desc: t`People contribute to make it happen.`,
    },
    {
      icon: UsersRound,
      title: t`Volunteers Join`,
      desc: t`Sign up and bring the project to life.`,
    },
  ]

  return (
    <div className="space-y-16 py-4 sm:space-y-24 sm:py-8">
      {/* ── Hero ── */}
      <section className="relative -mx-4 px-4 py-12 sm:py-16 text-center overflow-hidden">
        {/* Pattern overlay */}
        <div className="absolute inset-0 pattern-dots opacity-[0.03] dark:opacity-[0.06] pointer-events-none" />
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-5xl font-bold tracking-tight sm:text-7xl"
          >
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              <Trans>Takatuf</Trans>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="mx-auto max-w-xl text-base text-muted-foreground sm:text-lg"
          >
            <Trans>Fund community projects. Volunteer to make them happen.</Trans>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row"
          >
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.35 }}
          >
            <CommunityIllustration className="mx-auto mt-8 w-full max-w-sm text-primary" />
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="relative -mx-4 px-4 py-12 sm:py-16">
        {/* Pattern overlay */}
        <div className="absolute inset-0 pattern-plus opacity-[0.025] dark:opacity-[0.05] pointer-events-none" />
        <div className="absolute inset-0 bg-muted/30 pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-5xl">
          <AnimatedSection>
            <h2 className="text-center text-2xl font-semibold text-foreground mb-8 sm:mb-10">
              <Trans>How It Works</Trans>
            </h2>
          </AnimatedSection>

          <AnimatedSection stagger className="flex flex-col sm:flex-row items-stretch gap-6 sm:gap-4">
            {steps.map((step, i) => (
              <AnimatedItem key={i} className="flex-1">
                <div className="flex flex-col items-center text-center bg-card/60 backdrop-blur-sm rounded-xl p-6 h-full">
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground ring-4 ring-primary/10 mb-4">
                    <step.icon className="size-5" />
                  </div>
                  <h3 className="font-medium text-foreground mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              </AnimatedItem>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* ── Impact Stats ── */}
      {stats && (stats.funded > 0 || stats.volunteers > 0 || stats.raisedDollars > 0) && (
        <AnimatedSection stagger className="text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-8">
            <Trans>Community Impact</Trans>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <AnimatedItem className="space-y-1">
              <p className="text-4xl font-bold text-amber-500">
                <CountUp target={stats.funded} />
              </p>
              <p className="text-sm text-muted-foreground">
                <Trans>Projects Funded</Trans>
              </p>
            </AnimatedItem>
            <AnimatedItem className="space-y-1">
              <p className="text-4xl font-bold text-amber-500">
                <CountUp target={stats.volunteers} />
              </p>
              <p className="text-sm text-muted-foreground">
                <Trans>Volunteers Joined</Trans>
              </p>
            </AnimatedItem>
            <AnimatedItem className="space-y-1">
              <p className="text-4xl font-bold text-amber-500">
                <CountUp target={stats.raisedDollars} prefix="$" />
              </p>
              <p className="text-sm text-muted-foreground">
                <Trans>Total Raised</Trans>
              </p>
            </AnimatedItem>
          </div>
        </AnimatedSection>
      )}

      {/* ── Featured Projects ── */}
      <section className="space-y-6">
        <AnimatedSection>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
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
        </AnimatedSection>

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
          <AnimatedSection stagger>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((project) => (
                <AnimatedItem key={project.id}>
                  <div className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg rounded-xl">
                    <ProjectCard project={project} />
                  </div>
                </AnimatedItem>
              ))}
            </div>
          </AnimatedSection>
        )}
      </section>

      {/* ── Community CTA ── */}
      <section className="relative -mx-4 px-4 py-16 sm:py-20 text-center overflow-hidden">
        {/* Pattern overlay */}
        <div className="absolute inset-0 pattern-waves opacity-[0.03] dark:opacity-[0.06] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-amber-500/5 to-primary/5 pointer-events-none" />

        <AnimatedSection className="relative z-10 space-y-4">
          <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
            <Trans>Every Hand Makes a Difference</Trans>
          </h2>
          <p className="mx-auto max-w-md text-muted-foreground">
            <Trans>
              Whether you fund a project or show up to help — your contribution
              builds a stronger community.
            </Trans>
          </p>
          <div className="pt-2">
            <Link to="/projects">
              <Button size="lg" variant="outline">
                <Trans>Get Involved</Trans>
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
