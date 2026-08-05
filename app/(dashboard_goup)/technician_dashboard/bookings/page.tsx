
// // "use client"

// // import { useState, useEffect } from "react"
// // import { useRouter } from "next/navigation"
// // import { 
// //   getBookings, 
// //   acceptBooking, 
// //   declineBooking,
// //   markInProgress,
// //   markCompleted 
// // } from "../technician_action/bookings"
// // import { toast } from "sonner"
// // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// // import { Button } from "@/components/ui/button"
// // import { ArrowLeft, Loader2, CheckCircle, XCircle, PlayCircle, CheckCircle2 } from "lucide-react"
// // import { Badge } from "@/components/ui/badge"

// // export default function TechnicianBookingsPage() {
// //   const router = useRouter()
// //   const [bookings, setBookings] = useState<any[]>([])
// //   const [loading, setLoading] = useState(true)
// //   const [processingId, setProcessingId] = useState<string | null>(null)
// //   const [refreshKey, setRefreshKey] = useState(0) // ✅ Force Refresh

// //   const fetchBookings = async () => {
// //     setLoading(true)
// //     try {
// //       const result = await getBookings()
// //       if (result.success) {
// //         setBookings(result.data || [])
// //       } else {
// //         toast.error(result.message || "Failed to load bookings")
// //       }
// //     } catch (error) {
// //       toast.error("Failed to load bookings")
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   // ✅ Effect trigger on refreshKey change
// //   useEffect(() => {
// //     fetchBookings()
// //   }, [refreshKey])

// //   // ✅ Common function for refresh
// //   const refreshData = async () => {
// //     router.refresh() // Next.js Router Refresh
// //     setRefreshKey(prev => prev + 1) // Force Re-render
// //     await fetchBookings() // Manual Fetch
// //   }

// //   const handleAccept = async (bookingId: string) => {
// //     setProcessingId(bookingId)
// //     try {
// //       const result = await acceptBooking(bookingId)
// //       if (result.success) {
// //         toast.success(result.message || "Booking accepted")
// //         await refreshData() // ✅ Refresh all
// //       } else {
// //         toast.error(result.message || "Failed to accept")
// //       }
// //     } catch (error) {
// //       toast.error("Something went wrong")
// //     } finally {
// //       setProcessingId(null)
// //     }
// //   }

// //   const handleDecline = async (bookingId: string) => {
// //     setProcessingId(bookingId)
// //     try {
// //       const result = await declineBooking(bookingId)
// //       if (result.success) {
// //         toast.success(result.message || "Booking declined")
// //         await refreshData()
// //       } else {
// //         toast.error(result.message || "Failed to decline")
// //       }
// //     } catch (error) {
// //       toast.error("Something went wrong")
// //     } finally {
// //       setProcessingId(null)
// //     }
// //   }

// //   const handleStartJob = async (bookingId: string) => {
// //     setProcessingId(bookingId)
// //     try {
// //       const result = await markInProgress(bookingId)
// //       if (result.success) {
// //         toast.success(result.message || "Job started")
// //         await refreshData()
// //       } else {
// //         toast.error(result.message || "Failed to start job")
// //       }
// //     } catch (error) {
// //       toast.error("Something went wrong")
// //     } finally {
// //       setProcessingId(null)
// //     }
// //   }

// //   const handleComplete = async (bookingId: string) => {
// //     setProcessingId(bookingId)
// //     try {
// //       const result = await markCompleted(bookingId)
// //       if (result.success) {
// //         toast.success(result.message || "Job completed")
// //         await refreshData()
// //       } else {
// //         toast.error(result.message || "Failed to complete")
// //       }
// //     } catch (error) {
// //       toast.error("Something went wrong")
// //     } finally {
// //       setProcessingId(null)
// //     }
// //   }

// //   const statusColors: Record<string, string> = {
// //     REQUESTED: "bg-yellow-100 text-yellow-800",
// //     ACCEPTED: "bg-blue-100 text-blue-800",
// //     DECLINED: "bg-red-100 text-red-800",
// //     PAID: "bg-green-100 text-green-800",
// //     IN_PROGRESS: "bg-purple-100 text-purple-800",
// //     COMPLETED: "bg-emerald-100 text-emerald-800",
// //     CANCELLED: "bg-gray-100 text-gray-800",
// //   }

// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center h-64">
// //         <Loader2 className="h-8 w-8 animate-spin text-primary" />
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className="space-y-6 p-6">
// //       <div className="flex items-center gap-4">
// //         <Button 
// //           variant="ghost" 
// //           size="sm" 
// //           onClick={() => router.push("/technician_dashboard/dashboard")}
// //           type="button"
// //         >
// //           <ArrowLeft className="h-4 w-4 mr-1" />
// //           Back
// //         </Button>
// //         <div>
// //           <h1 className="text-3xl font-bold text-foreground">All Bookings</h1>
// //           <p className="text-muted-foreground">View and manage all your bookings</p>
// //         </div>
// //       </div>

// //       <Card>
// //         <CardHeader>
// //           <CardTitle>Booking Management</CardTitle>
// //           <CardDescription>All your bookings in one place</CardDescription>
// //         </CardHeader>
// //         <CardContent>
// //           {bookings.length === 0 ? (
// //             <div className="text-center py-8 text-muted-foreground">No bookings found.</div>
// //           ) : (
// //             <div className="overflow-x-auto">
// //               <table className="w-full text-sm">
// //                 <thead>
// //                   <tr className="border-b border-border">
// //                     <th className="text-left py-3 px-4">#</th>
// //                     <th className="text-left py-3 px-4">Customer</th>
// //                     <th className="text-left py-3 px-4">Service</th>
// //                     <th className="text-left py-3 px-4">Date</th>
// //                     <th className="text-left py-3 px-4">Amount</th>
// //                     <th className="text-left py-3 px-4">Status</th>
// //                     <th className="text-left py-3 px-4">Actions</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {bookings.map((booking: any, index: number) => (
// //                     <tr key={`${booking.id}-${refreshKey}`} className="border-b border-border hover:bg-gray-50">
// //                       <td className="py-3 px-4 text-xs text-gray-400">{index + 1}</td>
// //                       <td className="py-3 px-4">{booking.customer?.name || "N/A"}</td>
// //                       <td className="py-3 px-4">{booking.service?.title || "N/A"}</td>
// //                       <td className="py-3 px-4">
// //                         {new Date(booking.scheduledAt).toLocaleDateString()}
// //                       </td>
// //                       <td className="py-3 px-4">${booking.totalAmount?.toFixed(2) || "0.00"}</td>
// //                       <td className="py-3 px-4">
// //                         <Badge className={statusColors[booking.status] || "bg-gray-100"}>
// //                           {booking.status}
// //                         </Badge>
// //                       </td>
// //                       <td className="py-3 px-4">
// //                         <div className="flex gap-2 flex-wrap">
// //                           {/* ✅ REQUESTED → Accept / Decline */}
// //                           {booking.status === 'REQUESTED' && (
// //                             <>
// //                               <Button
// //                                 type="button"
// //                                 size="sm"
// //                                 className="bg-green-600 hover:bg-green-700 text-white"
// //                                 onClick={() => handleAccept(booking.id)}
// //                                 disabled={processingId === booking.id}
// //                               >
// //                                 {processingId === booking.id ? (
// //                                   <Loader2 className="h-4 w-4 animate-spin" />
// //                                 ) : (
// //                                   <CheckCircle className="h-4 w-4 mr-1" />
// //                                 )}
// //                                 Accept
// //                               </Button>
// //                               <Button
// //                                 type="button"
// //                                 size="sm"
// //                                 variant="destructive"
// //                                 onClick={() => handleDecline(booking.id)}
// //                                 disabled={processingId === booking.id}
// //                               >
// //                                 {processingId === booking.id ? (
// //                                   <Loader2 className="h-4 w-4 animate-spin" />
// //                                 ) : (
// //                                   <XCircle className="h-4 w-4 mr-1" />
// //                                 )}
// //                                 Decline
// //                               </Button>
// //                             </>
// //                           )}

// //                           {/* ✅ PAID → Start Job */}
// //                           {booking.status === 'PAID' && (
// //                             <Button
// //                               type="button"
// //                               size="sm"
// //                               className="bg-purple-600 hover:bg-purple-700 text-white"
// //                               onClick={() => handleStartJob(booking.id)}
// //                               disabled={processingId === booking.id}
// //                             >
// //                               {processingId === booking.id ? (
// //                                 <Loader2 className="h-4 w-4 animate-spin" />
// //                               ) : (
// //                                 <PlayCircle className="h-4 w-4 mr-1" />
// //                               )}
// //                               Start Job
// //                             </Button>
// //                           )}

