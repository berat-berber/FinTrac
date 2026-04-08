'use client'

import { Wallet, ArrowLeftRight, TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { Account, Transaction } from '@/lib/types'

interface StatsCardsProps {
  accounts: Account[]
  transactions: Transaction[]
  isLoading?: boolean
}

function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function StatsCards({ accounts, transactions, isLoading }: StatsCardsProps) {
  // Calculate stats
  const totalAccounts = accounts.length
  const totalTransactions = transactions.length
  
  // Get this month's transactions
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const thisMonthTransactions = transactions.filter(
    (t) => new Date(t.date) >= startOfMonth
  )
  
  const income = thisMonthTransactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0)
  
  const expenses = thisMonthTransactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const stats = [
    {
      title: 'Total Accounts',
      value: totalAccounts.toString(),
      icon: Wallet,
      description: 'Connected accounts',
    },
    {
      title: 'Transactions',
      value: totalTransactions.toString(),
      icon: ArrowLeftRight,
      description: 'Total recorded',
    },
    {
      title: 'Income (This Month)',
      value: formatCurrency(income),
      icon: TrendingUp,
      description: 'Money received',
      positive: true,
    },
    {
      title: 'Expenses (This Month)',
      value: formatCurrency(expenses),
      icon: TrendingDown,
      description: 'Money spent',
      negative: true,
    },
  ]

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-20" />
              <Skeleton className="mt-1 h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${
              stat.positive ? 'text-primary' : stat.negative ? 'text-destructive' : 'text-muted-foreground'
            }`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              stat.positive ? 'text-primary' : ''
            }`}>
              {stat.value}
            </div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
