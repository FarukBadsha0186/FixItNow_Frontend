"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// ✅ Import actions
import {
  acceptBooking,
  declineBooking,
  markInProgress,
  markCompleted,
} from "../technician_action/bookings"

export type FilterStatus = 'ALL' | 'REQUESTED' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED'

export interface BookingsPageProps {
  bookings: Array<{
    id: string
    scheduledAt: string
    address: string
    notes: string | null
    status: 'REQUESTED' | 'ACCEPTED' | 'DECLINED' | 'PAID' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
    totalAmount: number
    customer: { name: string; email: string }
    service: { title: string }
  }>
  onUpdateStatus: (bookingId: string, status: string) => Promise<void>
  onFilterChange: (status: FilterStatus) => void
  currentFilter: FilterStatus
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    REQUESTED: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Requested' },
    ACCEPTED: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Accepted' },
    DECLINED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Declined' },
    PAID: { bg: 'bg-green-100', text: 'text-green-800', label: 'Paid' },
    IN_PROGRESS: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'In Progress' },
    COMPLETED: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Completed' },
    CANCELLED: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Cancelled' },
  }

  const config = statusConfig[status] || statusConfig.REQUESTED
  return <Badge className={`${config.bg} ${config.text}`}>{config.label}</Badge>
}

export function BookingsPage({
  bookings,
  onUpdateStatus,
  onFilterChange,
  currentFilter
}: BookingsPageProps) {
  const router = useRouter()
  const [loadingBookingId, setLoadingBookingId] = useState<string | null>(null)
  const [actionDialog, setActionDialog] = useState<{
    open: boolean
    bookingId: string
    action: string
    title: string
    description: string
  }>({
    open: false,
    bookingId: '',
    action: '',
    title: '',
    description: '',
  })

  // ✅ Handle Accept
  const handleAccept = async (bookingId: string) => {
    setLoadingBookingId(bookingId)
    try {
      const result = await acceptBooking(bookingId)
      if (result.success) {
        toast.success(result.message || "Booking accepted")
        router.refresh()
        onFilterChange(currentFilter)
      } else {
        toast.error(result.message || "Failed to accept")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoadingBookingId(null)
      setActionDialog({ ...actionDialog, open: false })
    }
  }

  // ✅ Handle Decline
  const handleDecline = async (bookingId: string) => {
    setLoadingBookingId(bookingId)
    try {
      const result = await declineBooking(bookingId)
      if (result.success) {
        toast.success(result.message || "Booking declined")
        router.refresh()
        onFilterChange(currentFilter)
      } else {
        toast.error(result.message || "Failed to decline")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoadingBookingId(null)
      setActionDialog({ ...actionDialog, open: false })
    }
  }

  // ✅ Handle Start Job (Mark In-Progress)
  const handleStartJob = async (bookingId: string) => {
    setLoadingBookingId(bookingId)
    try {
      const result = await markInProgress(bookingId)
      if (result.success) {
        toast.success(result.message || "Job started")
        router.refresh()
        onFilterChange(currentFilter)
      } else {
        toast.error(result.message || "Failed to start job")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoadingBookingId(null)
    }
  }

  // ✅ Handle Complete
  const handleComplete = async (bookingId: string) => {
    setLoadingBookingId(bookingId)
    try {
      const result = await markCompleted(bookingId)
      if (result.success) {
        toast.success(result.message || "Job completed")
        router.refresh()
        onFilterChange(currentFilter)
      } else {
        toast.error(result.message || "Failed to complete")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoadingBookingId(null)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const openActionDialog = (booking: any, action: string) => {
    const configs: Record<string, { title: string; description: string }> = {
      ACCEPTED: {
        title: 'Accept Booking',
        description: `Are you sure you want to accept this booking from ${booking.customer.name}?`
      },
      DECLINED: {
        title: 'Decline Booking',
        description: `Are you sure you want to decline this booking from ${booking.customer.name}?`
      },
      IN_PROGRESS: {
        title: 'Start Job',
        description: `Are you sure you want to mark this job as in-progress?`
      },
      COMPLETED: {
        title: 'Complete Job',
        description: `Are you sure you want to mark this job as completed?`
      }
    }

    const config = configs[action]
    if (config) {
      setActionDialog({
        open: true,
        bookingId: booking.id,
        action,
        title: config.title,
        description: config.description,
      })
    }
  }

  // ✅ Updated getActionButtons with real actions
  const getActionButtons = (booking: any) => {
    if (booking.status === 'REQUESTED') {
      return (
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => openActionDialog(booking, 'ACCEPTED')}
            disabled={loadingBookingId === booking.id}
            className="bg-green-600 hover:bg-green-700"
          >
            {loadingBookingId === booking.id && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
            Accept
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => openActionDialog(booking, 'DECLINED')}
            disabled={loadingBookingId === booking.id}
            className="text-red-600 hover:text-red-700"
          >
            Decline
          </Button>
        </div>
      )
    } else if (booking.status === 'PAID') {
      return (
        <Button
          size="sm"
          onClick={() => openActionDialog(booking, 'IN_PROGRESS')}
          disabled={loadingBookingId === booking.id}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loadingBookingId === booking.id && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
          Start Job
        </Button>
      )
    } else if (booking.status === 'IN_PROGRESS') {
      return (
        <Button
          size="sm"
          onClick={() => openActionDialog(booking, 'COMPLETED')}
          disabled={loadingBookingId === booking.id}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {loadingBookingId === booking.id && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
          Mark Complete
        </Button>
      )
    }
    return <span className="text-sm text-muted-foreground">—</span>
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Bookings</h1>
          <p className="text-muted-foreground">View and manage all your bookings</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {bookings.length} bookings
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onFilterChange(currentFilter)}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-4">
        {(['ALL', 'REQUESTED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED'] as const).map((status) => (
          <button
            key={status}
            onClick={() => onFilterChange(status)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              currentFilter === status
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {status === 'ALL' ? 'All Bookings' : status.replace('_', ' ')}
            {status !== 'ALL' && (
              <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">
                {bookings.filter((b) => b.status === status).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card py-12">
          <p className="text-lg text-muted-foreground">No bookings found</p>
          <p className="text-sm text-muted-foreground">Try changing your filter</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-6 py-4 text-left font-semibold text-foreground">Customer</th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">Service</th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">Scheduled</th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">Address</th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">Amount</th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-foreground">{booking.customer.name}</p>
                      <p className="text-xs text-muted-foreground">{booking.customer.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground">{booking.service.title}</td>
                  <td className="px-6 py-4 text-foreground">{formatDate(booking.scheduledAt)}</td>
                  <td className="px-6 py-4 text-foreground">{booking.address}</td>
                  <td className="px-6 py-4 font-semibold text-foreground">${booking.totalAmount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-6 py-4">{getActionButtons(booking)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Action Confirmation Dialog */}
      <AlertDialog
        open={actionDialog.open}
        onOpenChange={(open) => setActionDialog({ ...actionDialog, open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{actionDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>{actionDialog.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (actionDialog.action === 'ACCEPTED') handleAccept(actionDialog.bookingId)
                else if (actionDialog.action === 'DECLINED') handleDecline(actionDialog.bookingId)
                else if (actionDialog.action === 'IN_PROGRESS') handleStartJob(actionDialog.bookingId)
                else if (actionDialog.action === 'COMPLETED') handleComplete(actionDialog.bookingId)
              }}
              className={
                actionDialog.action === 'DECLINED'
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-green-600 hover:bg-green-700'
              }
            >
              {loadingBookingId === actionDialog.bookingId && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}