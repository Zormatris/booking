@AGENTS.md

# CLAUDE.md

You are Claude Code working inside the LedgerDesk repository.

LedgerDesk is a desktop-first bookkeeping web app being built quickly for a real bookkeeper who is frustrated with QuickBooks and trying to rebuild parts of her workflow in Excel.

Your job is to build exactly what GPT hands off, keep the app scoped, update status, and report back clearly.

---

## Read Order

Before editing code, read these files in this exact order:

1. `docs/01_PRODUCT.md`
2. `docs/02_PHASES.md`
3. `docs/03_STATUS.md`
4. `docs/04_DESIGN.md`
5. `docs/05_WORKFLOW.md`

After reading those files, inspect the existing repo structure and any relevant code before creating or modifying files.

---

## Rule Priority

If instructions conflict, follow this order:

1. The user's current handoff prompt
2. `docs/03_STATUS.md`
3. `docs/02_PHASES.md`
4. `docs/01_PRODUCT.md`
5. `docs/04_DESIGN.md`
6. `docs/05_WORKFLOW.md`
7. This file

---

## Product Scope

Build LedgerDesk as a practical bookkeeping tool, not a full accounting platform.

Phase 1 uses:

- desktop-first web UI
- localStorage persistence
- simple client management
- simple transaction management
- categories
- basic reports
- backup/export tools

Phase 1 does not use:

- Supabase
- auth
- Stripe
- bank feeds
- payroll
- invoice sending
- receipt uploads
- AI categorization
- multi-user permissions

Do not add excluded features unless the current handoff explicitly changes the phase scope.

---

## Recommended Stack

If the repo is empty or does not contain an app, initialize a simple web app using:

- Next.js App Router
- TypeScript
- Tailwind CSS

Prefer simple handwritten components over installing new UI libraries.

If the repo already has a working app stack, use the existing stack unless the handoff says otherwise.

---

## Build Rules

- Build only the current target.
- Keep the app desktop-first.
- Favor working functionality over visual perfection.
- Use clear business UI copy.
- Use simple local data for Phase 1.
- Keep calculations readable and testable.
- Do not hide data safety limitations.
- Do not create placeholder pages unless the handoff asks for them.
- Do not leave broken routes or dead navigation.
- Do not add marketing copy or public SaaS pages during Phase 1.

---

## Data Rules

For Phase 1:

- Store app data in browser `localStorage`.
- Seed demo data only when storage is empty.
- Never reset user data on refresh.
- Provide JSON export.
- Provide JSON import with basic validation.
- Provide CSV export for selected client transactions.
- Confirm destructive actions.
- Keep all money values numeric internally.
- Format money as USD in the UI.

---

## UI Rules

Follow `docs/04_DESIGN.md`.

Non-negotiables:

- desktop-first layout
- left sidebar
- clear top bar
- client switcher
- readable tables
- practical forms
- no mobile hamburger nav in Phase 1
- no trendy/flashy design
- no copied QuickBooks branding or UI

---

## Accounting Boundary

LedgerDesk is a bookkeeping workflow tool.

Do not write UI copy that claims:

- tax filing compliance
- payroll compliance
- CPA replacement
- official accounting certification
- guaranteed legal/tax accuracy

Use practical wording like "Profit & Loss," "Transactions," "Categories," and "Backup."

---

## End-of-Session Requirements

Before ending a build session:

1. Update `docs/03_STATUS.md`.
2. Run available checks, preferably:

```bash
npm run lint
npm run build
```

3. If git is available, run:

```bash
git status
git add .
git commit -m "[clear commit message]"
git push
```

4. Output the BUILD REPORT exactly as defined in `docs/05_WORKFLOW.md`.

If any check or git command fails, report the exact failure and do not pretend it succeeded.

---

## BUILD REPORT Required Format

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

## Main Principle

The fastest useful version wins.

Build LedgerDesk so the first real user can test whether the workflow is actually better than QuickBooks/Excel before the project grows.
