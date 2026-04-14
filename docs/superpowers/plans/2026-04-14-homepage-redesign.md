# Home Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform Takatuf's flat home page into a warm, animated experience with scroll reveals, background patterns, impact stats, and a community CTA section.

**Architecture:** The home page (`frontend/src/routes/index.tsx`) is rebuilt with 5 sections that use reusable animation wrappers (`AnimatedSection`, `CountUp`) powered by the `motion` library. Background texture comes from inline SVG hero patterns defined in CSS. Color palette shifts from cold blue to warm teal.

**Tech Stack:** React, motion (animation), Tailwind CSS, Lingui (i18n), heropatterns.com SVG patterns

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `frontend/package.json` | Modify | Add `motion` dependency |
| `frontend/src/index.css` | Modify | Update color tokens + add hero pattern CSS classes |
| `frontend/src/components/animated-section.tsx` | Create | Reusable scroll-reveal wrapper |
| `frontend/src/components/count-up.tsx` | Create | Animated number counter |
| `frontend/src/components/community-illustration.tsx` | Create | Inline SVG hero illustration |
| `frontend/src/routes/__root.tsx` | Modify | Add `overflow-x-hidden` for full-bleed sections |
| `frontend/src/routes/index.tsx` | Modify | Full home page rewrite with all 5 sections |

---

### Task 1: Install motion dependency

**Files:**
- Modify: `frontend/package.json`

- [ ] **Step 1: Install motion**

```bash
cd /Users/jjuneidi/personal/hebron-hackathon-2026/frontend && pnpm add motion
```

- [ ] **Step 2: Verify installation**

```bash
cd /Users/jjuneidi/personal/hebron-hackathon-2026/frontend && node -e "require('motion/package.json').version"
```

Expected: prints a version number (11.x or higher)

- [ ] **Step 3: Commit**

```bash
cd /Users/jjuneidi/personal/hebron-hackathon-2026 && git add frontend/package.json frontend/pnpm-lock.yaml && git commit -m "chore: add motion library for scroll animations"
```

---

### Task 2: Update color palette and add hero pattern CSS classes

**Files:**
- Modify: `frontend/src/index.css`

- [ ] **Step 1: Update light mode color tokens**

In `frontend/src/index.css`, inside the `:root` block, replace the primary, ring, chart-1, sidebar-primary, and sidebar-ring values:

```css
/* :root block — replace these lines */
--primary: oklch(0.55 0.17 165);
--primary-foreground: oklch(0.985 0 0);
--ring: oklch(0.55 0.17 165);
--chart-1: oklch(0.55 0.17 165);
--sidebar-primary: oklch(0.55 0.17 165);
--sidebar-ring: oklch(0.55 0.17 165);
```

- [ ] **Step 2: Update dark mode color tokens**

In the `.dark` block, replace the same tokens:

```css
/* .dark block — replace these lines */
--primary: oklch(0.65 0.17 165);
--ring: oklch(0.65 0.17 165);
--chart-1: oklch(0.65 0.17 165);
--sidebar-primary: oklch(0.65 0.17 165);
--sidebar-ring: oklch(0.65 0.17 165);
```

- [ ] **Step 3: Add hero pattern CSS classes**

Append these classes after the `@layer base` block at the end of `frontend/src/index.css`:

```css
/* Hero Patterns — SVG background textures (heropatterns.com, CC BY 4.0) */
.pattern-dots {
  background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='1.5' fill='%239ca3af'/%3E%3C/svg%3E");
  background-size: 20px 20px;
}

.pattern-plus {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239ca3af' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E");
  background-size: 60px 60px;
}

.pattern-waves {
  background-image: url("data:image/svg+xml,%3Csvg width='76' height='18' viewBox='0 0 76 18' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M32 18c-2.43-1.824-4-4.628-4-7.5C28 5.17 24.17 1 19.5 1S11 5.17 11 10.5c0 2.872-1.57 5.676-4 7.5h-2c2.43-1.824 4-4.628 4-7.5C9 5.17 12.83 1 17.5 1S26 5.17 26 10.5c0 2.872 1.57 5.676 4 7.5h2zm42 0c-2.43-1.824-4-4.628-4-7.5C70 5.17 66.17 1 61.5 1S53 5.17 53 10.5c0 2.872-1.57 5.676-4 7.5h-2c2.43-1.824 4-4.628 4-7.5C51 5.17 54.83 1 59.5 1S68 5.17 68 10.5c0 2.872 1.57 5.676 4 7.5h2z' fill='%239ca3af' fill-rule='evenodd'/%3E%3C/svg%3E");
  background-size: 76px 18px;
}
```

- [ ] **Step 4: Verify build**

```bash
cd /Users/jjuneidi/personal/hebron-hackathon-2026/frontend && pnpm build
```

Expected: build succeeds with no errors

- [ ] **Step 5: Commit**

