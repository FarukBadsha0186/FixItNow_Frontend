"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getUserBookings, cancelBooking } from './_customer_action/booking'
import { getPayments } from './_customer_action/payment'
import { PaymentHistory } from '../customer_dashboard/_components/payment'
import { BookingHistory } from '../customer_dashboard/_components/booking'  
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle, Calendar, CreditCard, Star } from 'lucide-react'

export default function CustomerDashboardPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  // ✅ Fetch data
  const fetchData = async () => {
    setLoading(true)
    try {
      const [bookingsRes, paymentsRes] = await Promise.all([
        getUserBookings(),
        getPayments()
      ])

      if (bookingsRes.success) {
        setBookings(bookingsRes.data || [])
      } else {
        toast.error(bookingsRes.message || 'Failed to load bookings')
      }

      if (paymentsRes.success) {
        setPayments(paymentsRes.data || [])
      } else {
        toast.error(paymentsRes.message || 'Failed to load payments')
      }
    } catch (error) {
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // ✅ Handle cancel booking
  const handleCancel = async (bookingId: string) => {
    const result = await cancelBooking(bookingId)
    if (result.success) {
      toast.success(result.message)
      await fetchData()
    } else {
      toast.error(result.message)
    }
  }

  // ✅ Stats calculation
  const totalBookings = bookings.length
  const pendingBookings = bookings.filter((b: any) => b.status === 'REQUESTED' || b.status === 'ACCEPTED').length
  const completedBookings = bookings.filter((b: any) => b.status === 'COMPLETED').length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      
      {/* ✅ Header with Book Now Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Customer Dashboard</h1>
          <p className="text-muted-foreground">Manage your bookings, payments, and reviews</p>
        </div>
        
        {/* ✅ Book New Service Button */}
        <Link href="/technicians">
          <Button className="gap-2 w-full sm:w-auto">
            <PlusCircle className="h-4 w-4" />
            Book New Service
          </Button>
        </Link>
      </div>

      {/* ✅ Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Bookings</p>
              <p className="text-2xl font-bold">{totalBookings}</p>
            </div>
            <Calendar className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending / Active</p>
              <p className="text-2xl font-bold">{pendingBookings}</p>
            </div>
            <Calendar className="h-8 w-8 text-yellow-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">{completedBookings}</p>
            </div>
            <Star className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>
      </div>

      {/* ✅ Tabs: Bookings + Payments */}
      <Tabs defaultValue="bookings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        {/* ✅ Bookings Tab */}
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Booking History</CardTitle>
              <CardDescription>View all your bookings and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <BookingHistory 
                bookings={bookings} 
                onCancel={handleCancel}
                isLoading={loading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ✅ Payments Tab */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>View all your payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentHistory
                payments={payments}
                isLoading={loading}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}