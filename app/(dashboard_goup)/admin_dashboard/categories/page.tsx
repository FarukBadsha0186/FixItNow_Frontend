// "use client"

// import { useState, useEffect } from "react"
// import { getUsers, toggleUserStatus } from "../_actions/admin.action"
// import { UserTable } from "../_components/UserTable"
// import { toast } from "sonner"

// export default function UsersPage() {
//   const [users, setUsers] = useState([])
//   const [loading, setLoading] = useState(true)

//   const fetchUsers = async () => {
//     setLoading(true)
//     try {
//       const result = await getUsers()
//       if (result.success) {
//         setUsers(result.data || [])
//       } else {
//         toast.error(result.message || "Failed to load users")
//       }
//     } catch (error) {
//       toast.error("Failed to load users")
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchUsers()
//   }, [])

//   const handleToggleStatus = async (userId: string, action: "ACTIVE" | "BANNED") => {
//     const result = await toggleUserStatus(userId, action)
//     if (result.success) {
//       toast.success(result.message)
//       await fetchUsers()
//     } else {
//       toast.error(result.message)
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold text-foreground">User Management</h1>
//         <p className="text-muted-foreground">Manage all users and their status</p>
//       </div>

//       <UserTable
//         users={users}
//         onToggleStatus={handleToggleStatus}
//         isLoading={loading}
//       />
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { 
  getAdminCategories, 
  createCategory, 
  updateCategory
} from "../_actions/admin.action"
import { CategoryManager } from "../_components/CategoryManager"
import { toast } from "sonner"

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const result = await getAdminCategories()
      if (result.success) {
        setCategories(result.data || [])
      } else {
        toast.error(result.message || "Failed to load categories")
      }
    } catch (error) {
      toast.error("Failed to load categories")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleCreate = async (data: { name: string; description: string }) => {
    const result = await createCategory(data)
    if (result.success) {
      toast.success(result.message)
      await fetchCategories()
    } else {
      toast.error(result.message)
    }
  }

  const handleUpdate = async (id: string, data: { name: string; description: string }) => {
    const result = await updateCategory(id, data)
    if (result.success) {
      toast.success(result.message)
      await fetchCategories()
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Category Management</h1>
        <p className="text-muted-foreground">Manage service categories</p>
      </div>

      <CategoryManager
        categories={categories}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        isLoading={loading}
      />
    </div>
  )
}