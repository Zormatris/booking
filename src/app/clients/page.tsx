'use client'

import { useState } from 'react'
import { AppShell } from '@/components/AppShell'
import { ClientForm } from '@/components/ClientForm'
import { useApp } from '@/contexts/AppContext'
import type { Client } from '@/lib/types'

export default function ClientsPage() {
  const { data, deleteClient, setSelectedClientId } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  function handleDelete(id: string) {
    deleteClient(id)
    setDeleteConfirm(null)
  }

  function handleEdit(client: Client) {
    setEditingClient(client)
    setShowForm(true)
  }

  function handleCloseForm() {
    setShowForm(false)
    setEditingClient(null)
  }

  const addButton = (
    <button
      onClick={() => setShowForm(true)}
      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
    >
      Add Client
    </button>
  )

  const active = data.clients.filter(c => c.status === 'active')
  const inactive = data.clients.filter(c => c.status === 'inactive')

  return (
    <AppShell title="Clients" action={addButton}>
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">
            All Clients <span className="ml-1 text-slate-400 font-normal">({data.clients.length})</span>
          </h2>
        </div>

        {data.clients.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-slate-500">No clients yet.</p>
            <p className="mt-1 text-xs text-slate-400">Add your first client to get started.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Business Name</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Contact</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Type</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Status</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Transactions</th>
                <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...active, ...inactive].map(client => {
                const txnCount = data.transactions.filter(t => t.clientId === client.id).length
                const isSelected = data.selectedClientId === client.id
                return (
                  <tr key={client.id} className={`border-b border-slate-100 last:border-0 hover:bg-slate-50 ${isSelected ? 'bg-blue-50/40' : ''}`}>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => setSelectedClientId(client.id)}
                        className="text-sm font-medium text-slate-900 hover:text-blue-600 text-left"
                      >
                        {client.businessName}
                        {isSelected && <span className="ml-2 text-xs text-blue-600">(selected)</span>}
                      </button>
                      {client.email && <p className="text-xs text-slate-400">{client.email}</p>}
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-600">{client.contactName ?? '—'}</td>
                    <td className="px-5 py-3 text-sm text-slate-600">{client.businessType ?? '—'}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                        client.status === 'active'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {client.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm tabular-nums text-slate-600">{txnCount}</td>
                    <td className="px-5 py-3 text-right">
                      {deleteConfirm === client.id ? (
                        <span className="flex items-center justify-end gap-2">
                          <span className="text-xs text-red-600">Delete client + {txnCount} transactions?</span>
                          <button
                            onClick={() => handleDelete(client.id)}
                            className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-700"
                          >
                            Yes, delete
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                          >
                            Cancel
                          </button>
                        </span>
                      ) : (
                        <span className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(client)}
                            className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(client.id)}
                            className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
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
        )}
      </div>

      {showForm && (
        <ClientForm
          client={editingClient ?? undefined}
          onClose={handleCloseForm}
        />
      )}
    </AppShell>
  )
}
