# 02 — Master Phase Plan

## Purpose

This file defines the build path for LedgerDesk. Claude Code must build the app in controlled phases and must not jump ahead.

The first priority is a usable two-hour desktop prototype for one real bookkeeper. Later phases can turn it into a stronger internal tool or a sellable SaaS.

---

# Phase 1 — Desktop Local MVP

**Goal:** Build a fully demoable desktop-first bookkeeping app that runs locally in the browser using `localStorage`.

**Includes:**

- Create or adapt the app shell for a desktop-first web app
- Left sidebar navigation
- Top bar with app name and selected client switcher
- Seeded local data for at least 2 demo clients
- Seeded default bookkeeping categories
- Dashboard page with:
  - income card
  - expense card
  - net profit card
  - uncategorized card
  - recent transactions table
- Clients page with:
  - client list
  - add client
  - edit client
  - active/inactive status
- Transactions page with:
  - transaction table
  - add transaction form
  - edit transaction form
  - delete transaction
  - month filter
  - type filter
  - search field
  - cleared toggle
- Categories page with:
  - income categories
  - expense categories
  - add category
  - active/inactive toggle
- Reports page with:
  - basic monthly Profit & Loss
  - income by category
  - expenses by category
  - net profit
- Settings / Backup page with:
  - export all app data as JSON
  - import JSON backup
  - export selected client transactions as CSV
- All data persists in browser `localStorage`
- Clean desktop-first UI matching `docs/04_DESIGN.md`

**Excludes:**

- Login/auth
- Database/Supabase
- Stripe
- bank feeds
- payroll
- invoice sending
- receipt uploads
- AI categorization
- multi-user permissions
- mobile-first optimization
- public marketing pages

**Completion Checklist:**

- [ ] App runs locally without runtime errors
- [ ] Desktop layout is usable at 1280px+ width
- [ ] User can switch between clients
- [ ] User can create, edit, and delete clients
- [ ] User can create, edit, and delete transactions
- [ ] Dashboard totals update after transaction changes
- [ ] Reports update after transaction changes
- [ ] Data remains after browser refresh
- [ ] User can export JSON backup
- [ ] User can import JSON backup
- [ ] User can export selected client CSV
- [ ] No V1 excluded features were added

**Hard Stop:** Do not add auth, Supabase, Stripe, bank feeds, or any SaaS billing features in Phase 1.

---

# Phase 2 — Data Safety + Usability Pass

**Goal:** Make the local MVP safer and easier for a real bookkeeper to test with real-ish client data.

**Includes:**

- Better empty states
- Input validation
- Safer delete confirmations
- Clear import/export warnings
- Duplicate transaction prevention warning
- More useful transaction filters
- Sortable transaction table columns
- Date range filter for reports
- Category cleanup tools
- Client archive behavior
- Print-friendly report layout
- Better error handling around malformed imported JSON
- App version label

**Excludes:**

- Authentication
- Database
- Bank feeds
- AI categorization
- Paid accounts
- Multi-user collaboration

**Completion Checklist:**

- [ ] Forms prevent invalid required fields
- [ ] Amount values are normalized and displayed consistently
- [ ] Delete actions require confirmation
- [ ] Bad backup imports fail safely with a readable error
- [ ] Reports can be printed cleanly
- [ ] Archived clients do not clutter the default client switcher
- [ ] The app still works fully offline in browser storage

**Hard Stop:** Do not convert to Supabase until the local MVP has been tested and the user confirms the workflow makes sense.

---

# Phase 3 — Supabase Persistence

**Goal:** Move the app from browser-only storage to real cloud persistence while preserving the same user experience.

**Includes:**

- Supabase project setup instructions
- Database schema for:
  - clients
  - transactions
  - categories
  - app settings
- Migration path from local JSON export into Supabase
- Server/database data layer
- Loading states
- Save states
- Error states
- Basic backup export still available

**Excludes:**

