"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, MapPin, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Service {
  id: string
  title: string
  price: number
}

interface BookingFormProps {
  technicianId: string
  technicianName: string
  services: Service[]
  onSubmit: (data: {
    technicianId: string
    serviceId: string
    scheduledAt: string
    address: string
    notes?: string
  }) => Promise<void>
  isLoading?: boolean
}

export function BookingForm({
  technicianId,
  technicianName,
  services,
  onSubmit,
  isLoading = false,
}: BookingFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    serviceId: "",
    date: "",
    time: "",
    address: "",
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.serviceId) {
      toast.error("Please select a service")
      return
    }

    if (!formData.date) {
      toast.error("Please select a date")
      return
    }

    if (!formData.time) {
      toast.error("Please select a time")
      return
    }

    if (!formData.address.trim()) {
      toast.error("Please enter your address")
      return
    }

    const scheduledAt = `${formData.date}T${formData.time}:00`

    await onSubmit({
      technicianId,
      serviceId: formData.serviceId,
      scheduledAt,
      address: formData.address.trim(),
      notes: formData.notes.trim() || undefined,
    })
  }

  // Generate time slots (9 AM to 6 PM)
  const timeSlots = []
  for (let hour = 9; hour <= 18; hour++) {
    const time = `${hour.toString().padStart(2, "0")}:00`
    timeSlots.push(time)
  }

  // Min date = today
  const today = new Date().toISOString().split("T")[0]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Technician Name */}
      <div>
        <h2 className="text-xl font-semibold">Book with {technicianName}</h2>
        <p className="text-sm text-muted-foreground">Select service and schedule your appointment</p>
      </div>

      {/* Service Selection */}
      <div className="space-y-2">
        <Label htmlFor="service">Select Service *</Label>
        <select
          id="service"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          value={formData.serviceId}
          onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
          required
          disabled={isLoading}
        >
          <option value="">Choose a service</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.title} - ${service.price}
            </option>
          ))}
        </select>
      </div>

      {/* Date Selection */}
      <div className="space-y-2">
        <Label htmlFor="date">Select Date *</Label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="date"
            type="date"
            min={today}
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="pl-10"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Time Selection */}
      <div className="space-y-2">
        <Label>Select Time *</Label>
        <div className="grid grid-cols-4 gap-2">
          {timeSlots.map((time) => (
            <button
              key={time}
              type="button"
              className={`px-3 py-2 text-sm rounded-lg border transition ${
                formData.time === time
                  ? "bg-primary text-white border-primary"
                  : "border-border hover:bg-muted"
              }`}
              onClick={() => setFormData({ ...formData, time })}
              disabled={isLoading}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address">Service Address *</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
          <Textarea
            id="address"
            placeholder="Enter your full address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="pl-10 min-h-[80px]"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Any special instructions..."
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="min-h-[60px]"
          disabled={isLoading}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Book Now"
          )}
        </Button>
      </div>
    </form>
  )
}