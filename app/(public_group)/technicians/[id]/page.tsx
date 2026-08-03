import { getTechnician } from '../../_public_action/action'
import { TechnicianProfile } from '../../_public_components/public_components'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function TechnicianProfilePage({ params }: { params: { id: string } }) {
 

  const { id } = await params
  const data = await getTechnician(id)
 

  
  if (!data?.data) {
    notFound()
  }

  // ✅ Check login status for Book Now button
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  const isLoggedIn = !!token

  return (
    <TechnicianProfile 
      technician={data.data} 
      reviews={data.reviews || []} 
      isLoggedIn={isLoggedIn}   
    />
  )
}