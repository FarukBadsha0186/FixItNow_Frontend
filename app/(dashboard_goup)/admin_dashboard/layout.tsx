// app/(dashboard_group)/admin_dashboard/layout.tsx

import { AdminSidebar } from "./_components/AdminSidebar"
import { getMe } from "@/service/getMe"
import { redirect } from "next/navigation"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getMe()

  //  Check if user is admin
  if (!user?.success || user?.data?.role !== "ADMIN") {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar user={user.data} />
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}