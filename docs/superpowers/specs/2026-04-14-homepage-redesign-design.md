# Home Page Redesign - Design Spec

## Context

Takatuf's home page is functional but visually flat - a simple hero, static "how it works" steps, and a project grid. For a community volunteering/funding platform, the page needs warmth, motion, and visual texture to convey that this is a living community, not a static tool. The goal is to add "just the right amount of flare" - subtle scroll animations, background patterns, warmer colors, and 1-2 new content sections.

## Design Decisions

- **Tone:** Warm & community-oriented
- **Animation level:** Gentle scroll reveals (fade-in + slide-up), no parallax
- **Visual texture:** Hero Patterns (heropatterns.com) as subtle SVG background patterns
- **Imagery:** Inline SVG illustration in the hero
- **Scope:** Enhance all 3 existing sections + add 2 new sections (impact stats, community CTA)

## Color Palette Update

Shift primary from cold blue/purple to teal/emerald. Add a warm amber accent.

### Light Mode
| Token | Current | New | Why |
|-------|---------|-----|-----|
| `--primary` | `oklch(0.546 0.245 262.881)` (blue) | `oklch(0.55 0.17 165)` (teal) | Warmer, community feel |
| `--ring` | Same as primary | Same as new primary | Consistency |
| `--chart-1` | Same as primary | Same as new primary | Consistency |

### Dark Mode
| Token | Current | New |
|-------|---------|-----|
| `--primary` | `oklch(0.623 0.214 259.815)` | `oklch(0.65 0.17 165)` |
| `--ring` | Same as primary | Same as new primary |
| `--chart-1` | Same as primary | Same as new primary |

Amber accent is not a new CSS variable - it's used directly via Tailwind classes (`text-amber-500`, `bg-amber-500/10`) only where needed (stat counters, highlights).

All sidebar-primary, sidebar-ring tokens updated to match.

## Section-by-Section Design

### 1. Hero Section (enhanced)

**Layout changes:**
- Full-width bleed: break out of `max-w-5xl` container with negative margins + padding
- More vertical padding (py-20 sm:py-28)

**Visual treatment:**
- Background: gradient `from-primary/5 via-primary/2 to-transparent`
- Hero Pattern overlay: "topography" pattern at ~4% opacity, uses `currentColor` so it adapts to theme
- Title: larger (text-5xl sm:text-7xl), add subtle gradient text effect via `bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70`
- Below CTAs: inline SVG illustration of connected people/community (~180px tall), uses primary + amber colors

**Animation:**
- Title, tagline, CTAs, and illustration fade in + slide up on mount with staggered timing (not scroll-triggered since above the fold)
- Use `motion` component with `initial={{ opacity: 0, y: 20 }}` and `animate={{ opacity: 1, y: 0 }}`

### 2. How It Works (enhanced)

**Visual treatment:**
- Section gets a subtle background: `bg-muted/30` with "plus" Hero Pattern at ~3% opacity
- Full-width bleed (same technique as hero)
- Each step rendered inside a light card (`bg-card/50 rounded-xl p-6`)
- Number badges slightly larger (size-12), with a ring/glow effect: `ring-4 ring-primary/10`
- Connector line becomes dashed: `border-dashed`

**Animation:**
- Entire section fades in on scroll via `whileInView`
- Steps stagger in: parent uses `staggerChildren: 0.15`, each child fades up

### 3. Impact Stats Section (new)

**Position:** Between "How It Works" and "Featured Projects"

**Content:** 3 counters in a row:
- "Projects Funded" - count of projects with status funded/ready
- "Volunteers Joined" - sum of all volunteersCurrent
- "Total Raised" - sum of all fundingCurrent (formatted as $X,XXX)

These pull from the existing `useProjects` hook data (computed client-side from the projects array). No new API endpoint needed.

**Visual treatment:**
- Clean layout: 3 columns, centered
- Numbers in large bold text (text-4xl font-bold) with amber-500 color
- Labels below in muted-foreground, text-sm
- No cards, no borders - just numbers and labels with generous spacing

