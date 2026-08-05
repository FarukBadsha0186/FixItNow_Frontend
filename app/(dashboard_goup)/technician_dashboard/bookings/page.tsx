
// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { 
//   getBookings, 
//   acceptBooking, 
//   declineBooking,
//   markInProgress,
//   markCompleted 
// } from "../technician_action/bookings"
// import { toast } from "sonner"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { ArrowLeft, Loader2, CheckCircle, XCircle, PlayCircle, CheckCircle2 } from "lucide-react"
// import { Badge } from "@/components/ui/badge"

// export default function TechnicianBookingsPage() {
//   const router = useRouter()
//   const [bookings, setBookings] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)
//   const [processingId, setProcessingId] = useState<string | null>(null)
//   const [refreshKey, setRefreshKey] = useState(0) // ✅ Force Refresh

//   const fetchBookings = async () => {
//     setLoading(true)
//     try {
//       const result = await getBookings()
//       if (result.success) {
//         setBookings(result.data || [])
//       } else {
//         toast.error(result.message || "Failed to load bookings")
//       }
//     } catch (error) {
//       toast.error("Failed to load bookings")
//     } finally {
//       setLoading(false)
//     }
//   }

//   // ✅ Effect trigger on refreshKey change
//   useEffect(() => {
//     fetchBookings()
//   }, [refreshKey])

//   // ✅ Common function for refresh
//   const refreshData = async () => {
//     router.refresh() // Next.js Router Refresh
//     setRefreshKey(prev => prev + 1) // Force Re-render
//     await fetchBookings() // Manual Fetch
//   }

//   const handleAccept = async (bookingId: string) => {
//     setProcessingId(bookingId)
//     try {
//       const result = await acceptBooking(bookingId)
//       if (result.success) {
//         toast.success(result.message || "Booking accepted")
//         await refreshData() // ✅ Refresh all
//       } else {
//         toast.error(result.message || "Failed to accept")
//       }
//     } catch (error) {
//       toast.error("Something went wrong")
//     } finally {
//       setProcessingId(null)
//     }
//   }

//   const handleDecline = async (bookingId: string) => {
//     setProcessingId(bookingId)
//     try {
//       const result = await declineBooking(bookingId)
//       if (result.success) {
//         toast.success(result.message || "Booking declined")
//         await refreshData()
//       } else {
//         toast.error(result.message || "Failed to decline")
//       }
//     } catch (error) {
//       toast.error("Something went wrong")
//     } finally {
//       setProcessingId(null)
//     }
//   }

//   const handleStartJob = async (bookingId: string) => {
//     setProcessingId(bookingId)
//     try {
//       const result = await markInProgress(bookingId)
//       if (result.success) {
//         toast.success(result.message || "Job started")
//         await refreshData()
//       } else {
//         toast.error(result.message || "Failed to start job")
//       }
//     } catch (error) {
//       toast.error("Something went wrong")
//     } finally {
//       setProcessingId(null)
//     }
//   }

//   const handleComplete = async (bookingId: string) => {
//     setProcessingId(bookingId)
//     try {
//       const result = await markCompleted(bookingId)
//       if (result.success) {
//         toast.success(result.message || "Job completed")
//         await refreshData()
//       } else {
//         toast.error(result.message || "Failed to complete")
//       }
//     } catch (error) {
//       toast.error("Something went wrong")
//     } finally {
//       setProcessingId(null)
//     }
//   }

