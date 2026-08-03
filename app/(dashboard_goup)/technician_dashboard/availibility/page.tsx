"use client"

import { useState, useEffect } from "react"
import { getAvailability, updateAvailability } from "../technician_action/availability"
import { AvailabilityPage } from "../technician_components/_availability"
import { toast } from "sonner"

export default function AvailabilityRoute() {
  const [currentSlots, setCurrentSlots] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAvailability = async () => {
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
    }
    fetchAvailability()
  }, [])

  const handleSave = async (slots: any[]) => {
    const result = await updateAvailability(slots)
    if (result.success) {
      toast.success(result.message)
      // Refresh data
      const newData = await getAvailability()
      if (newData.success) {
        setCurrentSlots(newData.data || [])
      }
    } else {
      toast.error(result.message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <p className="mt-4 text-muted-foreground">Loading availability...</p>
      </div>
    )
  }

  return <AvailabilityPage currentSlots={currentSlots} onSave={handleSave} />
}