'use client'

import { useMemo, useState } from 'react'
import { AppShell } from '@/components/AppShell'
import { MetricCard } from '@/components/MetricCard'
import { useApp } from '@/contexts/AppContext'
import { getTotals, filterByMonth, filterByClient, getByCategory } from '@/lib/calculations'
import { formatMoney, toMonthValue, fromMonthValue, getMonthLabel } from '@/lib/formatters'

export default function ReportsPage() {
  const { data, selectedClient } = useApp()

  const now = new Date()
  const [monthValue, setMonthValue] = useState(toMonthValue(now.getFullYear(), now.getMonth() + 1))
  const { year, month } = fromMonthValue(monthValue)

  const { totals, incomeRows, expenseRows } = useMemo(() => {
    const clientTxns = selectedClient
      ? filterByClient(data.transactions, selectedClient.id)
      : data.transactions
    const monthTxns = filterByMonth(clientTxns, year, month)
    return {
      totals: getTotals(monthTxns),
      incomeRows: getByCategory(monthTxns, data.categories, 'income'),
      expenseRows: getByCategory(monthTxns, data.categories, 'expense'),
    }
  }, [data.transactions, data.categories, selectedClient, year, month])

  const monthLabel = getMonthLabel(year, month)

  return (
    <AppShell title="Reports">
      <div className="mb-5 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Month</label>
          <input
            type="month"
            value={monthValue}
            onChange={e => setMonthValue(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        {selectedClient && (
          <span className="text-sm text-slate-500">{selectedClient.businessName} — {monthLabel}</span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <MetricCard label="Total Income" value={formatMoney(totals.income)} valueColor="text-green-600" />
        <MetricCard label="Total Expenses" value={formatMoney(totals.expenses)} valueColor="text-red-600" />
        <MetricCard
          label="Net Profit"
          value={formatMoney(totals.net)}
          valueColor={totals.net >= 0 ? 'text-green-600' : 'text-red-600'}
          sub={totals.net >= 0 ? 'Profitable month' : 'Net loss'}
        />
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <PLTable
          title="Income by Category"
          rows={incomeRows}
          total={totals.income}
          accentColor="text-green-600"
        />
        <PLTable
          title="Expenses by Category"
          rows={expenseRows}
          total={totals.expenses}
          accentColor="text-red-600"
        />
      </div>

      {totals.uncategorized > 0 && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm text-amber-800">
            {totals.uncategorized} uncategorized transaction{totals.uncategorized !== 1 ? 's' : ''} in this period. Categorize them for accurate reports.
          </p>
        </div>
      )}
    </AppShell>
  )
}

interface PLTableProps {
  title: string
  rows: { name: string; total: number }[]
  total: number
  accentColor: string
}

function PLTable({ title, rows, total, accentColor }: PLTableProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      </div>
      {rows.length === 0 ? (
        <div className="px-5 py-8 text-center">
          <p className="text-sm text-slate-400">No transactions this period.</p>
        </div>
      ) : (
        <>
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Category</th>
                <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500">Amount</th>
                <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500">%</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.name} className="border-b border-slate-100 last:border-0">
                  <td className="px-5 py-3 text-sm text-slate-800">{row.name}</td>
                  <td className={`px-5 py-3 text-right text-sm font-medium tabular-nums ${accentColor}`}>
                    {formatMoney(row.total)}
                  </td>
                  <td className="px-5 py-3 text-right text-xs tabular-nums text-slate-400">
                    {total > 0 ? Math.round((row.total / total) * 100) : 0}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-3">
            <span className="text-xs font-medium text-slate-500">Total</span>
            <span className={`text-sm font-semibold tabular-nums ${accentColor}`}>{formatMoney(total)}</span>
          </div>
        </>
      )}
    </div>
  )
}
