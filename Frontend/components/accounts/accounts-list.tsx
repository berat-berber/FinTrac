'use client'

import { useState } from 'react'
import { MoreHorizontal, Pencil, Trash2, Wallet, CreditCard, PiggyBank, Building } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { EditAccountDialog } from './edit-account-dialog'
import { apiClient } from '@/lib/api-client'
import { toast } from 'sonner'
import type { Account, Transaction } from '@/lib/types'

interface AccountsListProps {
  accounts: Account[]
  transactions?: Transaction[]
  isLoading?: boolean
  onRefresh: () => void
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat(undefined, {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

function getCategoryIcon(category: string) {
  const lowerCategory = category?.toLowerCase() || ''
  if (lowerCategory.includes('credit')) return CreditCard
  if (lowerCategory.includes('saving')) return PiggyBank
  if (lowerCategory.includes('investment') || lowerCategory.includes('broker')) return Building
  return Wallet
}

export function AccountsList({ accounts, transactions = [], isLoading, onRefresh }: AccountsListProps) {
  const [editAccount, setEditAccount] = useState<Account | null>(null)
  const [deleteAccount, setDeleteAccount] = useState<Account | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteAccount) return
    
    setIsDeleting(true)
    try {
      await apiClient.deleteAccount(deleteAccount.id)
      toast.success('Account deleted successfully')
      setDeleteAccount(null)
      onRefresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete account')
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3].map((i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </TableCell>
                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                <TableCell><Skeleton className="h-8 w-8" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (accounts.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No accounts yet</EmptyTitle>
          <EmptyDescription>Add your first bank account to start tracking your finances.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((account) => {
              const Icon = getCategoryIcon(account.category)
              
              let computedBalance = account.balance
              const accountTransactions = transactions.filter(t => t.accountId === account.id)
              if (accountTransactions.length > 0) {
                computedBalance = accountTransactions[0].balance
              }

              return (
                <TableRow key={account.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <span className="font-medium">{account.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{account.category}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{account.currency}</TableCell>
                  <TableCell className={`text-right font-medium ${computedBalance < 0 ? 'text-destructive' : ''}`}>
                    {formatCurrency(computedBalance)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditAccount(account)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteAccount(account)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <EditAccountDialog
        account={editAccount}
        open={!!editAccount}
        onOpenChange={(open) => !open && setEditAccount(null)}
        onSuccess={onRefresh}
      />

      <AlertDialog open={!!deleteAccount} onOpenChange={(open) => !open && setDeleteAccount(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteAccount?.name}&quot;? This action cannot be undone
              and all associated transactions will be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
