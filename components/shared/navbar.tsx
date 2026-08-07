'use client'

import Link from 'next/link'
import { ChevronDown, LogOut, Settings, User, LayoutDashboard } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { logout } from '@/service/logout'
import { toast } from 'sonner'
import { useRouter } from "next/navigation"
import { Button } from '../ui/button'
import { link } from 'fs'

type IUser = {
  success: boolean
  message: string
  data: {
    id: string
    name: string
    email: string
    phone: string
    role: "CUSTOMER" | "TECHNICIAN" | "ADMIN" |"null"
    status: string
    createdAt: string
    updatedAt: string
  }
}

type NavbarProps = {
  user: IUser
}

// Public links — always visible, logged in or not (Customer keeps seeing these too)
const publicNavItems = [
   { label: 'Home', href: '/' }, 
 { label: 'Services', href: '/services' },
  { label: 'Technicians', href: '/technicians' }
]

// Role-specific extra links (added alongside public links when logged in)
const roleNavItems: Record<string, { label: string; href: string }[]> = {
  CUSTOMER: [
    { label: ' Reviews', href: '/customer_dashboard/reviews' },
    { label: 'My Bookings', href: '/customer_dashboard/bookings' },
  ],
  TECHNICIAN: [
    { label: 'My Services', href: '/technician_dashboard/service' },
    { label: 'Availability', href: '/technician_dashboard/availability' },
    { label: 'Bookings', href: '/technician_dashboard/booking' },
  ],
  ADMIN: [
    { label: 'Users', href: '/admin_dashboard/users' },
    { label: 'Bookings', href: '/admin_dashboard/bookings' },
    { label: 'Categories', href: '/admin_dashboard/categories' },
  ],
}

const dashboardPathByRole: Record<string, string> = {
  CUSTOMER: '/customer_dashboard',
  TECHNICIAN: '/technician_dashboard',
  ADMIN: '/admin_dashboard',
}

export function Navbar({ user }: NavbarProps) {
  const router = useRouter()
  const isLoggedIn = user.success
  const role = user.data?.role

  const handleUserMenuAction = async (action: string) => {
    if (action === "logout") {
      await logout()
      toast.success("User Logged Out Successfully!")
      router.push("/login")
    }
  }

  // Technician/Admin don't need public browse links cluttering their nav;
  // Customer keeps seeing them since browsing is core to their flow.
  const navItemsToShow =
    !isLoggedIn || role === "null"
      ? [...publicNavItems, ...(isLoggedIn ? roleNavItems[role] : [])]
      : roleNavItems[role] ?? []

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="shrink-0">
            <Link href="/" className="text-2xl font-bold text-primary">
              Fix It Now
            </Link>
          </div>

          {/* Nav Links - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navItemsToShow.map((item) => (
              <Link
                key={item.href }
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center gap-2 px-2.5 h-8 rounded-lg hover:bg-muted transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <ChevronDown className="w-4 h-4 opacity-50" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.data?.name}</p>
                    <p className="text-xs text-muted-foreground">{user.data?.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">{role?.toLowerCase()}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="gap-2">
                    <Link href={dashboardPathByRole[role]}>
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleUserMenuAction("logout")}>
                    <LogOut className="w-4 h-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="outline" className="cursor-pointer">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="cursor-pointer">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}