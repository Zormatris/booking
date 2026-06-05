'use client'

import { useRef, useState } from 'react'
import { AppShell } from '@/components/AppShell'
import { useApp } from '@/contexts/AppContext'

export default function SettingsPage() {
  const { data, exportAllJSON, importJSON, exportClientCSVAction, resetDemo } = useApp()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [csvClientId, setCsvClientId] = useState(data.selectedClientId ?? data.clients[0]?.id ?? '')
  const [resetConfirm, setResetConfirm] = useState(false)

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const raw = ev.target?.result as string
      const result = importJSON(raw)
      if (result.success) {
        setImportStatus({ type: 'success', message: 'Backup imported successfully.' })
      } else {
        setImportStatus({ type: 'error', message: result.error ?? 'Import failed.' })
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function handleReset() {
    resetDemo()
    setResetConfirm(false)
    setImportStatus({ type: 'success', message: 'Demo data has been restored.' })
  }

  const totalTxns = data.transactions.length
  const totalClients = data.clients.length

  return (
    <AppShell title="Settings / Backup">
      <div className="max-w-2xl space-y-5">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 mb-1">Export All Data — JSON</h2>
          <p className="text-sm text-slate-500 mb-4">
            Download a complete backup of all clients, transactions, and categories as a JSON file.
            This file can be re-imported to restore your data.
          </p>
          <p className="text-xs text-slate-400 mb-4">
            {totalClients} clients · {totalTxns} transactions
          </p>
          <button
            onClick={exportAllJSON}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Export Backup (.json)
          </button>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 mb-1">Import JSON Backup</h2>
          <p className="text-sm text-slate-500 mb-4">
            Restore from a previously exported LedgerDesk JSON backup. This will replace all current data.
          </p>
          {importStatus && (
            <div className={`mb-4 rounded-lg px-4 py-3 text-sm ${
              importStatus.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {importStatus.message}
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          <button
            onClick={() => { setImportStatus(null); fileInputRef.current?.click() }}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Choose Backup File...
          </button>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 mb-1">Export Client Transactions — CSV</h2>
          <p className="text-sm text-slate-500 mb-4">
            Export a selected client&apos;s transactions as a CSV file for use in spreadsheets.
          </p>
          <div className="flex items-center gap-3">
            <select
              value={csvClientId}
              onChange={e => setCsvClientId(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {data.clients.map(c => (
                <option key={c.id} value={c.id}>{c.businessName}</option>
              ))}
            </select>
            <button
              onClick={() => csvClientId && exportClientCSVAction(csvClientId)}
              disabled={!csvClientId || data.clients.length === 0}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Export CSV
            </button>
          </div>
        </div>

        <div className="rounded-xl border-2 border-red-200 bg-red-50 p-6">
          <h2 className="text-sm font-semibold text-red-900 mb-1">Reset to Demo Data</h2>
          <p className="text-sm text-red-700 mb-4">
            This will permanently delete all your data and restore the original demo clients and transactions.
            This cannot be undone. Export a backup before proceeding.
          </p>
          {resetConfirm ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-red-800 font-medium">Are you sure? All data will be lost.</span>
              <button
                onClick={handleReset}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Yes, Reset Everything
              </button>
              <button
                onClick={() => setResetConfirm(false)}
                className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setResetConfirm(true)}
              className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
            >
              Reset to Demo Data
            </button>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-400">
            <strong className="text-slate-500">LedgerDesk — Phase 1</strong> · Data is stored in this browser only.
            Export backups often. Data will be lost if you clear browser storage.
          </p>
        </div>
      </div>
    </AppShell>
  )
}
