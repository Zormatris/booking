# 01 — Product Source of Truth

## Product Name

LedgerDesk

## One-Sentence Description

LedgerDesk is a simple desktop-first bookkeeping web app for small bookkeepers who manage multiple local clients and want a faster, cleaner alternative to messy Excel workbooks.

## Core Promise

The bookkeeper can open one web app, choose a client, enter income and expenses, organize transactions by category/account, and view a basic profit-and-loss summary without fighting QuickBooks or rebuilding the same Excel sheets repeatedly.

This is not trying to be full QuickBooks in V1. The promise is:

- one place for every client
- fast transaction entry
- clean monthly totals
- simple profit/loss reporting
- easy export/backup
- a UI that feels easier than QuickBooks and safer than scattered spreadsheets

## Target User

The first target user is one experienced bookkeeper managing roughly 10–20 small business clients. They are comfortable with bookkeeping concepts, but they do not want software that feels bloated, slow, expensive, or overloaded with features.

Secondary future users are local small business bookkeepers, family-run businesses, and independent operators who need basic books organized but do not need enterprise accounting software.

## User Problem

The user is frustrated with QuickBooks and is trying to rebuild their workflow in Excel. Excel gives control, but it becomes fragile fast: formulas break, client files split apart, reporting is inconsistent, backups are manual, and every client workbook can drift into a different structure.

The real problem is not “make accounting software.” The problem is: create a simple controlled workspace where the bookkeeper can do the repetitive daily bookkeeping work without software friction.

## App Type

Desktop-first bookkeeping SaaS / internal business tool.

## Primary Platform

Desktop-first web app.

V1 should be designed around laptop and desktop screens first. Mobile is not a priority and should not drive layout decisions.

## Visual Direction

LedgerDesk should feel like a clean business dashboard: calm, serious, readable, and efficient. The UI should not look like a trendy consumer app or a finance bro dashboard.

Use a light professional interface with clear tables, muted borders, left navigation, top client selector, and dense-but-readable information layout. The user should feel like they are working in a clean office tool, not a social app.

## Product Positioning

LedgerDesk is not “QuickBooks but copied.” It is a lightweight bookkeeping workspace built around the exact workflows of a real bookkeeper.

Position it as:

- simpler than QuickBooks
- safer than Excel
- faster for basic bookkeeping
- custom-fit for bookkeepers with multiple small clients

Do not copy QuickBooks branding, UI, wording, icons, or page structure directly.

## MVP User Flow

The first version should support this basic flow:

1. User opens the web app.
2. User lands on a desktop dashboard.
3. User selects a client from a client switcher.
4. User sees that client's current month summary:
   - income
   - expenses
   - net profit
   - uncategorized transactions
   - recent transactions
5. User opens the Transactions page.
6. User adds a new transaction manually.
7. User assigns:
   - date
   - client
   - type: income or expense
   - payee/vendor
   - category
   - account
   - amount
   - memo
   - cleared status
8. User can edit or delete a transaction.
9. User opens Reports.
10. User views a simple profit-and-loss report by month.
11. User exports the client's data as JSON or CSV for backup.

## Core Pages

### 1. Dashboard

Purpose: Give a fast overview of the selected client.

Must include:

- top bar with app name, selected client, and current month
- summary cards:
  - Monthly Income
  - Monthly Expenses
  - Net Profit
  - Uncategorized
- recent transactions table
- quick action button: Add Transaction
- small client notes panel

### 2. Clients

Purpose: Manage bookkeeping clients.

Must include:

- client list
- add client form
- edit client details
- active/inactive status
- basic fields:
  - business name
  - contact name
  - email
  - phone
  - business type
  - notes

### 3. Transactions

Purpose: Main daily bookkeeping workspace.

Must include:

- selected client context
- transaction table
- filter by month
- filter by type
- search by payee/vendor/memo
- add transaction form
- edit transaction form
- delete transaction action
- cleared/uncleared toggle
- uncategorized warning state

### 4. Categories

Purpose: Manage the chart of accounts/category list.

Must include:

- income categories
- expense categories
- simple category creation
- category type: income or expense
- ability to mark category active/inactive

This does not need to be a full double-entry chart of accounts in V1.

### 5. Reports

Purpose: Show basic usable bookkeeping summaries.

Must include:

- Profit & Loss by month for selected client
- income total by category
- expense total by category
- net profit
- printable/export-friendly layout

### 6. Settings / Backup

Purpose: Keep the app safe while it is local-first.

Must include:

- export all data as JSON
- import JSON backup
- export selected client transactions as CSV
- reset demo data button only if clearly marked
- app version note

## V1 Data Model

Use a simple local-first data model for the first prototype.

### Client

```ts
type Client = {
  id: string
  businessName: string
  contactName?: string
  email?: string
  phone?: string
  businessType?: string
  status: "active" | "inactive"
  notes?: string
  createdAt: string
  updatedAt: string
}
```

### Transaction

```ts
type Transaction = {
  id: string
  clientId: string
  date: string
  type: "income" | "expense"
  payee: string
  categoryId: string | null
  account: string
  amount: number
  memo?: string
  cleared: boolean
  createdAt: string
  updatedAt: string
}
```

### Category

```ts
type Category = {
  id: string
  name: string
  type: "income" | "expense"
  active: boolean
}
```

### AppData

```ts
type AppData = {
  clients: Client[]
  transactions: Transaction[]
  categories: Category[]
  selectedClientId: string | null
}
```

## Storage Strategy

Phase 1 should use browser `localStorage`.

Reason: the first build needs to be fast, demoable, and usable tonight without database setup, account setup, auth setup, or deployment blockers.

Future phases can move the same data model into Supabase.

## V1 Includes

LedgerDesk V1 includes:

- desktop-first layout
- left sidebar navigation
- top client selector
- localStorage persistence
- seeded demo clients
- seeded demo categories
- add/edit/delete clients
- add/edit/delete transactions
- basic filtering/search on transactions
- simple category management
- dashboard summary cards
- basic P&L report
- JSON backup/export
- JSON import
- CSV export for transactions

## V1 Excludes

Do not build these in V1:

- bank account connections
- automatic bank feeds
- payroll
- tax filing
- invoice sending
- payment processing
- Stripe billing
- multi-user permissions
- role-based access
- OCR receipt scanning
- receipt attachment storage
- double-entry ledger enforcement
- full reconciliation workflow
- audit logs
- AI categorization
- QuickBooks import
- mobile-first layout
- public marketing site
- customer billing
- accountant compliance guarantees

## Important Accounting Boundary

This app is a bookkeeping workflow tool. It should not claim to replace a CPA, tax professional, or legally compliant accounting system. The UI can support bookkeeping organization, but it must not promise tax filing, payroll compliance, or official accounting certification.

## Success Criteria For The First Demo

The first demo is successful if the bookkeeper can:

- open the app on desktop
- select a client
- add income and expense transactions
- categorize those transactions
- see totals update immediately
- view a simple monthly P&L
- export a backup file
- understand the layout without training

## Product Tone

Use plain business language.

Good wording:

- Clients
- Transactions
- Income
- Expenses
- Reports
- Categories
- Export
- Backup
- Profit & Loss

Avoid startup fluff and overcomplicated accounting language in the UI unless it is needed.
