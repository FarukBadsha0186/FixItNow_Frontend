


"use client"

import { useState, useEffect } from 'react'
import { getCategories, getServices, getTechnicians } from '../../(public_group)/_public_action/action'
import { 
  SearchBar, 
  AdvancedFilters, 
  ServiceGrid, 
  TechnicianGrid 
} from '../../(public_group)/_public_components/public_components'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from 'sonner'

interface FilterState {
  location: string
  rating: string
  priceRange: string
  category: string
  search: string
}

export default function ServicesPage() {
  // ========== STATE MANAGEMENT ==========
  const [categories, setCategories] = useState<string[]>([])
  const [services, setServices] = useState<any[]>([])
  const [technicians, setTechnicians] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("services")
  
  const [filters, setFilters] = useState<FilterState>({
    location: 'all',
    rating: 'all',
    priceRange: 'all',
    category: 'all',
    search: '',
  })

  // ========== INITIAL DATA LOAD ==========
  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    setLoading(true)
    try {
      // Load categories
      const categoriesData = await getCategories()
      console.log(" Categories from API:", categoriesData)
      
      if (categoriesData?.success) {
    
        if (categoriesData.data && categoriesData.data.length > 0) {
          
          if (typeof categoriesData.data[0] === 'string') {
            setCategories(categoriesData.data)
          } else {
        
            const names = categoriesData.data.map((cat: any) => cat.name)
            setCategories(names)
          }
        }
      }

      // Load initial services
      const servicesData = await getServices()
      console.log("📦 Services from API:", servicesData)
      if (servicesData?.success) {
        setServices(servicesData?.data?.services || [])
      }

      // Load initial technicians
      const techniciansData = await getTechnicians()
      console.log("👷 Technicians from API:", techniciansData)
      if (techniciansData?.success) {
        setTechnicians(techniciansData?.data || [])
      }
    } catch (error) {
      console.error('Error loading initial data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  

  

const loadDataWithFilters = async (newFilters: FilterState) => {
  setSearchLoading(true)
  try {

    const filterParams: any = {}
    
    if (newFilters.search) filterParams.search = newFilters.search
    if (newFilters.category && newFilters.category !== 'all') {
      filterParams.category = newFilters.category  // ← নাম পাঠান
    }
    if (newFilters.location && newFilters.location !== 'all') {
      filterParams.location = newFilters.location
    }
    if (newFilters.rating && newFilters.rating !== 'all') {
      filterParams.rating = newFilters.rating
    }
    if (newFilters.priceRange && newFilters.priceRange !== 'all') {
      filterParams.priceRange = newFilters.priceRange
    }

    console.log(" Sending to API:", filterParams)

    const [servicesData, techniciansData] = await Promise.all([
      getServices(filterParams),
      getTechnicians(filterParams),  // ← category নাম যাচ্ছে
    ])

    console.log(" Technicians Response:", techniciansData)

    // Update services
    if (servicesData?.success) {
      setServices(servicesData?.data?.services || [])
    }

    // Update technicians
    if (techniciansData?.success) {
      setTechnicians(techniciansData?.data || [])
    }
  } catch (error) {
    console.error('Error loading filtered data:', error)
    toast.error('Failed to load data')
  } finally {
    setSearchLoading(false)
  }
}

  // ========== SEARCH HANDLER ==========
  const handleSearch = (searchTerm: string) => {
    const newFilters = { ...filters, search: searchTerm }
    setFilters(newFilters)
    loadDataWithFilters(newFilters)
  }

  // ========== FILTER CHANGE HANDLER ==========
  const handleFilterChange = (newFilters: any) => {
    console.log("🔧 Filter Changed:", newFilters)
    
    const updated: FilterState = {
      location: newFilters.location || filters.location,
      rating: newFilters.rating || filters.rating,
      priceRange: newFilters.priceRange || filters.priceRange,
      category: newFilters.category || filters.category,
      search: filters.search,
    }
    
    console.log("📋 Updated Filters:", updated)
    setFilters(updated)
    loadDataWithFilters(updated)
  }

  // ========== RENDER ==========
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground">Browse Services & Technicians</h1>
        <p className="text-muted-foreground mt-2">
          Find the perfect service and technician for your needs
        </p>
      </div>

      {/* Search Bar */}
      <SearchBar 
        onSearch={handleSearch}
        placeholder="Search services or technicians..."
      />

      {/* Advanced Filters */}
      <AdvancedFilters 
        categories={categories} 
        onFilterChange={handleFilterChange}
      />

      {/* Tabs for Services & Technicians */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="services">
            Services
            {services.length > 0 && (
              <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                {services.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="technicians">
            Technicians
            {technicians.length > 0 && (
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                {technicians.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* SERVICES TAB */}
        <TabsContent value="services" className="mt-6">
          <div className="space-y-4">
            {filters.search && (
              <div className="text-sm text-muted-foreground">
                Showing results for "<strong>{filters.search}</strong>"
              </div>
            )}
            <ServiceGrid 
              services={services} 
              isLoading={loading || searchLoading}
            />
          </div>
        </TabsContent>

        {/* TECHNICIANS TAB */}
        <TabsContent value="technicians" className="mt-6">
          <div className="space-y-4">
            {filters.search && (
              <div className="text-sm text-muted-foreground">
                Showing results for "<strong>{filters.search}</strong>"
              </div>
            )}
            {filters.category !== 'all' && (
              <div className="text-sm text-muted-foreground">
                Filtered by category: <strong>{filters.category}</strong>
              </div>
            )}
            <TechnicianGrid 
              technicians={technicians} 
              isLoading={loading || searchLoading}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* No Results Message */}
      {!loading && !searchLoading && services.length === 0 && technicians.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-500 text-lg font-medium">No results found</p>
          <p className="text-gray-400 text-sm mt-2">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  )
}