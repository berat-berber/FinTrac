'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import type { Account, Transaction } from '@/lib/types'

interface BalanceChartCardProps {
  accounts: Account[]
  transactions?: Transaction[]
  isLoading?: boolean
}

type TimeRange = '3m' | '6m' | '12m'

const chartConfig = {
  balance: {
    label: 'Total Balance',
    color: '#22c55e', // Vibrant green from the reference image
  },
} satisfies ChartConfig

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function getMonthsList(latestDate: Date, monthsCount: number) {
  const result = []
  let currentYear = latestDate.getFullYear()
  let currentMonth = latestDate.getMonth()

  for (let i = 0; i < monthsCount; i++) {
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999)
    result.unshift({
      year: currentYear,
      month: currentMonth,
      endOfMonth: endOfMonth,
      label: endOfMonth.toLocaleDateString(undefined, { month: 'short', year: '2-digit' }),
    })

    currentMonth--
    if (currentMonth < 0) {
      currentMonth = 11
      currentYear--
    }
  }
  return result
}

export function BalanceChartCard({ accounts, transactions = [], isLoading }: BalanceChartCardProps) {
  const [timeRange, setTimeRange] = React.useState<TimeRange>('6m')

  const chartData = React.useMemo(() => {
    if (!transactions.length || !accounts.length) return []

    // 1. Determine latest date from transactions explicitly to ensure there is data at the end
    let latest = new Date()
    let maxTime = 0
    transactions.forEach(t => {
      const d = new Date(t.date).getTime()
      if (!isNaN(d) && d > maxTime) {
        maxTime = d
        latest = new Date(d)
      }
    })

    // 2. Generate month intervals depending on the range
    const rangeInMonths = timeRange === '3m' ? 3 : timeRange === '6m' ? 6 : 12
    const months = getMonthsList(latest, rangeInMonths)

    // 3. For each month, compute total balance across all accounts
    return months.map(m => {
      let monthTotal = 0

      accounts.forEach(account => {
        // Find latest transaction for this account strictly ON OR BEFORE end of month
        let computedBalance = 0
        let latestValidTxTime = 0

        transactions.forEach(t => {
          if (t.accountId !== account.id) return

          const txTime = new Date(t.date).getTime()
          if (txTime <= m.endOfMonth.getTime() && txTime > latestValidTxTime) {
            latestValidTxTime = txTime
            computedBalance = Number(t.balance) || 0
          }
        })

        monthTotal += computedBalance
      })

      return {
        month: m.label,
        balance: monthTotal,
      }
    })
  }, [accounts, transactions, timeRange])

  if (isLoading) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Historical Balance</CardTitle>
          <div className="flex gap-1">
            <Skeleton className="h-6 w-10" />
            <Skeleton className="h-6 w-10" />
            <Skeleton className="h-6 w-10" />
          </div>
        </CardHeader>
        <CardContent className="flex-1 min-h-[300px]">
          <Skeleton className="w-full h-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between pb-2 space-y-0 gap-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">Historical Balance</CardTitle>
        </div>
        <div className="flex items-center gap-1 border rounded-md p-1 bg-muted/20">
          {(['3m', '6m', '12m'] as TimeRange[]).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "secondary" : "ghost"}
              size="sm"
              className={`h-7 px-3 text-xs ${timeRange === range ? 'shadow-sm font-semibold text-foreground' : 'text-muted-foreground'}`}
              onClick={() => setTimeRange(range)}
            >
              {range.toUpperCase()}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-[300px] p-0 pr-4 pb-4">
        {chartData.length === 0 ? (
          <div className="w-full h-full min-h-[300px] flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No transaction history available</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="w-full h-[300px]">
            <AreaChart accessibilityLayer data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-balance)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-balance)" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => '₺' + (value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value)}
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                width={50}
              />
              <ChartTooltip
                cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeOpacity: 0.2 }}
                content={<ChartTooltipContent indicator="line" labelFormatter={(label) => `End of ${label}`} />}
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="var(--color-balance)"
                strokeWidth={2}
                fill="url(#fillBalance)"
                isAnimationActive={true}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
