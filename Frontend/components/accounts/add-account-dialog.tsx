'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

const accountSchema = z.object({
  name: z.string().min(1, 'Account name is required'),
  currency: z.string().min(1, 'Currency is required'),
  category: z.string().min(1, 'Category is required'),
})

type AccountFormData = z.infer<typeof accountSchema>

const currencies = ['USD', 'EUR', 'GBP', 'TRY', 'JPY', 'AUD', 'CAD', 'CHF']
const categories = ['Checking', 'Savings', 'Credit Card', 'Investment', 'Cash', 'Other']

interface AddAccountDialogProps {
  onSuccess: () => void
}

export function AddAccountDialog({ onSuccess }: AddAccountDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: '',
      currency: 'USD',
      category: 'Checking',
    },
  })

  const onSubmit = async (data: AccountFormData) => {
    setIsSubmitting(true)
    try {
      await apiClient.createAccount({
        name: data.name,
        currency: data.currency,
        category: data.category,
      })
      toast.success('Account created successfully')
      setOpen(false)
      reset()
      onSuccess()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create account')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Account
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Account</DialogTitle>
          <DialogDescription>
            Add a new bank account to track your finances.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="py-4">
            <Field>
              <FieldLabel htmlFor="name">Account Name</FieldLabel>
              <Input
                id="name"
                placeholder="e.g., Main Checking Account"
                {...register('name')}
              />
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="currency">Currency</FieldLabel>
              <Select
                defaultValue="USD"
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
              <FieldLabel htmlFor="category">Category</FieldLabel>
              <Select
                defaultValue="Checking"
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner className="mr-2" /> : null}
              Create Account
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
