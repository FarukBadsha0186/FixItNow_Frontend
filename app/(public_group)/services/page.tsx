


"use client"

import { useState, useEffect } from 'react'
import { getServices, getCategories } from '../../(public_group)/_public_action/action'
// ✅ Correct import
import { ServiceGrid, SearchBar, AdvancedFilters } from '../../(public_group)/_public_components/public_components'
import { toast } from 'sonner'

interface FilterState {
  location: string
  rating: string
  priceRange: string
  category: string
}

export default function ServicesPage() {
  const [services, setServices] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<FilterState>({
    location: 'all',
    rating: 'all',
    priceRange: 'all',
    category: 'all',
  })

  const fetchData = async () => {
    setLoading(true)
    try {
      const [servicesData, categoriesData] = await Promise.all([
        getServices({
          search: searchTerm || undefined,
          category: filters.category !== 'all' ? filters.category : undefined,
          location: filters.location !== 'all' ? filters.location : undefined,
          rating: filters.rating !== 'all' ? filters.rating : undefined,
          priceRange: filters.priceRange !== 'all' ? filters.priceRange : undefined,
        }),
        getCategories(),
      ])

      setServices(servicesData?.data || [])
      setCategories(categoriesData?.data || [])
    } catch (error) {
      toast.error('Failed to load services')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [searchTerm, filters])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">All Services</h1>
        <p className="text-muted-foreground mt-2">
          Browse our services and book trusted professionals
        </p>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <SearchBar onSearch={handleSearch} placeholder="Search services..." className="flex-1" />
        </div>
        <AdvancedFilters 
          categories={categories} 
          onFilterChange={handleFilterChange}
          initialFilters={filters}
        />
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground mb-4">
        Showing {services.length} services
      </div>

      <ServiceGrid services={services} isLoading={loading} />
    </div>
  )
}