// //                           {/* ✅ IN_PROGRESS → Complete */}
// //                           {booking.status === 'IN_PROGRESS' && (
// //                             <Button
// //                               type="button"
// //                               size="sm"
// //                               className="bg-emerald-600 hover:bg-emerald-700 text-white"
// //                               onClick={() => handleComplete(booking.id)}
// //                               disabled={processingId === booking.id}
// //                             >
// //                               {processingId === booking.id ? (
// //                                 <Loader2 className="h-4 w-4 animate-spin" />
// //                               ) : (
// //                                 <CheckCircle2 className="h-4 w-4 mr-1" />
// //                               )}
// //                               Complete
// //                             </Button>
// //                           )}

// //                           {/* ✅ COMPLETED → No Button */}
// //                           {booking.status === 'COMPLETED' && (
// //                             <Badge className="bg-emerald-100 text-emerald-800">
// //                               Completed ✅
// //                             </Badge>
// //                           )}
// //                         </div>
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>
// //           )}
// //         </CardContent>
// //       </Card>
// //     </div>
// //   )
// // }

// "use client"

// import { useState, useEffect, useCallback } from "react"
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
//   const [updateTrigger, setUpdateTrigger] = useState(0)

//   // Load bookings
//   const loadBookings = useCallback(async () => {
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
//   }, [])

//   useEffect(() => {
//     loadBookings()
//   }, [loadBookings, updateTrigger])

//   // ✅ Force refresh
//   const refreshBookings = useCallback(async () => {
//     try {
//       const result = await getBookings()
//       if (result.success) {
//         setBookings(result.data || [])
//         setUpdateTrigger(prev => prev + 1) // Force re-render
//       }
//     } catch (error) {
//       console.error("Refresh failed:", error)
//     }
//     router.refresh()
//   }, [router])

//   // ✅ Handle Accept
//   const handleAccept = async (bookingId: string) => {
//     setProcessingId(bookingId)
//     try {
//       const result = await acceptBooking(bookingId)
//       if (result.success) {
//         toast.success("Booking accepted")
//         // 🚀 OPTIMISTIC UPDATE - UI instant change
//         setBookings(prev => prev.map(b => 
//           b.id === bookingId ? { ...b, status: 'ACCEPTED' } : b
//         ))
//         // Background refresh
//         setTimeout(() => refreshBookings(), 100)
//       } else {
//         toast.error(result.message || "Failed to accept")
//       }
//     } catch (error) {
//       toast.error("Something went wrong")
//     } finally {
//       setProcessingId(null)
//     }
//   }

//   // ✅ Handle Decline
//   const handleDecline = async (bookingId: string) => {
//     setProcessingId(bookingId)
//     try {
//       const result = await declineBooking(bookingId)
//       if (result.success) {
//         toast.success("Booking declined")
//         // 🚀 OPTIMISTIC UPDATE
//         setBookings(prev => prev.map(b => 
//           b.id === bookingId ? { ...b, status: 'DECLINED' } : b
//         ))
//         setTimeout(() => refreshBookings(), 100)
//       } else {
//         toast.error(result.message || "Failed to decline")
//       }
//     } catch (error) {
//       toast.error("Something went wrong")
//     } finally {
//       setProcessingId(null)
//     }
//   }

//   // ✅ Handle Start Job
//   const handleStartJob = async (bookingId: string) => {
//     setProcessingId(bookingId)
//     try {
//       const result = await markInProgress(bookingId)
//       if (result.success) {
//         toast.success("Job started")
//         // 🚀 OPTIMISTIC UPDATE
//         setBookings(prev => prev.map(b => 
//           b.id === bookingId ? { ...b, status: 'IN_PROGRESS' } : b
//         ))
//         setTimeout(() => refreshBookings(), 100)
//       } else {
//         toast.error(result.message || "Failed to start job")
//       }
//     } catch (error) {
//       toast.error("Something went wrong")
//     } finally {
//       setProcessingId(null)
//     }
//   }

//   // ✅ Handle Complete
//   const handleComplete = async (bookingId: string) => {
//     setProcessingId(bookingId)
//     try {
//       const result = await markCompleted(bookingId)
//       if (result.success) {
//         toast.success("Job completed")
//         // 🚀 OPTIMISTIC UPDATE
//         setBookings(prev => prev.map(b => 
//           b.id === bookingId ? { ...b, status: 'COMPLETED' } : b
//         ))
//         setTimeout(() => refreshBookings(), 100)
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
//                     <tr key={booking.id} className="border-b border-border hover:bg-gray-50">
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
//                           {/* REQUESTED → Accept / Decline */}
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

//                           {/* PAID → Start Job */}
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

//                           {/* IN_PROGRESS → Complete */}
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

//                           {/* COMPLETED → Show only badge */}
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

import { useState, useEffect, useCallback } from "react"
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

