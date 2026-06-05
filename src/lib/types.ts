export type Client = {
  id: string
  businessName: string
  contactName?: string
  email?: string
  phone?: string
  businessType?: string
  status: 'active' | 'inactive'
  notes?: string
  createdAt: string
  updatedAt: string
}

export type Transaction = {
  id: string
  clientId: string
  date: string
  type: 'income' | 'expense'
  payee: string
  categoryId: string | null
  account: string
  amount: number
  memo?: string
  cleared: boolean
  createdAt: string
  updatedAt: string
}

export type Category = {
  id: string
  name: string
  type: 'income' | 'expense'
  active: boolean
}

export type AppData = {
  clients: Client[]
  transactions: Transaction[]
  categories: Category[]
  selectedClientId: string | null
}
