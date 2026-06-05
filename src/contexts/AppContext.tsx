'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { AppData, Client, Transaction, Category } from '@/lib/types'
import { loadData, saveData, resetToDemo, getBackupValidationError } from '@/lib/storage'
import { exportClientCSV, downloadFile } from '@/lib/csv'

interface AppContextValue {
  data: AppData
  selectedClient: Client | null
  setSelectedClientId: (id: string | null) => void
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateClient: (id: string, updates: Partial<Omit<Client, 'id' | 'createdAt'>>) => void
  deleteClient: (id: string) => void
  addTransaction: (txn: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTransaction: (id: string, updates: Partial<Omit<Transaction, 'id' | 'createdAt'>>) => void
  deleteTransaction: (id: string) => void
  addCategory: (cat: Omit<Category, 'id'>) => void
  updateCategory: (id: string, updates: Partial<Category>) => void
  exportAllJSON: () => void
  importJSON: (raw: string) => { success: boolean; error?: string }
  exportClientCSVAction: (clientId: string) => void
  resetDemo: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData | null>(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData(loadData())
  }, [])

  function update(newData: AppData) {
    setData(newData)
    saveData(newData)
  }

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <span className="text-sm text-slate-500">Loading LedgerDesk...</span>
      </div>
    )
  }

  const selectedClient =
    data.clients.find(c => c.id === data.selectedClientId) ?? data.clients[0] ?? null

  function setSelectedClientId(id: string | null) {
    update({ ...data!, selectedClientId: id })
  }

  function addClient(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString()
    update({
      ...data!,
      clients: [...data!.clients, { ...client, id: crypto.randomUUID(), createdAt: now, updatedAt: now }],
    })
  }

  function updateClient(id: string, updates: Partial<Omit<Client, 'id' | 'createdAt'>>) {
    update({
      ...data!,
      clients: data!.clients.map(c =>
        c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
      ),
    })
  }

  function deleteClient(id: string) {
    const remaining = data!.clients.filter(c => c.id !== id)
    update({
      ...data!,
      clients: remaining,
      transactions: data!.transactions.filter(t => t.clientId !== id),
      selectedClientId:
        data!.selectedClientId === id
          ? (remaining[0]?.id ?? null)
          : data!.selectedClientId,
    })
  }

  function addTransaction(txn: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString()
    update({
      ...data!,
      transactions: [...data!.transactions, { ...txn, id: crypto.randomUUID(), createdAt: now, updatedAt: now }],
    })
  }

  function updateTransaction(id: string, updates: Partial<Omit<Transaction, 'id' | 'createdAt'>>) {
    update({
      ...data!,
      transactions: data!.transactions.map(t =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
      ),
    })
  }

  function deleteTransaction(id: string) {
    update({ ...data!, transactions: data!.transactions.filter(t => t.id !== id) })
  }

  function addCategory(cat: Omit<Category, 'id'>) {
    update({ ...data!, categories: [...data!.categories, { ...cat, id: crypto.randomUUID() }] })
  }

  function updateCategory(id: string, updates: Partial<Category>) {
    update({
      ...data!,
      categories: data!.categories.map(c => (c.id === id ? { ...c, ...updates } : c)),
    })
  }

  function exportAllJSON() {
    const timestamp = new Date().toISOString().split('T')[0]
    downloadFile(JSON.stringify(data, null, 2), `ledgerdesk-backup-${timestamp}.json`, 'application/json')
  }

  function importJSON(raw: string): { success: boolean; error?: string } {
    try {
      const parsed = JSON.parse(raw)
      const err = getBackupValidationError(parsed)
      if (err) {
        return { success: false, error: `Import failed: ${err}` }
      }
      update(parsed as AppData)
      return { success: true }
    } catch {
      return { success: false, error: 'Could not read the file. Make sure it is a valid LedgerDesk JSON backup.' }
    }
  }

  function exportClientCSVAction(clientId: string) {
    const client = data!.clients.find(c => c.id === clientId)
    if (!client) return
    const csv = exportClientCSV(client, data!.transactions, data!.categories)
    const timestamp = new Date().toISOString().split('T')[0]
    const name = client.businessName.replace(/\s+/g, '-').toLowerCase()
    downloadFile(csv, `${name}-transactions-${timestamp}.csv`, 'text/csv')
  }

  function resetDemoAction() {
    setData(resetToDemo())
  }

  const value: AppContextValue = {
    data,
    selectedClient,
    setSelectedClientId,
    addClient,
    updateClient,
    deleteClient,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    exportAllJSON,
    importJSON,
    exportClientCSVAction,
    resetDemo: resetDemoAction,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
