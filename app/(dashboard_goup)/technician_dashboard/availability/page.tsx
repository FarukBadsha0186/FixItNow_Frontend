"use client"

import { useState, useEffect, useCallback } from "react"
import { getAvailability, updateAvailability } from "../technician_action/availability"
import { AvailabilityPage } from "../technician_components/_availability"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function AvailabilityRoute() {
  const [currentSlots, setCurrentSlots] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAvailability = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getAvailability()
      if (result.success) {
        setCurrentSlots(result.data || [])
      } else {
        toast.error(result.message || "Failed to load availability")
      }
    } catch (error) {
      toast.error("Failed to load availability")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAvailability()
  }, [fetchAvailability])

  const handleSave = async (slots: any[]) => {
    const result = await updateAvailability(slots)
    if (result.success) {
      toast.success(result.message)
      await fetchAvailability() // ✅ Refresh after save
    } else {
      toast.error(result.message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading availability...</p>
      </div>
    )
  }

  return <AvailabilityPage currentSlots={currentSlots} onSave={handleSave} />
}