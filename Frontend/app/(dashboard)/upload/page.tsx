'use client'

import { useState, useCallback } from 'react'
import useSWR from 'swr'
import { Upload, FileUp, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Field, FieldLabel, FieldGroup, FieldDescription } from '@/components/ui/field'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { apiClient } from '@/lib/api-client'
import { toast } from 'sonner'
import type { Account } from '@/lib/types'

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

interface FileUpload {
  file: File
  status: UploadStatus
  error?: string
}

export default function UploadPage() {
  const [selectedAccountId, setSelectedAccountId] = useState<string>('')
  const [uploads, setUploads] = useState<FileUpload[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const { data: accounts = [], isLoading: accountsLoading } = useSWR<Account[]>(
    'accounts',
    () => apiClient.getAccounts()
  )

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return
    
    const newUploads: FileUpload[] = Array.from(files).map((file) => ({
      file,
      status: 'idle' as UploadStatus,
    }))
    
    setUploads((prev) => [...prev, ...newUploads])
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  const uploadFile = async (index: number) => {
    if (!selectedAccountId) {
      toast.error('Please select an account first')
      return
    }

    const upload = uploads[index]
    if (!upload || upload.status === 'uploading') return

    setUploads((prev) =>
      prev.map((u, i) => (i === index ? { ...u, status: 'uploading' } : u))
    )

    try {
      const selectedAccount = accounts.find((account) => account.id.toString() === selectedAccountId)
      if (!selectedAccount) {
        throw new Error('Selected account was not found')
      }
      await apiClient.uploadTransactions(selectedAccount.name, upload.file)
      setUploads((prev) =>
        prev.map((u, i) => (i === index ? { ...u, status: 'success' } : u))
      )
      toast.success(`Successfully uploaded ${upload.file.name}`)
    } catch (error) {
      setUploads((prev) =>
        prev.map((u, i) =>
          i === index
            ? { ...u, status: 'error', error: error instanceof Error ? error.message : 'Upload failed' }
            : u
        )
      )
      toast.error(`Failed to upload ${upload.file.name}`)
    }
  }

  const uploadAll = async () => {
    if (!selectedAccountId) {
      toast.error('Please select an account first')
      return
    }

    for (let i = 0; i < uploads.length; i++) {
      if (uploads[i].status === 'idle') {
        await uploadFile(i)
      }
    }
  }

  const removeFile = (index: number) => {
    setUploads((prev) => prev.filter((_, i) => i !== index))
  }

  const clearCompleted = () => {
    setUploads((prev) => prev.filter((u) => u.status !== 'success'))
  }

  const pendingCount = uploads.filter((u) => u.status === 'idle').length
  const hasCompleted = uploads.some((u) => u.status === 'success')

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Upload Transactions"
        description="Import your bank statements"
      />
      <div className="flex-1 p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Account Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Account</CardTitle>
              <CardDescription>
                Choose which account these transactions belong to
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="account">Bank Account</FieldLabel>
                  {accountsLoading ? (
                    <div className="h-10 animate-pulse rounded-md bg-secondary" />
                  ) : accounts.length === 0 ? (
                    <Empty>
                      <EmptyHeader>
                        <EmptyTitle>No accounts</EmptyTitle>
                        <EmptyDescription>Create an account first before uploading transactions.</EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  ) : (
                    <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map((account) => (
                          <SelectItem key={account.id} value={account.id.toString()}>
                            {account.name} ({account.currency})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <FieldDescription>
                    Transactions will be added to this account
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Files</CardTitle>
              <CardDescription>
                Upload CSV or Excel files from your bank
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
                <p className="mb-2 text-sm font-medium">
                  Drag and drop your files here
                </p>
                <p className="mb-4 text-xs text-muted-foreground">
                  or click to browse
                </p>
                <label>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    multiple
                    onChange={(e) => handleFiles(e.target.files)}
                    className="hidden"
                  />
                  <Button variant="outline" asChild>
                    <span>Browse Files</span>
                  </Button>
                </label>
              </div>

              {/* File List */}
              {uploads.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Files ({uploads.length})</p>
                    <div className="flex gap-2">
                      {hasCompleted && (
                        <Button variant="ghost" size="sm" onClick={clearCompleted}>
                          Clear completed
                        </Button>
                      )}
                      {pendingCount > 0 && (
                        <Button size="sm" onClick={uploadAll} disabled={!selectedAccountId}>
                          Upload all ({pendingCount})
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="divide-y divide-border rounded-lg border">
                    {uploads.map((upload, index) => (
                      <div
                        key={`${upload.file.name}-${index}`}
                        className="flex items-center gap-3 p-3"
                      >
                        <FileUp className="h-5 w-5 shrink-0 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {upload.file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(upload.file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {upload.status === 'idle' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                              >
                                Remove
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => uploadFile(index)}
                                disabled={!selectedAccountId}
                              >
                                Upload
                              </Button>
                            </>
                          )}
                          {upload.status === 'uploading' && (
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                          )}
                          {upload.status === 'success' && (
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          )}
                          {upload.status === 'error' && (
                            <div className="flex items-center gap-2">
                              <XCircle className="h-5 w-5 text-destructive" />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => uploadFile(index)}
                              >
                                Retry
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
