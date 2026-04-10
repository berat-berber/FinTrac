'use client'

import useSWR from 'swr'
import { DashboardHeader } from '@/components/dashboard-header'
import { AccountsList } from '@/components/accounts/accounts-list'
import { AddAccountDialog } from '@/components/accounts/add-account-dialog'
import { apiClient } from '@/lib/api-client'
import type { Account, Transaction } from '@/lib/types'

export default function AccountsPage() {
  const { data: accounts = [], isLoading: accountsLoading, mutate } = useSWR<Account[]>(
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
        title="Accounts"
        description="Manage your bank accounts"
      >
        <AddAccountDialog onSuccess={() => mutate()} />
      </DashboardHeader>
      <div className="flex-1 p-6">
        <AccountsList
          accounts={accounts}
          transactions={transactions}
          isLoading={isLoading}
          onRefresh={() => mutate()}
        />
      </div>
    </div>
  )
}
