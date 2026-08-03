"use client"

import { useState, useEffect } from "react"
import { getAdminStats } from "./_actions/admin.action"
import { AdminStats } from "./_components/AdminStats"
import { toast } from "sonner"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null)  
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      try {
        const result = await getAdminStats()
        if (result.success) {
          setStats(result.data)
        } else {
          toast.error(result.message || "Failed to load stats")
          setStats(null)
        }
      } catch (error) {
        toast.error("Failed to load dashboard")
        setStats(null)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and statistics</p>
      </div>

      <AdminStats stats={stats} isLoading={loading} />
    </div>
  )
}