'use client'

import { useApp } from '@/contexts/AppContext'

interface TopBarProps {
  title: string
  action?: React.ReactNode
}

export function TopBar({ title, action }: TopBarProps) {
  const { data, selectedClient, setSelectedClientId } = useApp()
  const activeClients = data.clients.filter(c => c.status === 'active')
  // Only show the selected client in the switcher if it is inactive — don't list all inactive clients
  const selectedIsInactive = selectedClient?.status === 'inactive'

  return (
    <header className="no-print flex items-center justify-between border-b border-slate-200 bg-white px-6 h-16 shrink-0">
      <h1 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h1>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="client-switcher" className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Client
          </label>
          <select
            id="client-switcher"
            value={selectedClient?.id ?? ''}
            onChange={e => setSelectedClientId(e.target.value || null)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            {activeClients.length === 0 && !selectedIsInactive && (
              <option value="">No active clients</option>
            )}
            {activeClients.map(c => (
              <option key={c.id} value={c.id}>{c.businessName}</option>
            ))}
            {selectedIsInactive && selectedClient && (
              <option key={selectedClient.id} value={selectedClient.id}>
                {selectedClient.businessName} (inactive)
              </option>
            )}
          </select>
        </div>

        {action && <div>{action}</div>}
      </div>
    </header>
  )
}
