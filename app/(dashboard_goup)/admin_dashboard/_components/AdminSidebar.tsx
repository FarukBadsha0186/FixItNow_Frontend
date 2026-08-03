"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Calendar,
  FolderTree,
  Settings,
  LogOut,
  ChevronDown,
  UserCog,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { logout } from "@/service/logout"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface AdminSidebarProps {
  user?: {
    name: string
    email: string
    role: string
  }
}

const navItems = [
  { label: "Dashboard", href: "/admin_dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/admin_dashboard/users", icon: Users },
  { label: "Bookings", href: "/admin_dashboard/bookings", icon: Calendar },
  { label: "Categories", href: "/admin_dashboard/categories", icon: FolderTree },
]

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    toast.success("Logged out successfully")
    router.push("/login")
  }

  return (
    <aside className="w-64 h-screen bg-white border-r flex flex-col sticky top-0">
      { }
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-primary">Admin</h1>
        <p className="text-xs text-muted-foreground">Dashboard Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-600 hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t space-y-3">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-muted/50">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.name} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {user?.name?.charAt(0) || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || "Admin"}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email || "admin@fixitnow.com"}</p>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full justify-start gap-2 text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  )
}