'use client'

import { useState } from 'react'
import { AppShell } from '@/components/AppShell'
import { MetricCard } from '@/components/MetricCard'
import { TransactionForm } from '@/components/TransactionForm'
import { useApp } from '@/contexts/AppContext'
import { getTotals, filterByMonth, filterByClient } from '@/lib/calculations'
import { formatMoney, formatDate } from '@/lib/formatters'
import type { Client } from '@/lib/types'

export default function DashboardPage() {
  const { data, selectedClient } = useApp()
  const [showForm, setShowForm] = useState(false)

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1

  const clientTxns = selectedClient
    ? filterByClient(data.transactions, selectedClient.id)
    : []
  const monthTxns = filterByMonth(clientTxns, year, month)
  const totals = getTotals(monthTxns)

  const recent = [...clientTxns]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10)

  const monthLabel = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const addButton = (
    <button
      onClick={() => setShowForm(true)}
      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
    >
      Add Transaction
    </button>
  )

  return (
    <AppShell title="Dashboard" action={addButton}>
      {!selectedClient ? (
        <div className="flex h-48 items-center justify-center rounded-xl border border-slate-200 bg-white">
          <p className="text-sm text-slate-500">No clients yet. Add a client to get started.</p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-slate-500">{selectedClient.businessName} — {monthLabel}</p>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <MetricCard
              label="Monthly Income"
              value={formatMoney(totals.income)}
              valueColor="text-green-600"
            />
            <MetricCard
              label="Monthly Expenses"
              value={formatMoney(totals.expenses)}
              valueColor="text-red-600"
            />
            <MetricCard
              label="Net Profit"
              value={formatMoney(totals.net)}
              valueColor={totals.net >= 0 ? 'text-green-600' : 'text-red-600'}
            />
            <MetricCard
              label="Uncategorized"
              value={String(totals.uncategorized)}
              sub={totals.uncategorized > 0 ? 'Need review' : 'All categorized'}
              valueColor={totals.uncategorized > 0 ? 'text-amber-600' : 'text-slate-900'}
            />
          </div>

          <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 300px' }}>
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <h2 className="text-sm font-semibold text-slate-900">Recent Transactions</h2>
                <span className="text-xs text-slate-400">{clientTxns.length} total this client</span>
              </div>
              {recent.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <p className="text-sm text-slate-500">No transactions yet.</p>
                  <p className="mt-1 text-xs text-slate-400">Add your first income or expense above.</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Date</th>
                      <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Payee</th>
                      <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Category</th>
                      <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map(t => {
                      const cat = data.categories.find(c => c.id === t.categoryId)
                      return (
                        <tr key={t.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                          <td className="px-5 py-3 text-sm text-slate-600">{formatDate(t.date)}</td>
                          <td className="px-5 py-3 text-sm text-slate-800">{t.payee}</td>
                          <td className="px-5 py-3 text-sm text-slate-500">
                            {cat ? cat.name : (
                              <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs text-amber-700">Uncategorized</span>
                            )}
                          </td>
                          <td className={`px-5 py-3 text-right text-sm font-medium tabular-nums ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                            {t.type === 'income' ? '+' : '-'}{formatMoney(t.amount)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* key forces remount on client switch, resetting the edit state */}
            <ClientDetailsPanel key={selectedClient.id} client={selectedClient} />
          </div>
        </>
      )}

      {showForm && (
        <TransactionForm
          defaultClientId={selectedClient?.id}
          onClose={() => setShowForm(false)}
        />
      )}
    </AppShell>
  )
}

function ClientDetailsPanel({ client }: { client: Client }) {
  const { updateClient } = useApp()
  const [editing, setEditing] = useState(false)
  const [notes, setNotes] = useState(client.notes ?? '')

  function saveNotes() {
    updateClient(client.id, { notes })
    setEditing(false)
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">Client Notes</h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-blue-600 hover:underline"
          >
            Edit
          </button>
        )}
      </div>
      <div className="px-5 py-4">
        {editing ? (
          <>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={6}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
            />
            <div className="mt-2 flex gap-2">
              <button
                onClick={saveNotes}
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => { setEditing(false); setNotes(client.notes ?? '') }}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">
            {client.notes || <span className="text-slate-400 italic">No notes yet. Click Edit to add.</span>}
          </p>
        )}
      </div>

      <div className="border-t border-slate-100 px-5 py-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-2">Client Info</p>
        <dl className="space-y-1.5">
          {client.contactName && (
            <div className="flex justify-between">
              <dt className="text-xs text-slate-400">Contact</dt>
              <dd className="text-xs text-slate-700">{client.contactName}</dd>
            </div>
          )}
          {client.email && (
            <div className="flex justify-between">
              <dt className="text-xs text-slate-400">Email</dt>
              <dd className="text-xs text-slate-700">{client.email}</dd>
            </div>
          )}
          {client.phone && (
            <div className="flex justify-between">
              <dt className="text-xs text-slate-400">Phone</dt>
              <dd className="text-xs text-slate-700">{client.phone}</dd>
            </div>
          )}
          {client.businessType && (
            <div className="flex justify-between">
              <dt className="text-xs text-slate-400">Type</dt>
              <dd className="text-xs text-slate-700">{client.businessType}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  )
}
