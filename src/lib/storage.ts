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

export function isValidBackup(data: unknown): data is AppData {
  if (!data || typeof data !== 'object') return false
  const d = data as Record<string, unknown>
  return Array.isArray(d.clients) && Array.isArray(d.transactions) && Array.isArray(d.categories)
}
