

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