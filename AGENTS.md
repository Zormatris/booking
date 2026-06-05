# AGENTS.md

This repository uses a GPT + Claude Code + GitHub build workflow for LedgerDesk.

LedgerDesk is a desktop-first bookkeeping web app. The first version is a localStorage MVP for one real bookkeeper to test quickly.

## If you are Claude Code

Read `CLAUDE.md` before doing anything else.

Then read the docs in this order:

1. `docs/01_PRODUCT.md`
2. `docs/02_PHASES.md`
3. `docs/03_STATUS.md`
4. `docs/04_DESIGN.md`
5. `docs/05_WORKFLOW.md`

Build only the current handoff target. Update `docs/03_STATUS.md` before ending the session.

## If you are another coding agent

Do not change product scope casually. Follow `CLAUDE.md`, the docs folder, and the current handoff prompt.

Do not add these during Phase 1:

- auth
- Supabase
- Stripe
- bank feeds
- payroll
- invoice sending
- receipt uploads
- AI categorization
- mobile-first redesign

The product should stay simple, desktop-first, and useful for basic bookkeeping.
