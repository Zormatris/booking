import type { Client, Transaction, Category } from './types'

export function exportClientCSV(
  client: Client,
  transactions: Transaction[],
  categories: Category[]
): string {
  const header = 'Date,Type,Payee,Category,Account,Amount,Memo,Cleared'
  const rows = transactions
    .filter(t => t.clientId === client.id)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(t => {
      const cat = categories.find(c => c.id === t.categoryId)?.name ?? 'Uncategorized'
      const amount = t.type === 'expense' ? -t.amount : t.amount
      return [
        t.date,
        t.type,
        csvEscape(t.payee),
        csvEscape(cat),
        csvEscape(t.account),
        amount.toFixed(2),
        csvEscape(t.memo ?? ''),
        t.cleared ? 'Yes' : 'No',
      ].join(',')
    })
  return [header, ...rows].join('\n')
}

function csvEscape(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
