import { redirect } from 'next/navigation'

export default function TechnicianDashboardRootPage() {
  // ✅ Redirect to dashboard sub-page
  redirect('/technician_dashboard/dashboard')
}