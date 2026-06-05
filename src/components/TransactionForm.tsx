'use client'

import { useState } from 'react'
import type { Transaction } from '@/lib/types'
import { useApp } from '@/contexts/AppContext'

interface TransactionFormProps {
  transaction?: Transaction
  defaultClientId?: string
  onClose: () => void
}

const COMMON_ACCOUNTS = ['Checking', 'Savings', 'Visa Business', 'Mastercard Business', 'Cash', 'Other']

function today(): string {
  return new Date().toISOString().split('T')[0]
}

export function TransactionForm({ transaction, defaultClientId, onClose }: TransactionFormProps) {
  const { data, selectedClient, addTransaction, updateTransaction } = useApp()
  const isEdit = !!transaction

  const clientId = transaction?.clientId ?? defaultClientId ?? selectedClient?.id ?? ''
  const [form, setForm] = useState({
    clientId,
    date: transaction?.date ?? today(),
    type: transaction?.type ?? 'expense' as 'income' | 'expense',
    payee: transaction?.payee ?? '',
    categoryId: transaction?.categoryId ?? '',
    account: transaction?.account ?? 'Checking',
    amount: transaction?.amount != null ? String(transaction.amount) : '',
    memo: transaction?.memo ?? '',
    cleared: transaction?.cleared ?? false,
  })
  const [error, setError] = useState('')

  const relevantCategories = data.categories.filter(c => c.active && c.type === form.type)

  function set<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
    if (key === 'type') {
      setForm(prev => ({ ...prev, type: value as 'income' | 'expense', categoryId: '' }))
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const amount = parseFloat(form.amount)
    if (!form.payee.trim()) { setError('Payee is required.'); return }
    if (!form.date) { setError('Date is required.'); return }
    if (isNaN(amount) || amount <= 0) { setError('Enter a valid amount greater than 0.'); return }
    if (!form.account.trim()) { setError('Account is required.'); return }

    const payload = {
      clientId: form.clientId,
      date: form.date,
      type: form.type,
      payee: form.payee.trim(),
      categoryId: form.categoryId || null,
      account: form.account.trim(),
      amount,
      memo: form.memo.trim(),
      cleared: form.cleared,
    }

    if (isEdit) {
      updateTransaction(transaction.id, payload)
    } else {
      addTransaction(payload)
    }
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">
            {isEdit ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-slate-500 mb-1">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => set('date', e.target.value)}
                required
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-slate-500 mb-1">Type</label>
              <select
                value={form.type}
                onChange={e => set('type', e.target.value as 'income' | 'expense')}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-slate-500 mb-1">Payee / Vendor</label>
            <input
              type="text"
              value={form.payee}
              onChange={e => set('payee', e.target.value)}
              placeholder="e.g. Sysco Foods"
              required
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-slate-500 mb-1">Category</label>
              <select
                value={form.categoryId}
                onChange={e => set('categoryId', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">— Uncategorized —</option>
                {relevantCategories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-slate-500 mb-1">Account</label>
              <input
                type="text"
                list="account-options"
                value={form.account}
                onChange={e => set('account', e.target.value)}
                required
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              <datalist id="account-options">
                {COMMON_ACCOUNTS.map(a => <option key={a} value={a} />)}
              </datalist>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-slate-500 mb-1">Amount ($)</label>
              <input
                type="number"
                value={form.amount}
                onChange={e => set('amount', e.target.value)}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                required
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div className="flex items-end pb-0.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.cleared}
                  onChange={e => set('cleared', e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600"
                />
                <span className="text-sm text-slate-700">Cleared</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-slate-500 mb-1">Memo</label>
            <input
              type="text"
              value={form.memo}
              onChange={e => set('memo', e.target.value)}
              placeholder="Optional note"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              {isEdit ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
