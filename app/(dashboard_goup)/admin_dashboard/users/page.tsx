"use client"

import { useState, useEffect } from "react"
import { getUsers, toggleUserStatus } from "../_actions/admin.action"
import { UserTable } from "../_components/UserTable"
import { toast } from "sonner"

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const result = await getUsers()
      if (result.success) {
        setUsers(result.data || [])
      } else {
        toast.error(result.message || "Failed to load users")
      }
    } catch (error) {
      toast.error("Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleToggleStatus = async (userId: string, action: "ACTIVE" | "BANNED") => {
    const result = await toggleUserStatus(userId, action)
    if (result.success) {
      toast.success(result.message)
      await fetchUsers()
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground">Manage all users and their status</p>
      </div>

      <UserTable
        users={users}
        onToggleStatus={handleToggleStatus}
        isLoading={loading}
      />
    </div>
  )
}