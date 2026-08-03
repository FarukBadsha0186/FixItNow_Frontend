"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"  
import { Input } from "@/components/ui/input"  
import { Loader2, CreditCard, Lock, Search } from "lucide-react"  
import { toast } from "sonner"

// ============================================
// 1️⃣ PAYMENT FORM (Already exists)
// ============================================
interface PaymentFormProps {
  bookingId: string
  amount: number
  serviceName: string
  technicianName: string
  onPay: (bookingId: string) => Promise<void>
  isLoading?: boolean
}

export function PaymentForm({
  bookingId,
  amount,
  serviceName,
  technicianName,
  onPay,
  isLoading = false,
}: PaymentFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onPay(bookingId)
    } catch (error) {
      toast.error("Payment failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Payment Details
        </CardTitle>
        <CardDescription>
          Complete your payment to confirm the booking
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted p-4 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Service</span>
            <span className="font-medium">{serviceName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Technician</span>
            <span className="font-medium">{technicianName}</span>
          </div>
          <div className="flex justify-between text-sm border-t pt-2">
            <span className="font-semibold">Total Amount</span>
            <span className="font-bold text-lg text-primary">${amount.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Lock className="w-4 h-4" />
          <span>Secure payment via Stripe / SSLCommerz</span>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting || isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || isLoading}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {isSubmitting || isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Pay Now"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================
// 2️⃣ PAYMENT HISTORY (NEW - ADD THIS!)
// ============================================
interface Payment {
  id: string
  bookingId: string
  amount: number
  method: 'STRIPE' | 'SSLCOMMERZ'
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
  createdAt: string
}

interface PaymentHistoryProps {
  payments: Payment[]
  isLoading?: boolean
}

const paymentStatusConfig: Record<string, { bg: string; text: string; label: string }> = {
  PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
  COMPLETED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
  FAILED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Failed' },
  REFUNDED: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Refunded' },
}

const PaymentStatusBadge = ({ status }: { status: string }) => {
  const config = paymentStatusConfig[status] || paymentStatusConfig.PENDING
  return <Badge className={`${config.bg} ${config.text}`}>{config.label}</Badge>
}

export function PaymentHistory({ payments, isLoading = false }: PaymentHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPayments = payments.filter((payment) =>
    payment.bookingId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  if (!payments || payments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No payment history found.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search by booking ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className="px-4 py-3 text-left font-medium">Booking ID</th>
              <th className="px-4 py-3 text-left font-medium">Amount</th>
              <th className="px-4 py-3 text-left font-medium">Method</th>
              <th className="px-4 py-3 text-left font-medium">Date</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-muted-foreground">
                  No matching payments found
                </td>
              </tr>
            ) : (
              filteredPayments.map((payment) => (
                <tr key={payment.id} className="border-b border-border hover:bg-muted/50">
                  <td className="px-4 py-3 text-muted-foreground">#{payment.bookingId.slice(0, 8)}</td>
                  <td className="px-4 py-3 font-medium">${payment.amount.toFixed(2)}</td>
                  <td className="px-4 py-3">{payment.method}</td>
                  <td className="px-4 py-3">{formatDate(payment.createdAt)}</td>
                  <td className="px-4 py-3">
                    <PaymentStatusBadge status={payment.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}