# 02 — Master Phase Plan

## Purpose

This project is a **mock desktop bookkeeping web app** for local demo/testing only.

The goal is to build a simple QuickBooks-style prototype that can run locally with:

```bash
npm install
npm run dev
```

This app is not a SaaS product yet. It should not include login, Stripe, Supabase, databases, subscriptions, cloud sync, or third-party services.

The first version should help test whether the bookkeeping workflow makes sense for one real bookkeeper.

---

# Phase 1 — Local Desktop Mock App

## Goal

Build a fully usable desktop-first bookkeeping mock app that runs in the browser and saves demo data with `localStorage`.

This should feel like a real bookkeeping dashboard, but it is still only a local demo.

---

## Must Include

* Desktop-first layout
* Left sidebar navigation
* Top bar with app name and selected client switcher
* Seeded demo data for at least 2 clients
* Seeded bookkeeping categories
* LocalStorage persistence
* Clean dashboard UI
* Simple bookkeeping workflow

---

## Pages

### Dashboard

Must show:

* Total income
* Total expenses
* Net profit
* Uncategorized transactions
* Recent transactions table

### Clients

Must allow:

* View clients
* Add client
* Edit client
* Delete or archive client
* Switch selected client

### Transactions

Must allow:

* View transactions
* Add transaction
* Edit transaction
* Delete transaction
* Search transactions
* Filter by month
* Filter by income/expense
* Filter by category
* Mark transaction as cleared

### Categories

Must allow:

* View income categories
* View expense categories
* Add category
* Edit category
* Disable/archive category

### Reports

Must show:

* Basic monthly Profit & Loss
* Income by category
* Expenses by category
* Net profit

### Settings / Backup

Must allow:

* Export all app data as JSON
* Import app data from JSON
* Export selected client transactions as CSV
* Reset demo data

---

## Data Rules

Use browser `localStorage` only.

No backend.
No database.
No Supabase.
No API keys.
No auth.
No Stripe.
No payment system.
No cloud sync.

Data should remain after refreshing the browser.

---

## Design Rules

* Desktop-first, not mobile-first
* Must look clean at 1280px+ width
* Simple business/dashboard style
* Clear tables
* Clear forms
* No marketing pages
* No landing page
* No public SaaS UI
* No pricing page
* No account page
* No login page

---

## Completion Checklist

* [ ] App runs with `npm install` and `npm run dev`
* [ ] App has no runtime errors
* [ ] App is desktop-first
* [ ] User can switch between demo clients
* [ ] User can add/edit/delete clients
* [ ] User can add/edit/delete transactions
* [ ] Dashboard totals update correctly
* [ ] Reports update correctly
* [ ] Data persists after refresh
* [ ] JSON export works
* [ ] JSON import works
* [ ] CSV export works
* [ ] No auth was added
* [ ] No Stripe was added
* [ ] No Supabase was added
* [ ] No database was added
* [ ] No third-party service setup is required

---

## Hard Stop

Do not build anything beyond this local mock app unless the user explicitly asks later.

This project should stay simple enough to demo quickly.