export default function TechnicianBookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)

  // ✅ Load bookings on mount
  const loadBookings = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getBookings()
      if (result.success) {
        setBookings(result.data || [])
      } else {
        toast.error(result.message || "Failed to load bookings")
      }
    } catch (error) {
      toast.error("Failed to load bookings")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadBookings()
  }, [loadBookings])

  // ✅ Refresh bookings from server (WITHOUT router.refresh)
  const refreshBookings = useCallback(async () => {
    try {
      const result = await getBookings()
      if (result.success) {
        setBookings(result.data || [])
      }
    } catch (error) {
      console.error("Refresh failed:", error)
    }
  }, [])

  // ✅ Handle Accept - Optimistic Update + Server Sync
  const handleAccept = async (bookingId: string) => {
    setProcessingId(bookingId)
    
    // 🚀 STEP 1: Save old state for rollback
    const previousBookings = bookings
    
    try {
      // 🚀 STEP 2: Optimistic update - instant UI change
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: 'ACCEPTED' } : b
      ))

      // 🚀 STEP 3: Call server action
      const result = await acceptBooking(bookingId)
      
      if (result.success) {
        toast.success("Booking accepted")
        
        // 🚀 STEP 4: Wait a bit then refresh from server to sync any other changes
        setTimeout(() => {
          refreshBookings()
        }, 300)
      } else {
        // ❌ ROLLBACK on error
        setBookings(previousBookings)
        toast.error(result.message || "Failed to accept booking")
      }
    } catch (error) {
      // ❌ ROLLBACK on error
      setBookings(previousBookings)
      toast.error("Something went wrong")
      console.error(error)
    } finally {
      setProcessingId(null)
    }
  }

  // ✅ Handle Decline - Optimistic Update + Server Sync
  const handleDecline = async (bookingId: string) => {
    setProcessingId(bookingId)
    const previousBookings = bookings
    
    try {
      // 🚀 Optimistic update
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: 'DECLINED' } : b
      ))

      const result = await declineBooking(bookingId)
      
      if (result.success) {
        toast.success("Booking declined")
        setTimeout(() => {
          refreshBookings()
        }, 300)
      } else {
        setBookings(previousBookings)
        toast.error(result.message || "Failed to decline booking")
      }
    } catch (error) {
      setBookings(previousBookings)
      toast.error("Something went wrong")
      console.error(error)
    } finally {
      setProcessingId(null)
    }
  }

  // ✅ Handle Start Job - Optimistic Update + Server Sync
  const handleStartJob = async (bookingId: string) => {
    setProcessingId(bookingId)
    const previousBookings = bookings
    
    try {
      // 🚀 Optimistic update
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: 'IN_PROGRESS' } : b
      ))

      const result = await markInProgress(bookingId)
      
      if (result.success) {
        toast.success("Job started")
        setTimeout(() => {
          refreshBookings()
        }, 300)
      } else {
        setBookings(previousBookings)
        toast.error(result.message || "Failed to start job")
      }
    } catch (error) {
      setBookings(previousBookings)
      toast.error("Something went wrong")
      console.error(error)
    } finally {
      setProcessingId(null)
    }
  }

  // ✅ Handle Complete - Optimistic Update + Server Sync
  const handleComplete = async (bookingId: string) => {
    setProcessingId(bookingId)
    const previousBookings = bookings
    
    try {
      // 🚀 Optimistic update
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: 'COMPLETED' } : b
      ))

      const result = await markCompleted(bookingId)
      
      if (result.success) {
        toast.success("Job completed")
        setTimeout(() => {
          refreshBookings()
        }, 300)
      } else {
        setBookings(previousBookings)
        toast.error(result.message || "Failed to complete job")
      }
    } catch (error) {
      setBookings(previousBookings)
      toast.error("Something went wrong")
      console.error(error)
    } finally {
      setProcessingId(null)
    }
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
          onClick={() => router.push("/technician_dashboard/dashboard")}
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
                          {/* REQUESTED → Accept / Decline */}
                          {booking.status === 'REQUESTED' && (
                            <>
                              <Button
                                type="button"
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
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
                                type="button"
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

                          {/* PAID → Start Job */}
                          {booking.status === 'PAID' && (
                            <Button
                              type="button"
                              size="sm"
                              className="bg-purple-600 hover:bg-purple-700 text-white"
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

                          {/* IN_PROGRESS → Complete */}
                          {booking.status === 'IN_PROGRESS' && (
                            <Button
                              type="button"
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white"
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

                          {/* COMPLETED → Show only badge */}
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