'use client'

import { Link } from 'react-router-dom'
import { ArrowRight, Wallet, CreditCard, PiggyBank, Building } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { Account } from '@/lib/types'

interface AccountsSummaryProps {
  accounts: Account[]
  isLoading?: boolean
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

function getCategoryIcon(category: string) {
  const lowerCategory = category?.toLowerCase() || ''
  if (lowerCategory.includes('credit')) return CreditCard
  if (lowerCategory.includes('saving')) return PiggyBank
  if (lowerCategory.includes('investment') || lowerCategory.includes('broker')) return Building
  return Wallet
}

export function AccountsSummary({ accounts, isLoading }: AccountsSummaryProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Accounts</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Accounts</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/accounts" className="flex items-center gap-1">
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {accounts.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No accounts yet. Add your first account to get started.
          </p>
        ) : (
          accounts.slice(0, 5).map((account) => {
            const Icon = getCategoryIcon(account.category)
            return (
              <div key={account.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{account.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {account.category}
                    </p>
                  </div>
                </div>
                <p className={`text-sm font-medium ${account.balance < 0 ? 'text-destructive' : ''}`}>
                  {formatCurrency(account.balance, account.currency)}
                </p>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
