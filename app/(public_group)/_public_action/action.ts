"use server"

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL


export async function getServices(filters?: {
  search?: string
  category?: string
  location?: string
  rating?: string
  priceRange?: string
}) {
  try {
    
    let url = `${API_URL}/api/customer/services`
    const params = new URLSearchParams()

    
    if (filters?.search) {
      params.append('search', filters.search) 
    }
    
    
    if (filters?.category && filters.category !== 'all') {
      params.append('categoryId', filters.category)  
    }
    
    
    if (filters?.location && filters.location !== 'all') {
      params.append('location', filters.location)
    }
    
    
    if (filters?.rating && filters.rating !== 'all') {
      params.append('minRating', filters.rating)
    }
    
  
    if (filters?.priceRange && filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-')
      if (min) params.append('minPrice', min)
      if (max) params.append('maxPrice', max)
    }

    if (params.toString()) {
      url += `?${params.toString()}`
    }

    console.log(`🔍 Fetching services: ${url}`)

    const res = await fetch(url, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    const data = await res.json()
    console.log(`📦 Services response:`, data)
    
    return data
  } catch (error) {
    console.error('Error fetching services:', error)
    return { success: false, data: [], message: 'Failed to fetch services' }
  }
}


export async function getTechnicians(filters?: {
  search?: string
  category?: string
  location?: string
  rating?: string
  priceRange?: string
}) {
  try {
    
    let url = `${API_URL}/api/customer/technicians`
    const params = new URLSearchParams()

    
    if (filters?.search) {
      params.append('search', filters.search)  
    }
    
    
    if (filters?.category && filters.category !== 'all') {
      params.append('categoryId', filters.category)
    }
    
    
    if (filters?.location && filters.location !== 'all') {
      params.append('location', filters.location)
    }
    
    
    if (filters?.rating && filters.rating !== 'all') {
      params.append('minRating', filters.rating)
    }

    if (params.toString()) {
      url += `?${params.toString()}`
    }

    console.log(`🔍 Fetching technicians: ${url}`)  
    const res = await fetch(url, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    const data = await res.json()
    console.log(` Technicians response:`, data) 
    
    return data
  } catch (error) {
    console.error('Error fetching technicians:', error)
    return { success: false, data: [], message: 'Failed to fetch technicians' }
  }
}


export async function getTechnician(id: string) {
  try {
    const res = await fetch(`${API_URL}/api/customer/technicians/${id}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (!res.ok) {
      return { success: false, data: null, message: 'Technician not found' }
    }
    
    return res.json()
  } catch (error) {
    console.error('Error fetching technician:', error)
    return { success: false, data: null, message: 'Failed to fetch technician' }
  }
}


export async function getCategories() {
  try {
    const res = await fetch(`${API_URL}/api/customer/categories`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (!res.ok) {
      return { success: false, data: [], message: 'Failed to fetch categories' }
    }
    
    return res.json()
  } catch (error) {
    console.error('Error fetching categories:', error)
    return { success: false, data: [], message: 'Failed to fetch categories' }
  }
}

