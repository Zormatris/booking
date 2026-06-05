# 04 — Design System

## Design Goal

LedgerDesk should feel like a serious desktop bookkeeping tool: fast, readable, boring in the right way, and easy to understand at a glance.

This is not a mobile app. This is not a trendy creator dashboard. This is not a dark neon SaaS landing page.

Build for a bookkeeper sitting at a desk doing real work.

---

## Color System

Use this exact palette unless the user explicitly changes it.

| Role | Name | Hex Value | When to Use |
|---|---|---:|---|
| Base | App Background | `#F6F7F9` | Full page background |
| Surface | Panel White | `#FFFFFF` | Cards, tables, forms, main content panels |
| Surface Alt | Soft Panel | `#F1F5F9` | Sidebar active states, subtle grouped sections |
| Primary Text | Ink | `#111827` | Headings, main labels, table text |
| Secondary Text | Slate | `#64748B` | Helper text, descriptions, metadata |
| Muted Text | Light Slate | `#94A3B8` | Empty state copy, table secondary values |
| Border | Line | `#E2E8F0` | Panel borders, table dividers, input borders |
| Accent | Ledger Blue | `#2563EB` | Primary buttons, active nav, focus states |
| Accent Soft | Soft Blue | `#DBEAFE` | Active nav background, selected states |
| Success | Profit Green | `#16A34A` | Positive net profit, saved states |
| Warning | Review Amber | `#D97706` | Uncategorized/review-needed states |
| Destructive | Loss Red | `#DC2626` | Delete actions, negative values, errors |

**Rule:** Do not use random Tailwind colors outside this palette unless required by browser defaults.

---

## Typography

Use system fonts for speed and reliability.

Recommended CSS font stack:

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

| Role | Tailwind Classes | Use |
|---|---|---|
| App Title | `text-xl font-semibold tracking-tight text-slate-950` | LedgerDesk in sidebar/top |
| Page Title | `text-2xl font-semibold tracking-tight text-slate-950` | Main page heading |
| Section Heading | `text-base font-semibold text-slate-950` | Card/table headings |
| Body Text | `text-sm leading-relaxed text-slate-700` | General content |
| Muted Text | `text-sm text-slate-500` | Supporting descriptions |
| Caption | `text-xs text-slate-400` | timestamps, small labels |
| Label | `text-xs font-medium uppercase tracking-wide text-slate-500` | form labels and metadata |
| Table Text | `text-sm text-slate-800` | table cells |
| Number Text | `text-sm font-medium tabular-nums text-slate-950` | money and counts |

Money values should use `tabular-nums`.

---

## Desktop Layout

### App Frame

Use a two-column desktop app shell.

- Left sidebar width: `260px`
- Main content: fills remaining width
- Minimum practical desktop width: `1280px`
- Content max width: none for data-heavy pages; let tables breathe
- Page padding: `24px`
- Gap between major panels: `20px`

### Sidebar

Sidebar should include:

- LedgerDesk logo/text at top
- selected client summary if helpful
- nav links:
  - Dashboard
  - Clients
  - Transactions
  - Categories
  - Reports
  - Settings / Backup

Sidebar style:

- white background
- right border
- fixed height
- nav links stacked vertically
- active nav uses blue text and soft blue background

### Top Bar

Top bar should include:

- page title
- selected client dropdown
- current month selector where relevant
- primary action button on the right

Height target: `64px` to `72px`.

### Main Content

Use clear business-app structure:

- title row
- action row where needed
- summary cards
- main table/panel
- secondary side panels only if useful

Avoid huge hero sections. This is not a landing page.

---

## Component Rules

### Cards

Use cards for summary metrics and report sections.

Classes pattern:

```tsx
rounded-xl border border-slate-200 bg-white p-5 shadow-sm
```

Card headings:

- small label above
- large number below
- optional muted subtext

### Tables

Tables are the core UI. Make them clean and dense.

Table rules:

- white panel background
- border around table wrapper
- header row with soft background
- sticky header is optional, not required
- row height around `48px`
- amount column right-aligned
- actions column right-aligned
- empty states inside table panel

Required transaction columns:

- Date
- Type
- Payee / Vendor
- Category
- Account
- Amount
- Status
- Actions

### Forms

Use simple forms, not complex wizards.

Form rules:

- labels above fields
- inputs full width inside their column
- two-column grid for desktop forms where useful
- primary submit button bottom-right
- cancel button beside submit
- validation copy under fields when needed

Required transaction form fields:

- Date
- Type
- Payee / Vendor
- Category
- Account
- Amount
- Memo
- Cleared

### Buttons

Primary button:

```tsx
rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700
```

Secondary button:

```tsx
rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50
```

Destructive button:

```tsx
rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50
```

### Inputs

Input pattern:

```tsx
rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100
```

### Badges

Use badges for status.

- Income: green subtle badge
- Expense: red subtle badge
- Cleared: green subtle badge
- Uncleared: amber subtle badge
- Uncategorized: amber subtle badge
- Inactive client/category: gray subtle badge

---

## Money Formatting

All money should display like:

- `$1,250.00`
- `-$430.20`

Use USD for V1.

Negative net profit should use red text. Positive net profit should use green text.

Do not use crypto, cents-only formatting, or abbreviated values like `$1.2k` in tables.

---

## Page-Specific Design

### Dashboard

Dashboard layout:

1. Header row:
   - "Dashboard"
   - selected client dropdown
   - "Add Transaction" button
2. Four metric cards in one row:
   - Income
   - Expenses
   - Net Profit
   - Uncategorized
3. Main two-column section:
   - left wide panel: recent transactions
   - right narrow panel: client notes / review reminders

### Clients

Clients page layout:

- top header with Add Client button
- table/list of clients
- side panel or modal for add/edit form

Keep the page practical. Do not overdesign client cards.

### Transactions

Transactions page layout:

- header with Add Transaction button
- filter bar:
  - month
  - type
  - search
- main transaction table
- add/edit form in a modal, drawer, or right panel

Do not use a tiny mobile modal. This is desktop-first.

### Categories

Categories page layout:

- two side-by-side panels:
  - Income Categories
  - Expense Categories
- add category form at top or bottom of each panel

### Reports

Reports page layout:

- header with month selector and export/print button
- top report summary cards
- Profit & Loss table
- income by category table
- expenses by category table

### Settings / Backup

Settings page layout:

- Export all data as JSON
- Import JSON backup
- Export selected client CSV
- Reset demo data section must look dangerous and be clearly separated

---

## Interaction Rules

- Every destructive action needs confirmation.
- Every save should update UI immediately.
- Empty states should explain what to do next.
- Do not hide primary actions in menus.
- Do not use animations beyond tiny hover/focus states.
- Do not add loading skeletons unless data is actually async.
- Do not add mobile hamburger navigation in Phase 1.

---

## Accessibility Rules

- Buttons must be actual `<button>` elements.
- Inputs must have labels.
- Interactive controls must have focus states.
- Tables should use semantic table markup.
- Color should not be the only indicator of status; use text labels too.

---

## Copy Style

Use calm, practical UI copy.

Examples:

- "Add transaction"
- "Export backup"
- "Import backup"
- "No transactions yet"
- "This client has no activity for the selected month."
- "Uncategorized transactions need review."

Avoid:

- "Crush your books"
- "AI-powered financial command center"
- "Scale your accounting empire"
- "Revolutionary QuickBooks killer"

Keep it normal.
