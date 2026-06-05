# 03 — Current Build Status

## Current Phase

Phase 2 — Data Safety + Usability Pass

## Current Target

Phase 2 is complete. All Phase 2 checklist items from docs/02_PHASES.md are satisfied.

## Last Build

2026-06-04 — Phase 2 correction pass by Claude Code. Duplicate warning, relationship validation, category cleanup, inactive client switcher fix, stale copy updated.

## Completed

### Phase 1 — Desktop Local MVP
- App shell: 260px sidebar, top bar with client switcher, full desktop layout
- localStorage persistence (single key `ledgerdesk_data`)
- Seeded demo data: 2 clients, 14 categories, 10 transactions (all in current month)
- AppContext: central state management, all CRUD operations
- Dashboard: 4 metric cards, recent transactions table, client notes panel, Add Transaction action
- Clients page: full client list, add/edit/delete with confirmation, active/inactive status, transaction count
- Transactions page: table with all 8 columns, month filter, type filter, search, add/edit/delete, totals footer
- Categories page: two-panel layout (income / expense), add category, active/inactive toggle
- Reports page: monthly P&L, income by category table, expenses by category table, net profit cards, uncategorized warning
- Settings / Backup page: export JSON, import JSON with validation, export selected client CSV, reset demo data with double confirmation
- App metadata updated to LedgerDesk

### Phase 2 — Data Safety + Usability Pass
- **Per-field inline validation:** TransactionForm shows red border + error under each invalid field (Date, Payee, Amount, Account). ClientForm shows error under Business Name. Errors clear per-field as fixed.
- **Amount normalization:** `Math.abs(amount)` applied on save; amounts always stored positive; sign shown via type field.
- **Stronger backup import validation:** `getBackupValidationError` checks object shape for every client, transaction, and category item AND cross-entity relationships: `selectedClientId` must match a client, every transaction `clientId` must match a client, every non-null `categoryId` must match a category. Specific human-readable error shown in import banner.
- **Settings CSV client selector:** `resolvedCsvId` derived from live client list — stays valid after import, reset, or deletion.
- **Sortable transaction table:** All 7 data columns clickable (Date, Type, Payee, Category, Account, Amount, Status) with ↑/↓/↕ sort indicators.
- **Reports date range:** Month / Date Range toggle; custom start + end date inputs feed the same P&L calculations.
- **Print-friendly reports:** Sidebar and TopBar hidden via `@media print`; content flows to page; tables stack single-column; Print Report button calls `window.print()`; print-only header with client + period.
- **Improved empty states:** Dashboard no-clients links to /clients. Categories panel says "Add one above." Reports shows no-data nudge with link to Transactions.
- **Duplicate transaction warning:** On Add mode, if a transaction with the same client/date/type/payee/amount/account exists, a warning replaces the submit button row. User can "Add Anyway" or "Go Back" to edit.
- **Category cleanup tools:** Each category shows its transaction usage count inline. Deactivating a category with active transaction usage prompts an inline confirmation ("Used by N transactions. Deactivate? Yes / Cancel"). Categories with 0 usage toggle immediately.
- **Client archive behavior:** Inactive clients are removed from the default top-bar client switcher. When the selected client is marked inactive via the edit form, `updateClient` in AppContext automatically moves the selection to the first active client (if one exists). Only if no active clients remain does the inactive client stay selected. All inactive clients remain fully visible on the Clients page.
- **Stale UI copy corrected:** Sidebar footer now reads "LedgerDesk — Local MVP" (was "Phase 1 — Local Storage"). Settings version note now reads "LedgerDesk — Local MVP" (was "LedgerDesk — Phase 1").

## Phase 2 Completion Checklist (from docs/02_PHASES.md)

- [x] Forms prevent invalid required fields
- [x] Amount values are normalized and displayed consistently
- [x] Delete actions require confirmation
- [x] Bad backup imports fail safely with a readable error
- [x] Reports can be printed cleanly
- [x] Archived clients do not clutter the default client switcher; marking selected client inactive auto-selects first active client
- [x] The app still works fully offline in browser storage

## In Progress

Ready for bookkeeper testing on localhost.

## Not Started

- Phase 3+ (Supabase, auth, billing — parked until workflow is confirmed useful by the first real user)

## Blockers

None.

## Verification Results (2026-06-04, Phase 2 correction)

| Check | Result |
|---|---|
| `npm run lint` | Passed — 0 errors |
| `npm run build` | Passed — all 6 routes compiled, TypeScript clean |

## User Localhost Test Checklist

Run `npm run dev`, then test at http://localhost:3000:

1. **Duplicate warning:** Add Transaction — fill in exact same date/payee/amount/account as an existing transaction. Click Add. Confirm "Possible duplicate transaction" warning appears with "Add Anyway" and "Go Back" buttons.
2. **Field validation:** Leave Payee blank, click Add. Confirm red border + error under Payee only. Fix payee, confirm error clears immediately.
3. **Categories usage count:** Go to Categories. Confirm each category shows a transaction count like "12 txns" next to the name.
4. **Category deactivate warning:** Click "Active" on a category with transactions. Confirm an inline "Used by N transactions. Deactivate? Yes / Cancel" prompt appears before toggling.
5. **Client switcher — inactive clients hidden:** Go to Clients and mark Rivera Plumbing LLC as Inactive while Maple Street Bakery is selected. Confirm Rivera Plumbing is NOT in the top-bar client switcher.
6. **Auto-select on archive:** Switch to Rivera Plumbing LLC in the client switcher. Go to Clients, click Edit on Rivera Plumbing, change status to Inactive, save. Confirm the top-bar switcher automatically moves to Maple Street Bakery (the first active client) — not Rivera Plumbing.
7. **Import error specifics:** In Settings, import a JSON file where you have manually removed a `clientId` field from a transaction. Confirm the error message names the specific transaction position and field.
8. **Import relationship check:** In Settings, import a JSON file where a transaction references a `clientId` that doesn't exist in the clients list. Confirm a specific relationship error message appears.
9. **Sidebar copy:** Confirm the sidebar footer says "LedgerDesk — Local MVP" (not "Phase 1").
10. **Print reports:** Go to Reports, click Print Report. Confirm sidebar and TopBar are absent from the print view.

## Parking Lot

Not building in Phase 1/2:

- Supabase database
- user login/auth
- Stripe subscription billing
- multiple user accounts
- bank feeds / CSV bank import
- receipt uploads
- AI categorization
- reconciliation workflow
- invoice sending
- payroll
- mobile version
- public marketing site

## Next GPT Action

Phase 2 is fully complete. All checklist items satisfied.

Recommended next actions:

1. Ask the bookkeeper to run through the localhost test checklist above on real or near-real client data.
2. If the bookkeeper confirms the workflow is useful and Phase 2 is stable, advance to Phase 3 (Supabase migration) or a Phase 2.5 workflow pass (multi-month trends, CSV bank import template, uncategorized transaction queue).
3. Do not start Phase 3 until the bookkeeper confirms the core workflow makes sense.