```bash
cd /Users/jjuneidi/personal/hebron-hackathon-2026 && git add frontend/src/index.css && git commit -m "style: warm teal palette and hero pattern CSS classes"
```

---

### Task 3: Create AnimatedSection component

**Files:**
- Create: `frontend/src/components/animated-section.tsx`

- [ ] **Step 1: Create the component**

Write `frontend/src/components/animated-section.tsx`:

```tsx
import { type ReactNode } from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  stagger?: boolean
}

const containerVariants = {
  hidden: {},
  visible: (stagger: boolean) => ({
    transition: stagger ? { staggerChildren: 0.15 } : undefined,
  }),
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}

export function AnimatedSection({
  children,
  className,
  delay = 0,
  stagger = false,
}: AnimatedSectionProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      custom={stagger}
      variants={containerVariants}
      transition={{ delay }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div variants={itemVariants} className={cn(className)}>
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
cd /Users/jjuneidi/personal/hebron-hackathon-2026/frontend && pnpm build
```

Expected: build succeeds

- [ ] **Step 3: Commit**

```bash
cd /Users/jjuneidi/personal/hebron-hackathon-2026 && git add frontend/src/components/animated-section.tsx && git commit -m "feat: add AnimatedSection scroll-reveal component"
```

---

### Task 4: Create CountUp component

**Files:**
- Create: `frontend/src/components/count-up.tsx`

- [ ] **Step 1: Create the component**

Write `frontend/src/components/count-up.tsx`:

```tsx
import { useRef, useState, useEffect } from "react"
import { useInView } from "motion/react"

interface CountUpProps {
  target: number
  duration?: number
  prefix?: string
  suffix?: string
}

export function CountUp({
  target,
  duration = 1.5,
  prefix = "",
  suffix = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!isInView || target === 0) return

    const start = performance.now()
    let rafId: number

    const step = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.floor(eased * target))
      if (progress < 1) {
        rafId = requestAnimationFrame(step)
      }
    }

    rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
  }, [isInView, target, duration])

  return (
    <span ref={ref}>
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
cd /Users/jjuneidi/personal/hebron-hackathon-2026/frontend && pnpm build
```

Expected: build succeeds

- [ ] **Step 3: Commit**

```bash
cd /Users/jjuneidi/personal/hebron-hackathon-2026 && git add frontend/src/components/count-up.tsx && git commit -m "feat: add CountUp animated number component"
```

---

### Task 5: Create CommunityIllustration component

**Files:**
- Create: `frontend/src/components/community-illustration.tsx`

This is an abstract SVG illustration showing interconnected nodes — representing a community network. Uses `currentColor` (inherits primary) plus amber accent.

- [ ] **Step 1: Create the component**

Write `frontend/src/components/community-illustration.tsx`:

```tsx
export function CommunityIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Connection lines */}
      <line x1="90" y1="70" x2="200" y2="90" stroke="currentColor" strokeWidth="1.5" opacity="0.15" />
      <line x1="130" y1="145" x2="200" y2="90" stroke="currentColor" strokeWidth="1.5" opacity="0.15" />
      <line x1="270" y1="145" x2="200" y2="90" stroke="currentColor" strokeWidth="1.5" opacity="0.15" />
      <line x1="310" y1="70" x2="200" y2="90" stroke="currentColor" strokeWidth="1.5" opacity="0.15" />
      <line x1="200" y1="25" x2="200" y2="90" stroke="currentColor" strokeWidth="1.5" opacity="0.15" />

      {/* Cross connections */}
      <line x1="90" y1="70" x2="130" y2="145" stroke="currentColor" strokeWidth="1" opacity="0.08" />
      <line x1="310" y1="70" x2="270" y2="145" stroke="currentColor" strokeWidth="1" opacity="0.08" />
      <line x1="90" y1="70" x2="200" y2="25" stroke="currentColor" strokeWidth="1" opacity="0.08" />
      <line x1="310" y1="70" x2="200" y2="25" stroke="currentColor" strokeWidth="1" opacity="0.08" />

      {/* Central hub — larger glow */}
      <circle cx="200" cy="90" r="28" fill="currentColor" opacity="0.06" />
      <circle cx="200" cy="90" r="18" fill="currentColor" opacity="0.12" />
      <circle cx="200" cy="90" r="10" fill="currentColor" opacity="0.25" />

      {/* People nodes */}
      <circle cx="90" cy="70" r="14" fill="currentColor" opacity="0.08" />
      <circle cx="90" cy="70" r="8" fill="currentColor" opacity="0.2" />

      <circle cx="310" cy="70" r="14" fill="currentColor" opacity="0.08" />
      <circle cx="310" cy="70" r="8" fill="currentColor" opacity="0.2" />

      <circle cx="200" cy="25" r="12" fill="currentColor" opacity="0.08" />
      <circle cx="200" cy="25" r="7" fill="currentColor" opacity="0.2" />

      <circle cx="130" cy="145" r="12" fill="currentColor" opacity="0.08" />
      <circle cx="130" cy="145" r="7" fill="currentColor" opacity="0.2" />

      <circle cx="270" cy="145" r="12" fill="currentColor" opacity="0.08" />
      <circle cx="270" cy="145" r="7" fill="currentColor" opacity="0.2" />

      {/* Amber accent dots — small highlights */}
      <circle cx="145" cy="80" r="3" className="fill-amber-400" opacity="0.5" />
      <circle cx="255" cy="80" r="3" className="fill-amber-400" opacity="0.5" />
      <circle cx="200" cy="130" r="3.5" className="fill-amber-400" opacity="0.5" />
      <circle cx="165" cy="55" r="2" className="fill-amber-400" opacity="0.4" />
      <circle cx="235" cy="55" r="2" className="fill-amber-400" opacity="0.4" />
    </svg>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
cd /Users/jjuneidi/personal/hebron-hackathon-2026/frontend && pnpm build
```

