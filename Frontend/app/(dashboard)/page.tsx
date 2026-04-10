'use client'

import useSWR from 'swr'
import { DashboardHeader } from '@/components/dashboard-header'
import { BalanceCard } from '@/components/dashboard/balance-card'
import { BalanceChartCard } from '@/components/dashboard/balance-chart-card'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { apiClient } from '@/lib/api-client'
import type { Account, Transaction } from '@/lib/types'

export default function DashboardPage() {
  const { data: accounts = [], isLoading: accountsLoading } = useSWR<Account[]>(
    'accounts',
    () => apiClient.getAccounts()
  )

  const { data: transactions = [], isLoading: transactionsLoading } = useSWR<Transaction[]>(
    'transactions',
    () => apiClient.getTransactions()
  )

  const isLoading = accountsLoading || transactionsLoading

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Dashboard"
        description="Overview of your financial accounts"
      />
      <div className="flex-1 space-y-6 p-6">
        <StatsCards
          accounts={accounts}
          transactions={transactions}
          isLoading={isLoading}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <BalanceCard accounts={accounts} transactions={transactions} isLoading={accountsLoading} />
          <BalanceChartCard accounts={accounts} transactions={transactions} isLoading={isLoading} />
        </div>

        <RecentTransactions
          transactions={transactions}
          accounts={accounts}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
