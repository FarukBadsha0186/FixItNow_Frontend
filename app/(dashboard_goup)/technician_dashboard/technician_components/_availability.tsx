"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Clock, CalendarDays, Check, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

interface AvailabilityPageProps {
  currentSlots: Array<{ dayOfWeek: number; startTime: string; endTime: string }>
  onSave: (slots: Array<{ dayOfWeek: number; startTime: string; endTime: string }>) => Promise<void>
  isLoading?: boolean
}

export function AvailabilityPage({ currentSlots, onSave, isLoading = false }: AvailabilityPageProps) {
  const [isSaving, setIsSaving] = useState(false)
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

  //  Sync when currentSlots changes
  useEffect(() => {
    setDaySlots((prev) =>
      DAYS.map((_, index) => {
        const slot = currentSlots.find((s) => s.dayOfWeek === index)
        return {
          dayOfWeek: index,
          enabled: !!slot,
          startTime: slot?.startTime || prev[index]?.startTime || "09:00",
          endTime: slot?.endTime || prev[index]?.endTime || "17:00",
        }
      })
    )
  }, [currentSlots])

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
    //  Validate
    const invalidSlots = daySlots.filter(
      (day) => day.enabled && day.startTime >= day.endTime
    )
    
    if (invalidSlots.length > 0) {
      toast.error("Start time must be before end time for all enabled days")
      return
    }

    const enabledSlots = daySlots.filter((day) => day.enabled)
    if (enabledSlots.length === 0) {
      toast.error("Please enable at least one day")
      return
    }

    setIsSaving(true)
    try {
      const slotsToSave = enabledSlots.map(({ dayOfWeek, startTime, endTime }) => ({
        dayOfWeek: Number(dayOfWeek),
        startTime,
        endTime,
      }))
      await onSave(slotsToSave)
    } finally {
      setIsSaving(false)
    }
  }

  const enabledCount = daySlots.filter((d) => d.enabled).length

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Availability</h1>
          <p className="text-muted-foreground">
            Set your working hours for each day of the week
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{enabledCount} days available</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            Working Hours
          </CardTitle>
          <CardDescription>
            Toggle days on/off and set your preferred working hours
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {daySlots.map((day) => (
            <div 
              key={day.dayOfWeek} 
              className={`flex flex-col gap-3 border-b pb-4 last:border-0 transition-colors ${
                day.enabled ? "bg-green-50/50 -mx-4 px-4 py-2 rounded-lg border-green-200" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium flex items-center gap-2">
                  {day.enabled ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-gray-300" />
                  )}
                  {DAYS[day.dayOfWeek]}
                </Label>
                <div className="flex items-center gap-3">
                  <span className={`text-sm ${day.enabled ? "text-green-600" : "text-muted-foreground"}`}>
                    {day.enabled ? "Available" : "Unavailable"}
                  </span>
                  <Switch
                    checked={day.enabled}
                    onCheckedChange={() => handleDayToggle(day.dayOfWeek)}
                  />
                </div>
              </div>

              {day.enabled && (
                <div className="flex gap-4 ml-6">
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Start Time</Label>
                    <Input
                      type="time"
                      className="mt-1"
                      value={day.startTime}
                      onChange={(e) => handleTimeChange(day.dayOfWeek, "startTime", e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">End Time</Label>
                    <Input
                      type="time"
                      className="mt-1"
                      value={day.endTime}
                      onChange={(e) => handleTimeChange(day.dayOfWeek, "endTime", e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          <Button 
            onClick={handleSave} 
            className="w-full mt-4" 
            disabled={isSaving || isLoading}
          >
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