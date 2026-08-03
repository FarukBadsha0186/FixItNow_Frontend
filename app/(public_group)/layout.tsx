import { Navbar } from "@/components/shared/navbar"
import { getMe } from "@/service/getMe"

export default async function PublicLayout({
    
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getMe()

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {}
      <Navbar user={user} />
      
      {/* ✅ Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {children}
      </main>
      
      {/* ✅ Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          © 2024 FixItNow. All rights reserved.
        </div>
      </footer>
    </div>
  )
}