//   const statusColors: Record<string, string> = {
//     REQUESTED: "bg-yellow-100 text-yellow-800",
//     ACCEPTED: "bg-blue-100 text-blue-800",
//     DECLINED: "bg-red-100 text-red-800",
//     PAID: "bg-green-100 text-green-800",
//     IN_PROGRESS: "bg-purple-100 text-purple-800",
//     COMPLETED: "bg-emerald-100 text-emerald-800",
//     CANCELLED: "bg-gray-100 text-gray-800",
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <Loader2 className="h-8 w-8 animate-spin text-primary" />
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6 p-6">
//       <div className="flex items-center gap-4">
//         <Button 
//           variant="ghost" 
//           size="sm" 
//           onClick={() => router.push("/technician_dashboard/dashboard")}
//           type="button"
//         >
//           <ArrowLeft className="h-4 w-4 mr-1" />
//           Back
//         </Button>
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">All Bookings</h1>
//           <p className="text-muted-foreground">View and manage all your bookings</p>
//         </div>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Booking Management</CardTitle>
//           <CardDescription>All your bookings in one place</CardDescription>
//         </CardHeader>
//         <CardContent>
//           {bookings.length === 0 ? (
//             <div className="text-center py-8 text-muted-foreground">No bookings found.</div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="border-b border-border">
//                     <th className="text-left py-3 px-4">#</th>
//                     <th className="text-left py-3 px-4">Customer</th>
//                     <th className="text-left py-3 px-4">Service</th>
//                     <th className="text-left py-3 px-4">Date</th>
//                     <th className="text-left py-3 px-4">Amount</th>
//                     <th className="text-left py-3 px-4">Status</th>
//                     <th className="text-left py-3 px-4">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {bookings.map((booking: any, index: number) => (
//                     <tr key={`${booking.id}-${refreshKey}`} className="border-b border-border hover:bg-gray-50">
//                       <td className="py-3 px-4 text-xs text-gray-400">{index + 1}</td>
//                       <td className="py-3 px-4">{booking.customer?.name || "N/A"}</td>
//                       <td className="py-3 px-4">{booking.service?.title || "N/A"}</td>
//                       <td className="py-3 px-4">
//                         {new Date(booking.scheduledAt).toLocaleDateString()}
//                       </td>
//                       <td className="py-3 px-4">${booking.totalAmount?.toFixed(2) || "0.00"}</td>
//                       <td className="py-3 px-4">
//                         <Badge className={statusColors[booking.status] || "bg-gray-100"}>
//                           {booking.status}
//                         </Badge>
//                       </td>
//                       <td className="py-3 px-4">
//                         <div className="flex gap-2 flex-wrap">
//                           {/* ✅ REQUESTED → Accept / Decline */}
//                           {booking.status === 'REQUESTED' && (
//                             <>
//                               <Button
//                                 type="button"
//                                 size="sm"
//                                 className="bg-green-600 hover:bg-green-700 text-white"
//                                 onClick={() => handleAccept(booking.id)}
//                                 disabled={processingId === booking.id}
//                               >
//                                 {processingId === booking.id ? (
//                                   <Loader2 className="h-4 w-4 animate-spin" />
//                                 ) : (
//                                   <CheckCircle className="h-4 w-4 mr-1" />
//                                 )}
//                                 Accept
//                               </Button>
//                               <Button
//                                 type="button"
//                                 size="sm"
//                                 variant="destructive"
//                                 onClick={() => handleDecline(booking.id)}
//                                 disabled={processingId === booking.id}
//                               >
//                                 {processingId === booking.id ? (
//                                   <Loader2 className="h-4 w-4 animate-spin" />
//                                 ) : (
//                                   <XCircle className="h-4 w-4 mr-1" />
//                                 )}
//                                 Decline
//                               </Button>
//                             </>
//                           )}

//                           {/* ✅ PAID → Start Job */}
//                           {booking.status === 'PAID' && (
//                             <Button
//                               type="button"
//                               size="sm"
//                               className="bg-purple-600 hover:bg-purple-700 text-white"
//                               onClick={() => handleStartJob(booking.id)}
//                               disabled={processingId === booking.id}
//                             >
//                               {processingId === booking.id ? (
//                                 <Loader2 className="h-4 w-4 animate-spin" />
//                               ) : (
//                                 <PlayCircle className="h-4 w-4 mr-1" />
//                               )}
//                               Start Job
//                             </Button>
//                           )}

//                           {/* ✅ IN_PROGRESS → Complete */}
//                           {booking.status === 'IN_PROGRESS' && (
//                             <Button
//                               type="button"
//                               size="sm"
//                               className="bg-emerald-600 hover:bg-emerald-700 text-white"
//                               onClick={() => handleComplete(booking.id)}
//                               disabled={processingId === booking.id}
//                             >
//                               {processingId === booking.id ? (
//                                 <Loader2 className="h-4 w-4 animate-spin" />
//                               ) : (
//                                 <CheckCircle2 className="h-4 w-4 mr-1" />
//                               )}
//                               Complete
//                             </Button>
//                           )}

