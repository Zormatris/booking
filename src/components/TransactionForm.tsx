'use client'

import { useState } from 'react'
import type { Transaction } from '@/lib/types'
import { useApp } from '@/contexts/AppContext'
import { formatDate, formatMoney } from '@/lib/formatters'

interface TransactionFormProps {
  transaction?: Transaction
  defaultClientId?: string
  onClose: () => void
}

interface SavePayload {
  clientId: string
  date: string
  type: 'income' | 'expense'
  payee: string
  categoryId: string | null
  account: string
  amount: number
  memo: string
  cleared: boolean
}

const COMMON_ACCOUNTS = ['Checking', 'Savings', 'Visa Business', 'Mastercard Business', 'Cash', 'Other']

function today(): string {
  return new Date().toISOString().split('T')[0]
}

type FieldErrors = Partial<Record<'date' | 'payee' | 'amount' | 'account', string>>

const inputBase = 'w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2'
const inputOk = 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
const inputErr = 'border-red-300 focus:border-red-400 focus:ring-red-100'

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
  const [errors, setErrors] = useState<FieldErrors>({})
  const [dupPayload, setDupPayload] = useState<SavePayload | null>(null)

  const relevantCategories = data.categories.filter(c => c.active && c.type === form.type)

  function set<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    if (key === 'type') {
      setForm(prev => ({ ...prev, type: value as 'income' | 'expense', categoryId: '' }))
    } else {
      setForm(prev => ({ ...prev, [key]: value }))
    }
  }

  function clearErr(key: keyof FieldErrors) {
    if (errors[key]) setErrors(p => ({ ...p, [key]: undefined }))
  }

  function doSave(payload: SavePayload) {
    if (isEdit) {
      updateTransaction(transaction.id, payload)
    } else {
      addTransaction(payload)
    }
    onClose()
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setDupPayload(null)

    const amount = parseFloat(form.amount)
    const newErrors: FieldErrors = {}
    if (!form.date) newErrors.date = 'Date is required.'
    if (!form.payee.trim()) newErrors.payee = 'Payee is required.'
    if (isNaN(amount) || amount <= 0) newErrors.amount = 'Enter a valid amount greater than $0.00.'
    if (!form.account.trim()) newErrors.account = 'Account is required.'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const payload: SavePayload = {
      clientId: form.clientId,
      date: form.date,
      type: form.type,
      payee: form.payee.trim(),
      categoryId: form.categoryId || null,
      account: form.account.trim(),
      amount: Math.abs(amount),
      memo: form.memo.trim(),
      cleared: form.cleared,
    }

    // Duplicate check — Add mode only, skip the transaction being edited
    if (!isEdit) {
      const existing = data.transactions.find(t =>
        t.clientId === payload.clientId &&
        t.date === payload.date &&
        t.type === payload.type &&
        t.payee.toLowerCase().trim() === payload.payee.toLowerCase() &&
        t.amount === payload.amount &&
        t.account.toLowerCase().trim() === payload.account.toLowerCase()
      )
      if (existing) {
        setDupPayload(payload)
        return
      }
    }

    doSave(payload)
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

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => { set('date', e.target.value); clearErr('date') }}
                className={`${inputBase} ${errors.date ? inputErr : inputOk}`}
              />
              {errors.date && <p className="mt-1 text-xs text-red-600">{errors.date}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Type</label>
              <select
                value={form.type}
                onChange={e => set('type', e.target.value as 'income' | 'expense')}
                className={`${inputBase} ${inputOk}`}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Payee / Vendor</label>
            <input
              type="text"
              value={form.payee}
              onChange={e => { set('payee', e.target.value); clearErr('payee') }}
              placeholder="e.g. Sysco Foods"
              className={`${inputBase} ${errors.payee ? inputErr : inputOk}`}
            />
            {errors.payee && <p className="mt-1 text-xs text-red-600">{errors.payee}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Category</label>
              <select
                value={form.categoryId}
                onChange={e => set('categoryId', e.target.value)}
                className={`${inputBase} ${inputOk}`}
              >
                <option value="">— Uncategorized —</option>
                {relevantCategories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Account</label>
              <input
                type="text"
                list="account-options"
                value={form.account}
                onChange={e => { set('account', e.target.value); clearErr('account') }}
                className={`${inputBase} ${errors.account ? inputErr : inputOk}`}
              />
              <datalist id="account-options">
                {COMMON_ACCOUNTS.map(a => <option key={a} value={a} />)}
              </datalist>
              {errors.account && <p className="mt-1 text-xs text-red-600">{errors.account}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Amount ($)</label>
              <input
                type="number"
                value={form.amount}
                onChange={e => { set('amount', e.target.value); clearErr('amount') }}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                className={`${inputBase} ${errors.amount ? inputErr : inputOk}`}
              />
              {errors.amount && <p className="mt-1 text-xs text-red-600">{errors.amount}</p>}
            </div>
            <div className="flex items-end pb-0.5">
              <label className="flex cursor-pointer items-center gap-2">
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
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Memo</label>
            <input
              type="text"
              value={form.memo}
              onChange={e => set('memo', e.target.value)}
              placeholder="Optional note"
              className={`${inputBase} ${inputOk}`}
            />
          </div>

          {dupPayload ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="mb-1 text-sm font-medium text-amber-800">Possible duplicate transaction</p>
              <p className="mb-3 text-xs text-amber-700">
                A similar {dupPayload.type} entry already exists:{' '}
                <strong>{dupPayload.payee}</strong> · <strong>{formatMoney(dupPayload.amount)}</strong>{' '}
                on {formatDate(dupPayload.date)}.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => doSave(dupPayload)}
                  className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700"
                >
                  Add Anyway
                </button>
                <button
                  type="button"
                  onClick={() => setDupPayload(null)}
                  className="rounded-lg border border-amber-200 bg-white px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100"
                >
                  Go Back
                </button>
              </div>
            </div>
          ) : (
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
          )}
        </form>
      </div>
    </div>
  )
}
