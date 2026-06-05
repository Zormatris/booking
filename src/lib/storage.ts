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

/** Returns a human-readable error string, or null if the backup is valid. */
export function getBackupValidationError(data: unknown): string | null {
  if (!isObj(data)) return 'File is not a valid JSON object.'
  if (!Array.isArray(data.clients)) return 'Missing or invalid clients list.'
  if (!Array.isArray(data.transactions)) return 'Missing or invalid transactions list.'
  if (!Array.isArray(data.categories)) return 'Missing or invalid categories list.'

  // Shape checks
  const badClient = (data.clients as unknown[]).findIndex(c => !isValidClientShape(c))
  if (badClient >= 0) {
    return `Client at position ${badClient + 1} is missing required fields (id, businessName, or status).`
  }
  const badTxn = (data.transactions as unknown[]).findIndex(t => !isValidTransactionShape(t))
  if (badTxn >= 0) {
    return `Transaction at position ${badTxn + 1} is missing required fields (id, clientId, date, type, amount, account, or cleared).`
  }
  const badCat = (data.categories as unknown[]).findIndex(c => !isValidCategoryShape(c))
  if (badCat >= 0) {
    return `Category at position ${badCat + 1} is missing required fields (id, name, type, or active).`
  }

  // Relationship checks (shapes are now confirmed valid)
  const clientIdSet = new Set<string>(
    (data.clients as Array<{ id: string }>).map(c => c.id)
  )
  const categoryIdSet = new Set<string>(
    (data.categories as Array<{ id: string }>).map(c => c.id)
  )

  if (data.selectedClientId != null) {
    if (typeof data.selectedClientId !== 'string' || !clientIdSet.has(data.selectedClientId)) {
      return 'selectedClientId does not match any client in this backup.'
    }
  }

  const txns = data.transactions as Array<{ clientId: string; categoryId: string | null | undefined }>
  for (let i = 0; i < txns.length; i++) {
    if (!clientIdSet.has(txns[i].clientId)) {
      return `Transaction at position ${i + 1} references a client that does not exist in this backup.`
    }
    const catId = txns[i].categoryId
    if (catId != null && !categoryIdSet.has(catId)) {
      return `Transaction at position ${i + 1} references a category that does not exist in this backup.`
    }
  }

  return null
}

export function isValidBackup(data: unknown): data is AppData {
  return getBackupValidationError(data) === null
}
