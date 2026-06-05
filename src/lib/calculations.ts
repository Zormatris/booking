import type { Transaction, Category } from './types'

export function getTotals(transactions: Transaction[]) {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  const net = income - expenses
  const uncategorized = transactions.filter(t => t.categoryId === null).length
  return { income, expenses, net, uncategorized }
}

export function filterByMonth(transactions: Transaction[], year: number, month: number) {
  return transactions.filter(t => {
    const [y, m] = t.date.split('-').map(Number)
    return y === year && m === month
  })
}

export function filterByDateRange(transactions: Transaction[], startDate: string, endDate: string) {
  return transactions.filter(t => t.date >= startDate && t.date <= endDate)
}

export function filterByClient(transactions: Transaction[], clientId: string) {
  return transactions.filter(t => t.clientId === clientId)
}

export function getByCategory(
  transactions: Transaction[],
  categories: Category[],
  type: 'income' | 'expense'
): { name: string; total: number }[] {
  const relevant = transactions.filter(t => t.type === type)
  const map = new Map<string, number>()
  for (const t of relevant) {
    const key = t.categoryId ?? '__uncategorized__'
    map.set(key, (map.get(key) ?? 0) + t.amount)
  }
  return Array.from(map.entries())
    .map(([id, total]) => ({
      name: id === '__uncategorized__' ? 'Uncategorized' : (categories.find(c => c.id === id)?.name ?? 'Unknown'),
      total,
    }))
    .sort((a, b) => b.total - a.total)
}