//                           {/* ✅ COMPLETED → No Button */}
//                           {booking.status === 'COMPLETED' && (
//                             <Badge className="bg-emerald-100 text-emerald-800">
//                               Completed ✅
//                             </Badge>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  getBookings, 
  acceptBooking, 
  declineBooking,
  markInProgress,
  markCompleted 
} from "../technician_action/bookings"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, CheckCircle, XCircle, PlayCircle, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function TechnicianBookingsPage({ initialBookings = [] }: { initialBookings?: any[] }) {
  const router = useRouter()
  const [bookings, setBookings] = useState<any[]>(initialBookings)
  const [loading, setLoading] = useState(false)
  const [processingId, setProcessingId] = useState<string | null>(null)

  // ✅ Optimistic Update Handler
  const handleStatusChange = async (bookingId: string, newStatus: string, action: () => Promise<any>) => {
    setProcessingId(bookingId)
    
    // ✅ 1. Find booking
    const bookingIndex = bookings.findIndex(b => b.id === bookingId)
    if (bookingIndex === -1) return

    // ✅ 2. Store original for rollback
    const originalBooking = bookings[bookingIndex]

    // ✅ 3. Optimistic update - immediately change UI
    const updatedBookings = [...bookings]
    updatedBookings[bookingIndex] = { ...originalBooking, status: newStatus }
    setBookings(updatedBookings)

    try {
      // ✅ 4. Call server action
      const result = await action()

      if (result.success) {
        toast.success(result.message || "Updated successfully")
        // ✅ 5. Hard refresh for safety
        setTimeout(() => {
          router.refresh()
        }, 500)
      } else {
        // ✅ 6. Rollback on error
        setBookings(bookings)
        toast.error(result.message || "Failed to update")
      }
    } catch (error) {
      // ✅ 7. Rollback on catch
      setBookings(bookings)
      toast.error("Something went wrong")
    } finally {
      setProcessingId(null)
    }
  }

  const handleAccept = (bookingId: string) => {
    handleStatusChange(bookingId, "ACCEPTED", () => acceptBooking(bookingId))
  }

  const handleDecline = (bookingId: string) => {
    handleStatusChange(bookingId, "DECLINED", () => declineBooking(bookingId))
  }

  const handleStartJob = (bookingId: string) => {
    handleStatusChange(bookingId, "IN_PROGRESS", () => markInProgress(bookingId))
  }

  const handleComplete = (bookingId: string) => {
    handleStatusChange(bookingId, "COMPLETED", () => markCompleted(bookingId))
  }

  const statusColors: Record<string, string> = {
    REQUESTED: "bg-yellow-100 text-yellow-800",
    ACCEPTED: "bg-blue-100 text-blue-800",
    DECLINED: "bg-red-100 text-red-800",
    PAID: "bg-green-100 text-green-800",
    IN_PROGRESS: "bg-purple-100 text-purple-800",
    COMPLETED: "bg-emerald-100 text-emerald-800",
    CANCELLED: "bg-gray-100 text-gray-800",
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.push("/technician_dashboard")}
          type="button"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">All Bookings</h1>
          <p className="text-muted-foreground">View and manage all your bookings</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Booking Management</CardTitle>
          <CardDescription>All your bookings in one place</CardDescription>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No bookings found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4">#</th>
                    <th className="text-left py-3 px-4">Customer</th>
                    <th className="text-left py-3 px-4">Service</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking: any, index: number) => (
                    <tr key={booking.id} className="border-b border-border hover:bg-gray-50">
                      <td className="py-3 px-4 text-xs text-gray-400">{index + 1}</td>
                      <td className="py-3 px-4">{booking.customer?.name || "N/A"}</td>
                      <td className="py-3 px-4">{booking.service?.title || "N/A"}</td>
                      <td className="py-3 px-4">
                        {new Date(booking.scheduledAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">${booking.totalAmount?.toFixed(2) || "0.00"}</td>
                      <td className="py-3 px-4">
                        <Badge className={statusColors[booking.status] || "bg-gray-100"}>
                          {booking.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 flex-wrap">
                          {booking.status === 'REQUESTED' && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleAccept(booking.id)}
                                disabled={processingId === booking.id}
                              >
                                {processingId === booking.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                )}
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDecline(booking.id)}
                                disabled={processingId === booking.id}
                              >
                                {processingId === booking.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <XCircle className="h-4 w-4 mr-1" />
                                )}
                                Decline
                              </Button>
                            </>
                          )}

                          {booking.status === 'PAID' && (
                            <Button
                              size="sm"
                              className="bg-purple-600 hover:bg-purple-700"
                              onClick={() => handleStartJob(booking.id)}
                              disabled={processingId === booking.id}
                            >
                              {processingId === booking.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <PlayCircle className="h-4 w-4 mr-1" />
                              )}
                              Start Job
                            </Button>
                          )}

                          {booking.status === 'IN_PROGRESS' && (
                            <Button
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700"
                              onClick={() => handleComplete(booking.id)}
                              disabled={processingId === booking.id}
                            >
                              {processingId === booking.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                              )}
                              Complete
                            </Button>
                          )}

                          {booking.status === 'COMPLETED' && (
                            <Badge className="bg-emerald-100 text-emerald-800">
                              Completed ✅
                            </Badge>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}