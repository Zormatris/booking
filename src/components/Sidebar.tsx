'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard' },
  { href: '/clients', label: 'Clients' },
  { href: '/transactions', label: 'Transactions' },
  { href: '/categories', label: 'Categories' },
  { href: '/reports', label: 'Reports' },
  { href: '/settings', label: 'Settings / Backup' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      style={{ width: 260, minWidth: 260 }}
      className="no-print flex h-full flex-col border-r border-slate-200 bg-white"
    >
      <div className="flex items-center px-6 py-5 border-b border-slate-200">
        <span className="text-lg font-semibold tracking-tight text-slate-900">LedgerDesk</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map(item => {
            const isActive =
              item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="px-5 py-4 border-t border-slate-200">
        <p className="text-xs text-slate-400">Phase 1 — Local Storage</p>
        <p className="text-xs text-slate-400">Export backups often.</p>
      </div>
    </aside>
  )
}