**Animation:**
- Numbers count up from 0 using a custom `CountUp` component
- Count animation triggers on scroll into view, runs once
- Duration: ~1.5s, ease-out curve

### 4. Featured Projects (enhanced)

**Visual treatment (minimal changes):**
- Cards get hover lift: `hover:-translate-y-1 hover:shadow-lg` transition
- No structural changes to `ProjectCard` component - changes applied via wrapper className

**Animation:**
- Cards stagger-animate in on scroll (fade-up, 100ms delay between each)
- Wrapper uses motion's `staggerChildren: 0.1`

### 5. Community CTA Banner (new)

**Position:** After "Featured Projects", before footer

**Content:**
- Headline: "Every Hand Makes a Difference" (translatable)
- Subtitle: short motivational line
- Single CTA: "Get Involved" button linking to /projects

**Visual treatment:**
- Full-width bleed section
- Warm gradient background: `from-primary/5 via-amber-500/5 to-primary/5`
- Hero Pattern overlay: "wiggle" or "floating-cogs" at ~3% opacity
- Generous padding (py-16 sm:py-20)
- Centered text

**Animation:**
- Fade in on scroll

## Animation Architecture

### New dependency
- `motion` (formerly framer-motion) - install via `pnpm add motion`

### Reusable wrapper component: `AnimatedSection`
```
// frontend/src/components/animated-section.tsx
// Wraps children in a motion.div with whileInView fade-up animation
// Props: delay?, className?, stagger? (for child staggering)
// Uses once: true so animation doesn't re-trigger
// Respects prefers-reduced-motion via motion's built-in support
```

### CountUp component: `CountUp`
```
// frontend/src/components/count-up.tsx  
// Animates a number from 0 to target value
// Props: target: number, duration?: number, prefix?: string
// Uses useInView from motion + requestAnimationFrame for smooth counting
// Triggers once on scroll into view
```

### Community illustration: `CommunityIllustration`
```
// frontend/src/components/community-illustration.tsx
// Inline SVG: abstract connected people/hands in a semicircle
// Uses currentColor + specific color props for theme adaptability
// ~180px tall, centered
```

## Hero Patterns Implementation

Define patterns as CSS classes in `index.css`:

```css
.pattern-topography {
  background-image: url("data:image/svg+xml,...");
}
.pattern-plus {
  background-image: url("data:image/svg+xml,...");
}
.pattern-wiggle {
  background-image: url("data:image/svg+xml,...");
}
```

Each pattern class sets only `background-image`. Opacity and color controlled via Tailwind (`opacity-[0.04]`) and the SVG's fill color referencing theme tokens.

## Files Modified

| File | Change |
|------|--------|
| `frontend/src/index.css` | Update primary color tokens (light + dark), add hero pattern CSS classes |
| `frontend/src/routes/index.tsx` | Full home page redesign with all 5 sections |
| `frontend/src/routes/__root.tsx` | Allow full-bleed via `overflow-x-hidden` on the flex container |

## New Files

| File | Purpose | ~Lines |
|------|---------|--------|
| `frontend/src/components/animated-section.tsx` | Reusable scroll-reveal motion wrapper | ~25 |
| `frontend/src/components/count-up.tsx` | Animated number counter | ~35 |
| `frontend/src/components/community-illustration.tsx` | Inline SVG hero illustration | ~60 |

## Verification Plan

1. `pnpm build` - ensure no type errors or build failures
2. `pnpm dev` - open browser and verify:
   - Hero section loads with fade-in animation, gradient text, illustration visible
   - Scroll down: "How It Works" steps stagger in with cards and pattern background
   - Continue scrolling: impact stats count up from 0
   - Featured projects cards stagger in with hover lift effect
   - CTA banner fades in with warm gradient + pattern
3. Toggle dark mode (press D) - verify all sections adapt correctly, patterns visible but subtle
4. Check mobile viewport (~375px) - verify responsive layout, no horizontal overflow
5. Check `prefers-reduced-motion` - animations should be instant/skipped
