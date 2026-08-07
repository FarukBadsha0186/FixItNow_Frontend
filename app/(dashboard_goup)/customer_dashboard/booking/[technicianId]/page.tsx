// "use client"

// import { useState, useEffect } from "react"
// import { useParams, useRouter } from "next/navigation"
// import { BookingForm } from "../../_components/bookingForm"
// import { createBooking } from "../../_customer_action/booking"
// import { getTechnician } from "@/app/(public_group)/_public_action/action"
// import { toast } from "sonner"
// import { Loader2 } from "lucide-react"

// export default function CustomerBookingPage() {
//   const params = useParams()
//   const router = useRouter()
//   const technicianId = params.technicianId as string

//   const [technician, setTechnician] = useState<any>(null)
//   const [services, setServices] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)
//   const [submitting, setSubmitting] = useState(false)

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const result = await getTechnician(technicianId)
//         if (result?.data) {
//           setTechnician(result.data)
//           setServices(result.data.services || [])
//         } else {
//           toast.error("Technician not found")
//           router.push("/technicians")
//         }
//       } catch (error) {
//         toast.error("Failed to load data")
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchData()
//   }, [technicianId, router])

//   const handleSubmit = async (data: any) => {
//     setSubmitting(true)
//     try {
//       const result = await createBooking(data)
//       if (result.success) {
//         toast.success(result.message)
//         router.push("/customer_dashboard")
//       } else {
//         toast.error(result.message)
//       }
//     } catch (error) {
//       toast.error("Something went wrong")
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh]">
//         <Loader2 className="h-8 w-8 animate-spin text-primary" />
//       </div>
//     )
//   }

//   return (
//     <div className="max-w-2xl mx-auto p-4 py-8">
//       <BookingForm
//         technicianId={technicianId}
//         technicianName={technician?.name || "Technician"}
//         services={services}
//         onSubmit={handleSubmit}
//         isLoading={submitting}
//       />
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { BookingForm } from "../../_components/bookingForm"
import { createBooking } from "../../_customer_action/booking"
import { getTechnician } from "@/app/(public_group)/_public_action/action"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function CustomerBookingPage() {
  const params = useParams()
  const router = useRouter()
  const technicianId = params.technicianId as string

  const [technician, setTechnician] = useState<any>(null)
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getTechnician(technicianId)
        if (result?.data) {
          setTechnician(result.data)
          setServices(result.data.services || [])
        } else {
          toast.error("Technician not found")
          router.push("/technicians")
        }
      } catch (error) {
        toast.error("Failed to load data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [technicianId, router])

  const handleSubmit = async (data: any) => {
    setSubmitting(true)
    try {
      const result = await createBooking({
        technicianId: technicianId,
        serviceId: data.serviceId,
        scheduledAt: data.scheduledAt,
        address: data.address,
        notes: data.notes,
      })
      
      if (result.success) {
        toast.success(result.message)
        router.push("/customer_dashboard/bookings")
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4 py-8">
      <BookingForm
        technicianId={technicianId}
        technicianName={technician?.user?.name || "Technician"}
        services={services}
        onSubmit={handleSubmit}
        isLoading={submitting}
      />
    </div>
  )
}