"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Loader2, Search } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: string
  status: "ACTIVE" | "BANNED"
  phone?: string
  createdAt: string
}

interface UserTableProps {
  users: User[]
  onToggleStatus: (userId: string, action: "ACTIVE" | "BANNED") => Promise<void>
  isLoading?: boolean
}

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  ACTIVE: { bg: "bg-green-100", text: "text-green-800", label: "Active" },
  BANNED: { bg: "bg-red-100", text: "text-red-800", label: "Banned" },
}

const roleConfig: Record<string, { bg: string; text: string }> = {
  CUSTOMER: { bg: "bg-blue-100", text: "text-blue-800" },
  TECHNICIAN: { bg: "bg-purple-100", text: "text-purple-800" },
  ADMIN: { bg: "bg-red-100", text: "text-red-800" },
}

export function UserTable({ users, onToggleStatus, isLoading = false }: UserTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleToggle = async (userId: string, currentStatus: string) => {
    const action = currentStatus === "ACTIVE" ? "BANNED" : "ACTIVE"
    setLoadingId(userId)
    try {
      await onToggleStatus(userId, action)
    } finally {
      setLoadingId(null)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <span className="text-sm text-muted-foreground">{filteredUsers.length} users found</span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">Role</th>
              <th className="px-4 py-3 text-left font-medium">Joined</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-muted-foreground">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const status = statusConfig[user.status] || statusConfig.ACTIVE
                const role = roleConfig[user.role] || roleConfig.CUSTOMER

                return (
                  <tr key={user.id} className="border-b border-border hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium">{user.name || "N/A"}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">
                      <Badge className={role.bg + " " + role.text}>{user.role}</Badge>
                    </td>
                    <td className="px-4 py-3">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-3">
                      <Badge className={status.bg + " " + status.text}>{status.label}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      {user.role !== "ADMIN" ? (
                        <Button
                          variant={user.status === "ACTIVE" ? "destructive" : "default"}
                          size="sm"
                          onClick={() => handleToggle(user.id, user.status)}
                          disabled={loadingId === user.id}
                          className={user.status === "BANNED" ? "bg-green-600 hover:bg-green-700" : ""}
                        >
                          {loadingId === user.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : user.status === "ACTIVE" ? (
                            "BNNED"
                          ) : (
                            "ACTIVE"
                          )}
                        </Button>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}