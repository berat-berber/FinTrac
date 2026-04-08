'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Field, FieldLabel, FieldGroup, FieldError } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { apiClient } from '@/lib/api-client'
import { toast } from 'sonner'
import type { Account } from '@/lib/types'

const accountSchema = z.object({
  name: z.string().min(1, 'Account name is required'),
  currency: z.string().min(1, 'Currency is required'),
  category: z.string().min(1, 'Category is required'),
})

type AccountFormData = z.infer<typeof accountSchema>

const currencies = ['USD', 'EUR', 'GBP', 'TRY', 'JPY', 'AUD', 'CAD', 'CHF']
const categories = ['Checking', 'Savings', 'Credit Card', 'Investment', 'Cash', 'Other']

interface EditAccountDialogProps {
  account: Account | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditAccountDialog({ account, open, onOpenChange, onSuccess }: EditAccountDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
  })

  useEffect(() => {
    if (account) {
      reset({
        name: account.name,
        currency: account.currency,
        category: account.category,
      })
    }
  }, [account, reset])

  const onSubmit = async (data: AccountFormData) => {
    if (!account) return
    
    setIsSubmitting(true)
    try {
      await apiClient.updateAccount(account.id, {
        name: data.name,
        currency: data.currency,
        category: data.category,
      })
      toast.success('Account updated successfully')
      onOpenChange(false)
      onSuccess()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update account')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Account</DialogTitle>
          <DialogDescription>
            Update your account details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="py-4">
            <Field>
              <FieldLabel htmlFor="edit-name">Account Name</FieldLabel>
              <Input
                id="edit-name"
                placeholder="e.g., Main Checking Account"
                {...register('name')}
              />
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="edit-currency">Currency</FieldLabel>
              <Select
                value={account?.currency}
                onValueChange={(value) => setValue('currency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.currency && <FieldError>{errors.currency.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="edit-category">Category</FieldLabel>
              <Select
                value={account?.category}
                onValueChange={(value) => setValue('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <FieldError>{errors.category.message}</FieldError>}
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner className="mr-2" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
