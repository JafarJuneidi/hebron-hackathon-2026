# Hackathon Project Rules

## Package Manager

- Use **pnpm** exclusively — never npm or yarn
- Install deps: `pnpm add <pkg>`, dev deps: `pnpm add -D <pkg>`
- Run scripts: `pnpm dev`, `pnpm build`, `pnpm lint`, etc.

---

## Stack

### Frontend

- **Vite + React + TypeScript** (strict mode — avoid `any`, use `unknown` with type guards when possible, but don't spend more than 5 minutes on a type problem during the hackathon)
- **shadcn/ui** for all UI components — a shadcn MCP is connected, use it to install components; always check if a shadcn component exists before building anything custom
- **Tailwind CSS** for styling — no custom CSS unless there is no Tailwind alternative
- **TanStack Router** for routing (file-based route structure under `src/routes/`)
- **TanStack Query** for all data fetching — no raw `fetch` or `useEffect` for server state
- **TanStack Table** only if a data table is actually needed — do not install speculatively

### Backend

- **Hono** — keep it simple, one file per route group
- TypeScript throughout
- Return consistent JSON shape from all endpoints: `{ data, error }`
- Type all request bodies and response shapes — use shared types where possible

### Shared Types

- Put shared request/response types in `/shared/types.ts` (imported by both frontend and backend)
- Never duplicate a type definition across frontend and backend

---

## Project Structure

```
/
├── frontend/
│   ├── src/
│   │   ├── routes/         # TanStack Router file-based routes
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities and helpers
│   │   └── main.tsx
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── routes/         # Hono route files (one per domain)
│   │   └── index.ts        # Entry point, mounts all routes
│   └── package.json
├── shared/
│   └── types.ts            # Shared TS interfaces for API contracts
├── TODO.md
└── CLAUDE.md
```

---

## Code Standards

- Always define types/interfaces for props, API response shapes, and function signatures
- Named exports everywhere — default exports only for route/page components (TanStack Router requires it)
- File naming: kebab-case for files, PascalCase for components
- Keep components under ~150 lines — split if larger
- No magic numbers — use named constants
- Handle all errors explicitly — no silent promise rejections

---

## Design

- Use only shadcn/ui design tokens and Tailwind's default palette
- Keep it clean: whitespace over decoration
- Primary color: [fill in once idea is announced]
- Do not invent custom color schemes — use shadcn's theming system

---

## Context Management

- For self-contained tasks (a single API route, a single component, a bug fix),
  use the Task tool to spawn a subagent
- Report back to the main context only: files changed, types/interfaces exposed,
  and decisions that affect other parts of the app
- Do not summarize implementation details unless asked
- When compacting, always preserve: list of modified files, open TODO items,
  and any decisions about API shapes or shared types
- After two failed correction attempts on the same issue, stop and ask the user
  to clarify rather than trying a third approach

---

## Team Coordination

### TODO.md is the source of truth

- Before starting any task: read `TODO.md` and `git pull`
- After completing any task: update `TODO.md` and `git push` immediately
- Claude should remind the user to pull before starting a new task and push after finishing one

### TODO.md format

Each team member (Jafar, Omar, Yusuf) has their own "In Progress" section to reduce
merge conflicts. Shared sections (Up Next, Ideas, Done, Blockers) are at the bottom.

```
## Jafar — In Progress
- [ ] thing A (started HH:MM)

## Omar — In Progress
- [ ] thing B (started HH:MM)

## Yusuf — In Progress
- [ ] thing C (started HH:MM)

## Up Next (prioritized)
- [ ] thing D — unassigned
- [ ] thing E — unassigned

## Ideas / Maybe
- rough idea 1

## Done
- [x] thing 1 — Jafar
- [x] thing 2 — Omar

## Blockers
- Omar needs X from Jafar before starting Y
```

### Rules

- Each person only edits their own "In Progress" section — never touch someone else's
- "Up Next" should always have at least 2 unassigned items so anyone
  can self-assign immediately when they finish something
- "Ideas / Maybe" is for uncommitted thoughts — anyone or Claude can
  promote an idea to "Up Next" if it makes sense
- Keep timestamps on "In Progress" items so stale work is visible
- If a task has been "In Progress" for more than 45 minutes, flag it
- When TODO.md conflicts on merge, keep both sides and re-sort — takes 30 seconds

---

## UI/UX Rules

- Use spacing scales consistently — don't invent arbitrary pixel values,
  stick to Tailwind's spacing scale (4, 8, 12, 16, 24, 32, 48, 64px)
- Limit font sizes to 4–5 steps maximum per page
- Never use pure black (#000) for text — use slate-800 or slate-900
- Establish visual hierarchy through size and weight, not color alone
- Use color sparingly — one primary action color, semantic colors for
  status only (green=success, red=error), gray for everything else
- Every UI element should have a clear purpose — remove anything decorative
  that doesn't aid comprehension
- Add loading states to the main data flow. Empty/error states are
  polish — add them in the last hour if time permits
- Actions should look clickable, static content should not
- Group related items visually — use spacing to imply relationships,
  not borders and boxes

---

## Hackathon Philosophy

- Total time: 7 hours. Ship a demo, not a product.
- Hour 0–1: Idea, architecture, scaffold core routes/API
- Hour 1–5: Build vertical slices — each feature demo-able on its own
- Hour 5–6: Connect everything, polish the happy path
- Hour 6–7: Fix demo-breaking bugs only, prep presentation
- If a feature is taking >45 minutes and isn't demo-critical, cut it
- Ugly but working beats beautiful but broken

---

## What Claude Should Do

- Before implementing anything non-trivial, state the plan in 2–3 sentences
- Prefer editing existing files over creating new ones
- Do not install new packages without mentioning it first
- When unsure between two approaches, pick the simpler one and note the tradeoff
- Use `pnpm` for every package manager command, without exception
