'use client'

import { Link, useLocation } from 'react-router-dom'
import useSWR from 'swr'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api-client'
import type { Account } from '@/lib/types'
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Upload,
  LogOut,
  User,
  UserX,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Accounts',
    href: '/accounts',
    icon: Wallet,
  },
  {
    title: 'Transactions',
    href: '/transactions',
    icon: ArrowLeftRight,
  },
  {
    title: 'Upload',
    href: '/upload',
    icon: Upload,
  },
]

export function AppSidebar() {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()

  const { data: accounts = [] } = useSWR<Account[]>(
    'accounts',
    () => apiClient.getAccounts()
  )

  const handleDeleteAccountClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (accounts.length > 0) {
      toast.error('You must delete all bank accounts before deleting your user account.')
    } else {
      try {
        await apiClient.deleteUser()
        toast.success('Account successfully deleted.')
        logout()
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete account.')
      }
    }
  }

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-5 flex flex-row items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wallet className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold">YAFT</span>
        </Link>
        <SidebarTrigger />
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link to={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-12 flex justify-center items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User className="h-4 w-4" />
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem onClick={handleDeleteAccountClick} className="text-destructive">
                  <UserX className="mr-2 h-4 w-4" />
                  Delete Account
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
