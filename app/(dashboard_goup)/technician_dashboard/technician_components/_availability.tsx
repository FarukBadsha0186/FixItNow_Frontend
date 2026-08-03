"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

interface AvailabilityPageProps {
  currentSlots: Array<{ dayOfWeek: number; startTime: string; endTime: string }>
  onSave: (slots: Array<{ dayOfWeek: number; startTime: string; endTime: string }>) => Promise<void>
}

export function AvailabilityPage({ currentSlots, onSave }: AvailabilityPageProps) {
  const [isSaving, setIsSaving] = useState(false)

  // Initialize slots for all days
  const [daySlots, setDaySlots] = useState(() => {
    return DAYS.map((_, index) => {
      const slot = currentSlots.find((s) => s.dayOfWeek === index)
      return {
        dayOfWeek: index,
        enabled: !!slot,
        startTime: slot?.startTime || "09:00",
        endTime: slot?.endTime || "17:00",
      }
    })
  })

  const handleDayToggle = (dayIndex: number) => {
    setDaySlots((prev) =>
      prev.map((day) =>
        day.dayOfWeek === dayIndex ? { ...day, enabled: !day.enabled } : day
      )
    )
  }

  const handleTimeChange = (dayIndex: number, field: "startTime" | "endTime", value: string) => {
    setDaySlots((prev) =>
      prev.map((day) =>
        day.dayOfWeek === dayIndex ? { ...day, [field]: value } : day
      )
    )
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const slotsToSave = daySlots
        .filter((day) => day.enabled)
        .map(({ dayOfWeek, startTime, endTime }) => ({
          dayOfWeek,
          startTime,
          endTime,
        }))
      await onSave(slotsToSave)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Set Your Availability</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {daySlots.map((day) => (
            <div key={day.dayOfWeek} className="flex flex-col gap-3 border-b pb-4 last:border-0">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">{DAYS[day.dayOfWeek]}</Label>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    {day.enabled ? "Available" : "Unavailable"}
                  </span>
                  <Switch
                    checked={day.enabled}
                    onCheckedChange={() => handleDayToggle(day.dayOfWeek)}
                  />
                </div>
              </div>

              {day.enabled && (
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label className="text-xs">Start Time</Label>
                    <input
                      type="time"
                      className="mt-1 w-full rounded-lg border p-2"
                      value={day.startTime}
                      onChange={(e) => handleTimeChange(day.dayOfWeek, "startTime", e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs">End Time</Label>
                    <input
                      type="time"
                      className="mt-1 w-full rounded-lg border p-2"
                      value={day.endTime}
                      onChange={(e) => handleTimeChange(day.dayOfWeek, "endTime", e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          <Button onClick={handleSave} className="w-full" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Availability"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}