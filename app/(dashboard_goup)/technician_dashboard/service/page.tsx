"use client"

import { useState, useEffect } from 'react'
import { ServicesPage } from './../technician_components/_service'
import { 
  getServices, 
  getCategories, 
  createService,
  deleteService,
  updateService ,
  Service, Category 
} from '../../technician_dashboard/technician_action/service'  // ✅ Path: ../../_actions/
import { toast } from 'sonner'



export default function ServicesRoute() {
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, categoriesRes] = await Promise.all([
          getServices(),
          getCategories()
        ])
        
        if (servicesRes.success) {
          setServices(servicesRes.data || [])
        } else {
          toast.error(servicesRes.message || 'Failed to load services')
        }
        
        if (categoriesRes.success) {
          setCategories(categoriesRes.data || [])
        }
      } catch (error) {
        toast.error('Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleCreateService = async (data: any) => {
    const result = await createService(data)
    if (result.success) {
      toast.success(result.message)
      const servicesRes = await getServices()
      if (servicesRes.success) {
        setServices(servicesRes.data || [])
      }
    } else {
      toast.error(result.message)
    }
  }

  const handleUpdateService = async (id: string, data: any) => {
    const result = await updateService(id, data)
    if (result.success) {
      toast.success(result.message)
      const servicesRes = await getServices()
      if (servicesRes.success) {
        setServices(servicesRes.data || [])
      }
    } else {
      toast.error(result.message)
    }
  }

  const handleDeleteService = async (id: string) => {
    const result = await deleteService(id)
    if (result.success) {
      toast.success(result.message)
      const servicesRes = await getServices()
      if (servicesRes.success) {
        setServices(servicesRes.data || [])
      }
    } else {
      toast.error(result.message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading services...</p>
        </div>
      </div>
    )
  }

  return (
    <ServicesPage 
      services={services}
      categories={categories}
      onCreateService={handleCreateService}
      onUpdateService={handleUpdateService}
      onDeleteService={handleDeleteService}
    />
  )
}