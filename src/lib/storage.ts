import type { AppData } from './types'
import { SEED_DATA } from './seedData'

const KEY = 'ledgerdesk_data'

export function loadData(): AppData {
  if (typeof window === 'undefined') return { ...SEED_DATA }
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return structuredClone(SEED_DATA)
    return JSON.parse(raw) as AppData
  } catch {
    return structuredClone(SEED_DATA)
  }
}

export function saveData(data: AppData): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function resetToDemo(): AppData {
  const fresh = structuredClone(SEED_DATA)
  if (typeof window !== 'undefined') {
    localStorage.setItem(KEY, JSON.stringify(fresh))
  }
  return fresh
}

function isObj(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v)
}

function isValidClientShape(c: unknown): boolean {
  if (!isObj(c)) return false
  return typeof c.id === 'string' && c.id.length > 0 &&
    typeof c.businessName === 'string' && c.businessName.length > 0 &&
    (c.status === 'active' || c.status === 'inactive')
}

function isValidTransactionShape(t: unknown): boolean {
  if (!isObj(t)) return false
  return typeof t.id === 'string' && t.id.length > 0 &&
    typeof t.clientId === 'string' && t.clientId.length > 0 &&
    typeof t.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(t.date) &&
    (t.type === 'income' || t.type === 'expense') &&
    typeof t.payee === 'string' &&
    typeof t.amount === 'number' && t.amount >= 0 &&
    typeof t.account === 'string' &&
    typeof t.cleared === 'boolean'
}

function isValidCategoryShape(c: unknown): boolean {
  if (!isObj(c)) return false
  return typeof c.id === 'string' && c.id.length > 0 &&
    typeof c.name === 'string' && c.name.length > 0 &&
    (c.type === 'income' || c.type === 'expense') &&
    typeof c.active === 'boolean'
}

export function isValidBackup(data: unknown): data is AppData {
  if (!isObj(data)) return false
  if (!Array.isArray(data.clients) || !Array.isArray(data.transactions) || !Array.isArray(data.categories)) return false
  if (!data.clients.every(isValidClientShape)) return false
  if (!data.transactions.every(isValidTransactionShape)) return false
  if (!data.categories.every(isValidCategoryShape)) return false
  return true
}
