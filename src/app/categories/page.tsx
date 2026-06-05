'use client'

import { useState } from 'react'
import { AppShell } from '@/components/AppShell'
import { useApp } from '@/contexts/AppContext'

export default function CategoriesPage() {
  const { data, addCategory, updateCategory } = useApp()

  const incomeCategories = data.categories.filter(c => c.type === 'income')
  const expenseCategories = data.categories.filter(c => c.type === 'expense')

  return (
    <AppShell title="Categories">
      <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <CategoryPanel
          title="Income Categories"
          type="income"
          categories={incomeCategories}
          transactions={data.transactions}
          onAdd={name => addCategory({ name, type: 'income', active: true })}
          onToggle={(id, active) => updateCategory(id, { active })}
        />
        <CategoryPanel
          title="Expense Categories"
          type="expense"
          categories={expenseCategories}
          transactions={data.transactions}
          onAdd={name => addCategory({ name, type: 'expense', active: true })}
          onToggle={(id, active) => updateCategory(id, { active })}
        />
      </div>
    </AppShell>
  )
}

interface CategoryPanelProps {
  title: string
  type: 'income' | 'expense'
  categories: { id: string; name: string; active: boolean }[]
  transactions: Array<{ categoryId: string | null }>
  onAdd: (name: string) => void
  onToggle: (id: string, active: boolean) => void
}

function CategoryPanel({ title, type, categories, transactions, onAdd, onToggle }: CategoryPanelProps) {
  const [newName, setNewName] = useState('')
  const [error, setError] = useState('')
  const [deactivateConfirm, setDeactivateConfirm] = useState<string | null>(null)

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const name = newName.trim()
    if (!name) { setError('Category name is required.'); return }
    if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      setError('A category with this name already exists.')
      return
    }
    onAdd(name)
    setNewName('')
    setError('')
  }

  function handleToggleClick(cat: { id: string; name: string; active: boolean }) {
    if (cat.active) {
      // Deactivating — check if any transactions use this category
      const useCount = transactions.filter(t => t.categoryId === cat.id).length
      if (useCount > 0) {
        setDeactivateConfirm(cat.id)
        return
      }
    }
    // Activating or deactivating with no usage — immediate
    onToggle(cat.id, !cat.active)
  }

  const active = categories.filter(c => c.active)
  const inactive = categories.filter(c => !c.active)

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        <p className="mt-0.5 text-xs text-slate-400">{active.length} active</p>
      </div>

      <div className="px-5 py-4">
        <form onSubmit={handleAdd} className="mb-4 flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={e => { setNewName(e.target.value); setError('') }}
            placeholder={`New ${type} category name...`}
            className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <button
            type="submit"
            className="whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Add
          </button>
        </form>
        {error && <p className="mb-3 text-xs text-red-600">{error}</p>}

        {categories.length === 0 ? (
          <p className="py-4 text-center text-sm text-slate-400">
            No {type} categories yet. Add one above.
          </p>
        ) : (
          <ul className="space-y-0.5">
            {[...active, ...inactive].map(cat => {
              const useCount = transactions.filter(t => t.categoryId === cat.id).length
              return (
                <li
                  key={cat.id}
                  className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-slate-50"
                >
                  <span className={`text-sm ${cat.active ? 'text-slate-800' : 'text-slate-400 line-through'}`}>
                    {cat.name}
                    {useCount > 0 && (
                      <span className="ml-2 text-xs text-slate-400">
                        {useCount} txn{useCount !== 1 ? 's' : ''}
                      </span>
                    )}
                  </span>

                  {deactivateConfirm === cat.id ? (
                    <span className="flex items-center gap-2 text-xs">
                      <span className="text-amber-700">
                        Used by {useCount} transaction{useCount !== 1 ? 's' : ''}. Deactivate?
                      </span>
                      <button
                        onClick={() => { onToggle(cat.id, false); setDeactivateConfirm(null) }}
                        className="font-medium text-red-600 hover:underline"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setDeactivateConfirm(null)}
                        className="text-slate-500 hover:underline"
                      >
                        Cancel
                      </button>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleToggleClick(cat)}
                      className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                        cat.active
                          ? 'bg-green-50 text-green-700 hover:bg-green-100'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {cat.active ? 'Active' : 'Inactive'}
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
