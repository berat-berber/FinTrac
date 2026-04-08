'use client'

import useSWR from 'swr'
import { DashboardHeader } from '@/components/dashboard-header'
import { AccountsList } from '@/components/accounts/accounts-list'
import { AddAccountDialog } from '@/components/accounts/add-account-dialog'
import { apiClient } from '@/lib/api-client'
import type { Account } from '@/lib/types'

export default function AccountsPage() {
  const { data: accounts = [], isLoading, mutate } = useSWR<Account[]>(
    'accounts',
    () => apiClient.getAccounts()
  )

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
          isLoading={isLoading}
          onRefresh={() => mutate()}
        />
      </div>
    </div>
  )
}
