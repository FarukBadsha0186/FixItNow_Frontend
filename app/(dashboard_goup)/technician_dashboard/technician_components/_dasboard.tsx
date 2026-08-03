'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { toast } from "sonner"
import { acceptBooking, declineBooking, markInProgress, markCompleted } from "../technician_action/bookings"
import {
  Clock,
  Calendar,
  CheckCircle,
  DollarSign,
  Star,
  MapPin,
  Briefcase,
  ArrowRight,
  Loader2,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

// ============================================
// TYPES
// ============================================
export interface DashboardOverviewProps {
  profile: {
    id: string
    bio: string | null
    experience: number
    hourlyRate: number
    location: string | null
    avgRating: number
    totalReviews: number
    isAvailable: boolean
      profilePicture?: string | null  
    user: { name: string; email: string; phone?: string | null }
  }
  stats: {
    pendingRequests: number
    upcomingJobs: number
    completedJobs: number
    totalEarnings: number
  }
  recentBookings: Array<{
    id: string
    scheduledAt: string
    address: string
    status: 'REQUESTED' | 'ACCEPTED' | 'DECLINED' | 'PAID' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
    totalAmount: number
    customer: { name: string; email: string }
    service: { title: string }
  }>
}

// ============================================
// STAT CARD COMPONENT
// ============================================
const StatCard = ({ icon: Icon, label, value, color }: any) => (
  <div className="rounded-lg border border-border bg-card p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
      </div>
      <div className={`rounded-lg p-3 ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  </div>
)

// ============================================
// STATUS BADGE COMPONENT
// ============================================
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

// ============================================
// EDIT PROFILE DIALOG COMPONENT
// ============================================
const EditProfileDialog = ({
  open,
  onOpenChange,
  profile,
  onSave,
  isLoading,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile: DashboardOverviewProps['profile']
  onSave: (data: any) => Promise<void>
  isLoading: boolean
}) => {
  const [formData, setFormData] = useState({
    bio: profile.bio || '',
    experience: profile.experience,
    hourlyRate: profile.hourlyRate,
    location: profile.location || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSave(formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Bio</label>
            <textarea
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              rows={3}
              placeholder="Tell us about yourself"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Experience (years)</label>
            <input
              type="number"
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              min="0"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Hourly Rate ($)</label>
            <input
              type="number"
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              min="0"
              step="0.01"
              value={formData.hourlyRate}
              onChange={(e) => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) })}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Location</label>
            <input
              type="text"
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="City, State"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================
export function DashboardOverview({
  profile,
  stats,
  recentBookings,
}: DashboardOverviewProps) {
  const router = useRouter()
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [loadingBookingId, setLoadingBookingId] = useState<string | null>(null)

  // ✅ Accept Handler
  const handleAccept = async (bookingId: string) => {
    setLoadingBookingId(bookingId)
    try {
      const result = await acceptBooking(bookingId)
      if (result.success) {
        toast.success(result.message || "Booking accepted")
        router.refresh()
      } else {
        toast.error(result.message || "Failed to accept")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoadingBookingId(null)
    }
  }

  // ✅ Decline Handler
  const handleDecline = async (bookingId: string) => {
    setLoadingBookingId(bookingId)
    try {
      const result = await declineBooking(bookingId)
      if (result.success) {
        toast.success(result.message || "Booking declined")
        router.refresh()
      } else {
        toast.error(result.message || "Failed to decline")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoadingBookingId(null)
    }
  }

  // ✅ Start Job Handler
  const handleStartJob = async (bookingId: string) => {
    setLoadingBookingId(bookingId)
    try {
      const result = await markInProgress(bookingId)
      if (result.success) {
        toast.success(result.message || "Job started")
        router.refresh()
      } else {
        toast.error(result.message || "Failed to start job")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoadingBookingId(null)
    }
  }

  // ✅ Complete Handler
  const handleComplete = async (bookingId: string) => {
    setLoadingBookingId(bookingId)
    try {
      const result = await markCompleted(bookingId)
      if (result.success) {
        toast.success(result.message || "Job completed")
        router.refresh()
      } else {
        toast.error(result.message || "Failed to complete")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoadingBookingId(null)
    }
  }

  // ✅ Update Profile Handler
  const handleUpdateProfile = async (data: any) => {
    setIsUpdatingProfile(true)
    try {
      // TODO: Call your update profile API
      console.log('Profile updated:', data)
      toast.success("Profile updated successfully")
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  // ✅ Format Date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  // ✅ Get Action Buttons with Real Actions
  const getActionButtons = (booking: any) => {
    if (booking.status === 'REQUESTED') {
      return (
        <div className="flex gap-2">
          <Button 
            size="sm" 
            onClick={() => handleAccept(booking.id)}
            disabled={loadingBookingId === booking.id}
            className="bg-green-600 hover:bg-green-700"
          >
            {loadingBookingId === booking.id ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              'Accept'
            )}
          </Button>

          
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDecline(booking.id)}
            disabled={loadingBookingId === booking.id}
            className="text-red-500 hover:text-red-700"
          >
            {loadingBookingId === booking.id ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              'Decline'
            )}
          </Button>
        </div>
      )



      
    } 
    
    else if (booking.status === 'ACCEPTED') {
  return (
    <Button 
          size="sm" 
          onClick={() => handleStartJob(booking.id)}
          disabled={loadingBookingId === booking.id}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loadingBookingId === booking.id ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            'Start Job'
          )}
        </Button>
  )
}
    
    
    else if (booking.status === 'PAID') {
      return (
        <Button 
          size="sm" 
          onClick={() => handleStartJob(booking.id)}
          disabled={loadingBookingId === booking.id}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loadingBookingId === booking.id ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            'Start Job'
          )}
        </Button>
      )
    } else if (booking.status === 'IN_PROGRESS') {
      return (
        <Button 
          size="sm" 
          onClick={() => handleComplete(booking.id)}
          disabled={loadingBookingId === booking.id}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {loadingBookingId === booking.id ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            'Mark Complete'
          )}
        </Button>
      )
    }
    return <span className="text-muted-foreground">—</span>
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {profile.user.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Clock}
          label="Pending Requests"
          value={stats.pendingRequests}
          color="bg-amber-100"
        />
        <StatCard
          icon={Calendar}
          label="Upcoming Jobs"
          value={stats.upcomingJobs}
          color="bg-blue-100"
        />
        <StatCard
          icon={CheckCircle}
          label="Completed Jobs"
          value={stats.completedJobs}
          color="bg-green-100"
        />
        <StatCard
          icon={DollarSign}
          label="Total Earnings"
          value={`$${stats.totalEarnings.toLocaleString()}`}
          color="bg-purple-100"
        />
      </div>

      {/* Profile and Quick Links */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        {/* <div className="rounded-lg border border-border bg-card p-6 md:col-span-2">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">My Profile</h2>
                {profile.bio && <p className="mt-2 text-sm text-muted-foreground">{profile.bio}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Hourly Rate</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    ${profile.hourlyRate.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Experience</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {profile.experience} years
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <div className="mt-1 flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-foreground">{profile.location || '—'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Rating</p>
                  <div className="mt-1 flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <p className="text-sm font-medium text-foreground">
                      {profile.avgRating.toFixed(1)} ({profile.totalReviews})
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge className={profile.isAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {profile.isAvailable ? 'Available' : 'Unavailable'}
                </Badge>
              </div>
            </div>
          </div>

          <Button className="mt-4 w-full" onClick={() => setEditDialogOpen(true)}>
            Edit Profile
          </Button>
        </div> */}
        <div className="flex items-center gap-4">
  <Avatar className="w-16 h-16">
    <AvatarImage 
      src={profile.profilePicture || "/default-avatar.png"} 
      alt={profile.user.name}
    />
    <AvatarFallback className="text-2xl bg-primary/10">
      {profile.user.name?.charAt(0) || "?"}
    </AvatarFallback>
  </Avatar>
  <div>
    <h2 className="text-lg font-semibold">{profile.user.name}</h2>
    <p className="text-sm text-muted-foreground">{profile.user.email}</p>
  </div>
</div>

        {/* Quick Links Card */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground">Quick Links</h3>
          <div className="mt-4 space-y-3">
            <Link
              href="/technician_dashboard/service"
              className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              <span>Manage Services</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link
              href="/technician_dashboard/availibility"
              className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              <span>Set Availability</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link
              href="/technician_dashboard/booking"
              className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              <span>View All Bookings</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">Recent Bookings</h2>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
                <th className="pb-3 pr-4">Customer</th>
                <th className="pb-3 px-4">Service</th>
                <th className="pb-3 px-4">Scheduled</th>
                <th className="pb-3 px-4">Amount</th>
                <th className="pb-3 px-4">Status</th>
                <th className="pb-3 pl-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.slice(0, 5).map((booking) => (
                <tr key={booking.id} className="border-b border-border hover:bg-muted/50">
                  <td className="py-4 pr-4">
                    <div>
                      <p className="font-medium text-foreground">{booking.customer.name}</p>
                      <p className="text-xs text-muted-foreground">{booking.customer.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-foreground">{booking.service.title}</td>
                  <td className="py-4 px-4 text-foreground">{formatDate(booking.scheduledAt)}</td>
                  <td className="py-4 px-4 font-semibold text-foreground">${booking.totalAmount.toFixed(2)}</td>
                  <td className="py-4 px-4">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="py-4 pl-4">{getActionButtons(booking)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-center">
          <Link
            href="/technician_dashboard/bookings"
            className="text-sm font-medium text-primary hover:underline"
          >
            View All Bookings
          </Link>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <EditProfileDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        profile={profile}
        onSave={handleUpdateProfile}
        isLoading={isUpdatingProfile}
      />
    </div>
  )
}