import type { Metadata } from 'next'
import './globals.css'
import { AppProvider } from '@/contexts/AppContext'

export const metadata: Metadata = {
  title: 'LedgerDesk',
  description: 'Desktop bookkeeping for small business clients.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  )
}
