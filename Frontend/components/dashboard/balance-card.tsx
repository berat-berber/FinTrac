'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { Account } from '@/lib/types'

interface BalanceCardProps {
  accounts: Account[]
  isLoading?: boolean
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function BalanceCard({ accounts, isLoading }: BalanceCardProps) {
  // Group accounts by currency and calculate totals
  const balancesByCurrency = accounts.reduce((acc, account) => {
    const currency = account.currency || 'USD'
    acc[currency] = (acc[currency] || 0) + account.balance
    return acc
  }, {} as Record<string, number>)

  const currencies = Object.entries(balancesByCurrency)
  const totalBalance = currencies.length > 0 ? currencies[0][1] : 0
  const mainCurrency = currencies.length > 0 ? currencies[0][0] : 'USD'

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-9 w-40" />
          <Skeleton className="mt-2 h-4 w-24" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Total Balance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">
          {formatCurrency(totalBalance, mainCurrency)}
        </div>
        {currencies.length > 1 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {currencies.slice(1).map(([currency, amount]) => (
              <span key={currency} className="text-sm text-muted-foreground">
                {formatCurrency(amount, currency)}
              </span>
            ))}
          </div>
        )}
        <div className="mt-2 flex items-center gap-1 text-sm">
          {totalBalance >= 0 ? (
            <>
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">
                Across {accounts.length} account{accounts.length !== 1 ? 's' : ''}
              </span>
            </>
          ) : (
            <>
              <TrendingDown className="h-4 w-4 text-destructive" />
              <span className="text-muted-foreground">
                Across {accounts.length} account{accounts.length !== 1 ? 's' : ''}
              </span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
