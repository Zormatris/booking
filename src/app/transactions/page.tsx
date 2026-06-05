'use client'

import { useState, useMemo } from 'react'
import { AppShell } from '@/components/AppShell'
import { TransactionForm } from '@/components/TransactionForm'
import { useApp } from '@/contexts/AppContext'
import { filterByClient, filterByMonth } from '@/lib/calculations'
import { formatMoney, formatDate, toMonthValue, fromMonthValue } from '@/lib/formatters'
import type { Transaction } from '@/lib/types'

export default function TransactionsPage() {
  const { data, selectedClient, deleteTransaction } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [editingTxn, setEditingTxn] = useState<Transaction | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const now = new Date()
  const [monthValue, setMonthValue] = useState(toMonthValue(now.getFullYear(), now.getMonth() + 1))
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all')
  const [search, setSearch] = useState('')

  const { year, month } = fromMonthValue(monthValue)

  const filtered = useMemo(() => {
    let txns = selectedClient
      ? filterByClient(data.transactions, selectedClient.id)
      : data.transactions

    txns = filterByMonth(txns, year, month)

    if (typeFilter !== 'all') txns = txns.filter(t => t.type === typeFilter)

    if (search.trim()) {
      const q = search.toLowerCase()
      txns = txns.filter(t =>
        t.payee.toLowerCase().includes(q) ||
        (t.memo ?? '').toLowerCase().includes(q) ||
        t.account.toLowerCase().includes(q)
      )
    }

    return [...txns].sort((a, b) => b.date.localeCompare(a.date))
  }, [data.transactions, selectedClient, year, month, typeFilter, search])

  function handleEdit(txn: Transaction) {
    setEditingTxn(txn)
    setShowForm(true)
  }

  function handleCloseForm() {
    setShowForm(false)
    setEditingTxn(null)
  }

  const totalIncome = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpenses = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

  const addButton = (
    <button
      onClick={() => setShowForm(true)}
      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
    >
      Add Transaction
    </button>
  )

  return (
    <AppShell title="Transactions" action={addButton}>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Month</label>
          <input
            type="month"
            value={monthValue}
            onChange={e => setMonthValue(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Type</label>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value as typeof typeFilter)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search payee, memo, account..."
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-64"
        />
        <span className="ml-auto text-xs text-slate-400">{filtered.length} transactions</span>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {filtered.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-slate-500">No transactions found.</p>
            <p className="mt-1 text-xs text-slate-400">Try changing the month or filters, or add a transaction.</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Payee / Vendor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Account</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => {
                  const cat = data.categories.find(c => c.id === t.categoryId)
                  return (
                    <tr key={t.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">{formatDate(t.date)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                          t.type === 'income' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {t.type === 'income' ? 'Income' : 'Expense'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-slate-800">{t.payee}</p>
                        {t.memo && <p className="text-xs text-slate-400">{t.memo}</p>}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {cat ? cat.name : (
                          <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs text-amber-700">Uncategorized</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{t.account}</td>
                      <td className={`px-4 py-3 text-right text-sm font-medium tabular-nums whitespace-nowrap ${
                        t.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {t.type === 'income' ? '+' : '-'}{formatMoney(t.amount)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                          t.cleared ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {t.cleared ? 'Cleared' : 'Uncleared'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {deleteConfirm === t.id ? (
                          <span className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => { deleteTransaction(t.id); setDeleteConfirm(null) }}
                              className="rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                            >
                              Cancel
                            </button>
                          </span>
                        ) : (
                          <span className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleEdit(t)}
                              className="rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(t.id)}
                              className="rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-3">
              <span className="text-xs text-slate-500">{filtered.length} transactions shown</span>
              <div className="flex gap-6 text-xs tabular-nums">
                <span className="text-green-600">Income: {formatMoney(totalIncome)}</span>
                <span className="text-red-600">Expenses: {formatMoney(totalExpenses)}</span>
                <span className={`font-medium ${totalIncome - totalExpenses >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  Net: {formatMoney(totalIncome - totalExpenses)}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {showForm && (
        <TransactionForm
          transaction={editingTxn ?? undefined}
          defaultClientId={selectedClient?.id}
          onClose={handleCloseForm}
        />
      )}
    </AppShell>
  )
}
