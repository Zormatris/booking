# 05 — Build Workflow

## Purpose

This file defines how Claude Code should work on LedgerDesk.

LedgerDesk is being built fast for a real first user. The workflow must stay practical, scoped, and testable. Do not overbuild.

---

## The Loop

Every build session follows this cycle:

```text
1. GPT reads docs/03_STATUS.md
2. GPT writes a focused handoff prompt
3. User pastes the handoff into Claude Code
4. Claude reads CLAUDE.md and all docs files
5. Claude inspects the existing repo
6. Claude builds only the current target
7. Claude updates docs/03_STATUS.md
8. Claude runs checks
9. Claude commits and pushes if git is available
10. Claude outputs a BUILD REPORT
11. User gives the BUILD REPORT back to GPT
12. GPT decides next task or correction
```

---

## Claude's Role

Claude is the builder.

Claude should:

- read before editing
- build the requested target
- avoid scope creep
- preserve the existing app unless told otherwise
- keep UI desktop-first
- update status after each session
- report exactly what changed

Claude should not:

- invent extra product features
- add Stripe early
- add auth early
- add Supabase early
- add bank feeds
- add payroll
- turn the app into a massive accounting platform
- redesign the whole app unless requested
- skip status updates

---

## First Build Guidance

If the repository is empty or does not contain a working app yet, Claude may initialize a simple Next.js + TypeScript + Tailwind app.

Recommended default stack for speed:

- Next.js App Router
- TypeScript
- Tailwind CSS
- localStorage for Phase 1 data
- simple handwritten components
- no chart library unless already installed
- no shadcn installation unless already present and working

Do not waste time installing heavy dependencies for Phase 1.

If the repo already has a working framework, use what exists unless it is clearly broken.

---

## Phase 1 Build Bias

Phase 1 is a speed build.

Prefer:

- one clean app shell
- working local data
- simple tables
- simple forms
- clear report calculations
- readable code
- fewer dependencies
- one route per major page

Avoid:

- fancy animations
- complex state libraries
- server actions
- database setup
- auth setup
- Stripe setup
- deep abstraction
- perfect accounting architecture

The goal is a useful demo, not a perfect SaaS foundation.

---

## Suggested File Organization

Claude may choose the exact structure based on the repo, but this structure is preferred if starting fresh:

```text
app/
  layout.tsx
  page.tsx
  clients/page.tsx
  transactions/page.tsx
  categories/page.tsx
  reports/page.tsx
  settings/page.tsx

components/
  AppShell.tsx
  Sidebar.tsx
  TopBar.tsx
  MetricCard.tsx
  TransactionTable.tsx
  TransactionForm.tsx
  ClientForm.tsx
  CategoryManager.tsx

lib/
  types.ts
  seedData.ts
  storage.ts
  calculations.ts
  csv.ts
  formatters.ts
```

If using a single-page stateful app is faster for the first session, that is acceptable only if the UI still has clear page sections and navigation.

---

## State Management Rules

For Phase 1:

- Use React state plus localStorage.
- Keep data types in one place.
- Keep calculations in utility functions.
- Seed demo data only when storage is empty.
- Do not overwrite existing localStorage data on every refresh.
- Provide a reset demo data action only in Settings and mark it clearly.

---

## Data Safety Rules

Even in localStorage, data safety matters.

Claude must:

- avoid accidental data resets
- confirm destructive actions
- validate imported backup shape before replacing data
- keep export/import simple and predictable
- avoid hiding the fact that data is local-only in Phase 1

The Settings page should clearly say:

> Phase 1 stores data in this browser. Export backups often.

---

## Testing Rules

Claude should run the most relevant available checks.

Preferred checks:

```bash
npm run lint
npm run build
```

If the project does not have those scripts, Claude should run whatever check is available and report that limitation.

Claude should not claim tests passed unless they actually ran.

---

## Git Rules

If the repo is connected to git, Claude should run:

```bash
git status
git add .
git commit -m "Build LedgerDesk phase 1 local MVP"
git push
```

If committing is not appropriate or git is unavailable, Claude should report why.

Claude must never silently skip git commands when the workflow expects them.

---

## Status Update Rules

At the end of each build session, Claude must rewrite `docs/03_STATUS.md` to reflect:

- current phase
- exact target completed or in progress
- completed items
- still-not-started items
- blockers
- updated localhost test checklist
- next recommended GPT action

Do not leave template placeholders in `docs/03_STATUS.md`.

---

## BUILD REPORT Format

Claude must end every session with this format:

```md
# BUILD REPORT

## Phase

[Current phase]

## Target Completed

[One sentence]

## Files Changed

- [file path] — [what changed]

## What Works Now

- [specific working behavior]
- [specific working behavior]

## Localhost Test Checklist

1. [thing user should test]
2. [thing user should test]
3. [thing user should test]

## Checks Run

- [command] — [result]

## Git

- [status/add/commit/push result]

## Blockers

- [none, or exact blocker]

## Notes For GPT

[Short handoff notes so GPT can decide the next step]
```

---

## Hard Rule

When in doubt, build the smallest practical bookkeeping feature that helps the first real user test the workflow.
