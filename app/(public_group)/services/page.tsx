
"use client"

import { useState, useEffect } from 'react'
import { getCategories } from '../../(public_group)/_public_action/action'
import { SearchBar, AdvancedFilters } from '../../(public_group)/_public_components/public_components'
import { toast } from 'sonner'

interface FilterState {
  location: string
  rating: string
  priceRange: string
  category: string
}

export default function ServicesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
    location: 'all',
    rating: 'all',
    priceRange: 'all',
    category: 'all',
  })

  const fetchData = async () => {
    setLoading(true)
    try {
      const categoriesData = await getCategories()
      setCategories(categoriesData?.data || [])
    } catch (error) {
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Services by Category</h1>
        <p className="text-muted-foreground mt-2">
          Browse our services by category
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <AdvancedFilters 
          categories={categories} 
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* Categories List */}
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories?.map((category) => (
            <div key={category} className="p-4 border rounded-lg hover:shadow-lg transition">
              <h3 className="text-lg font-semibold">{category}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}