- Stripe billing
- multi-user permissions
- public onboarding
- bank feeds
- payroll
- receipt storage

**Completion Checklist:**

- [ ] App reads clients from Supabase
- [ ] App writes clients to Supabase
- [ ] App reads transactions from Supabase
- [ ] App writes transactions to Supabase
- [ ] App reads categories from Supabase
- [ ] LocalStorage is no longer the source of truth
- [ ] User can import old local JSON data
- [ ] User can still export data for backup

**Hard Stop:** Do not add paid billing until cloud data is stable.

---

# Phase 4 — Auth + Single Business Account

**Goal:** Add secure login for the main bookkeeper account.

**Includes:**

- Supabase Auth
- Login page
- Logout
- Protected dashboard routes
- Single-owner data access
- Basic account settings page

**Excludes:**

- Multiple team members
- client portals
- Stripe subscriptions
- public signup flow
- role-based permissions

**Completion Checklist:**

- [ ] Unauthenticated users cannot access app data
- [ ] Authenticated user can access their data
- [ ] Logout works
- [ ] Refreshing protected routes keeps the session
- [ ] Account settings show the logged-in email

**Hard Stop:** Do not open signup to outside users until billing, access rules, and support expectations are decided.

---

# Phase 5 — Bookkeeper Workflow Upgrade

**Goal:** Add the features that make LedgerDesk genuinely useful for a working bookkeeper managing many clients.

**Includes:**

- Client task notes
- Monthly close checklist per client
- Missing category alerts
- Uncategorized transaction queue
- Client-level report notes
- Saved report periods
- Better client overview dashboard
- Import CSV transactions from a bank export template
- Basic transaction matching warnings

**Excludes:**

- Direct bank API integrations
- automatic reconciliation
- payroll
- tax filing
- receipt OCR

**Completion Checklist:**

- [ ] Bookkeeper can track which clients need work
- [ ] Uncategorized items are easy to find
- [ ] Monthly client close checklist works
- [ ] CSV import works for a documented template
- [ ] Imported transactions can be reviewed before saving

**Hard Stop:** Do not integrate live bank feeds before CSV import and review are stable.

---

# Phase 6 — Private Beta SaaS

**Goal:** Prepare LedgerDesk for a small paid private beta with local bookkeepers or small businesses.

**Includes:**

- Stripe subscription setup
- Pricing gate
- Customer account states
- Basic onboarding
- Terms/privacy placeholder pages
- Feedback form
- Admin-only support notes
- Production deployment checklist

**Excludes:**

- large-scale public launch
- enterprise features
- automated tax advice
- payroll
- direct bank feeds unless explicitly approved

**Completion Checklist:**

- [ ] Stripe subscription flow works in test mode
- [ ] Paid/unpaid access states work
- [ ] User can subscribe and access the app
- [ ] User can lose access when unpaid
- [ ] Terms/privacy placeholders exist
- [ ] Private beta feedback can be collected

**Hard Stop:** Do not publicly market the product until the first real bookkeeper has tested it and confirmed the core workflow is useful.

---

# Phase 7 — Real Accounting Expansion

**Goal:** Carefully expand LedgerDesk into a more serious accounting tool only after the simple workflow proves valuable.

**Includes, only if approved later:**

- more formal chart of accounts
- reconciliation workflow
- audit trail
- receipt attachments
- accountant review export
- improved CSV import templates
- possible bank feed research
- possible AI categorization after manual categorization is stable

**Excludes by default:**

- tax filing guarantees
- payroll compliance
- legal/accounting claims
- enterprise accounting promises

**Completion Checklist:**

- [ ] Every new accounting feature has a clear user-tested need
- [ ] App language avoids legal/tax guarantees
- [ ] Data export remains available
- [ ] Core simple workflow is not buried under complexity

**Hard Stop:** Do not turn LedgerDesk into bloated QuickBooks. The product wins by staying simpler.