Expected: build succeeds

- [ ] **Step 3: Commit**

```bash
cd /Users/jjuneidi/personal/hebron-hackathon-2026 && git add frontend/src/components/community-illustration.tsx && git commit -m "feat: add community network SVG illustration"
```

---

### Task 6: Update root layout for full-bleed support

**Files:**
- Modify: `frontend/src/routes/__root.tsx`

- [ ] **Step 1: Add overflow-x-hidden to the root container**

In `frontend/src/routes/__root.tsx`, change:

```tsx
<div className="flex min-h-svh flex-col">
```

to:

```tsx
<div className="flex min-h-svh flex-col overflow-x-hidden">
```

This prevents horizontal scrollbar when full-bleed sections use negative margins to break out of the `max-w-5xl` container.

- [ ] **Step 2: Verify build**

```bash
cd /Users/jjuneidi/personal/hebron-hackathon-2026/frontend && pnpm build
```

Expected: build succeeds

- [ ] **Step 3: Commit**

```bash
cd /Users/jjuneidi/personal/hebron-hackathon-2026 && git add frontend/src/routes/__root.tsx && git commit -m "fix: add overflow-x-hidden for full-bleed sections"
```

---

### Task 7: Rewrite home page with all 5 sections

**Files:**
- Modify: `frontend/src/routes/index.tsx`

This is the main task. The entire home page is rewritten with:
1. Animated hero with gradient text, pattern background, and SVG illustration
2. Enhanced "How It Works" with cards, pattern, and staggered animation
3. New impact stats with animated counters
4. Enhanced featured projects with hover lift and staggered animation
5. New community CTA banner with warm gradient and pattern

- [ ] **Step 1: Rewrite the full home page**

Replace the entire contents of `frontend/src/routes/index.tsx` with:

```tsx
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
      <section className="relative -mx-4 px-4 py-20 sm:py-28 text-center overflow-hidden">
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
```

- [ ] **Step 2: Verify build**

```bash
cd /Users/jjuneidi/personal/hebron-hackathon-2026/frontend && pnpm build
```

Expected: build succeeds with no type errors

- [ ] **Step 3: Commit**

```bash
cd /Users/jjuneidi/personal/hebron-hackathon-2026 && git add frontend/src/routes/index.tsx && git commit -m "feat: redesign home page with animations, patterns, stats, and CTA"
```

---

### Task 8: Visual verification

- [ ] **Step 1: Start dev server**

```bash
cd /Users/jjuneidi/personal/hebron-hackathon-2026/frontend && pnpm dev
```

- [ ] **Step 2: Verify in browser**

Open the app in a browser and check:

1. **Hero section:** Gradient text "Takatuf" fades in, tagline and buttons stagger in after, SVG illustration scales in last. Dot pattern visible as subtle texture. Full-width background extends beyond content area.
2. **How It Works:** Three cards with icons stagger in as you scroll. Plus pattern visible in section background. Cards have rounded corners and semi-transparent background.
3. **Impact Stats:** Numbers count up from 0 in amber color when section scrolls into view. Only shows if there's data.
4. **Featured Projects:** Cards stagger in. Hovering a card lifts it with shadow.
5. **Community CTA:** Warm gradient + wave pattern. Text and button fade in on scroll.
6. **Dark mode:** Press `D` — all sections should adapt. Patterns adjust opacity. Gradient text still readable. Teal primary looks good on dark background.
7. **Mobile (~375px):** All sections stack properly. No horizontal scrollbar. Comfortable padding.

- [ ] **Step 3: Fix any visual issues found**

Address spacing, opacity, or timing issues discovered during visual review.

- [ ] **Step 4: Final commit if fixes were made**

```bash
cd /Users/jjuneidi/personal/hebron-hackathon-2026 && git add -A && git commit -m "polish: visual adjustments from review"
```
