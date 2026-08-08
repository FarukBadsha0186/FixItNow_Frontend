"use server"

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL




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
    const res = await fetch(`${API_URL}/api/categories`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (!res.ok) {
      return { success: false, data: [], message: 'Failed to fetch categories' }
    }
    
    const result = await res.json()
    
    
    if (result.success && result.data) {
      const categoryNames = result.data.map((item: any) => item.name)
      
      return {
        success: true,
        data: categoryNames,  // ["Electrical"]
        message: result.message
      }
    }
    
    return result
    
  } catch (error) {
    console.error('Error fetching categories:', error)
    return { success: false, data: [], message: 'Failed to fetch categories' }
  }
}

export async function getServices(filters?: {
  search?: string
  category?: string
  location?: string
  rating?: string
  priceRange?: string
}) {
  try {
    // ✅ প্রথমে categories ফেচ করো
    const categoriesRes = await fetch(`${API_URL}/api/categories`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    const categoriesData = await categoriesRes.json()
    
    // ✅ শুধু names বের করো
    const categoryNames = categoriesData?.data?.map((item: any) => item.name) || []
    
    console.log(`📦 Categories:`, categoryNames)

    // Services fetch করো (optional - filters এর জন্য)
    let url = `${API_URL}/api/customer/services`
    const params = new URLSearchParams()

    if (filters?.search) {
      params.append('search', filters.search) 
    }
    
    if (filters?.category && filters.category !== 'all') {
      params.append('category', filters.category)
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
    
    // ✅ Categories এবং Services উভয়ই return করো
    return {
      success: true,
      data: {
        categories: categoryNames,  // ["Electrical", "Plumbing", ...]
        services: data?.data || []
      },
      message: 'Data fetched successfully'
    }
    
  } catch (error) {
    console.error('Error fetching services:', error)
    return { 
      success: false,
      data: { categories: [], services: [] },
      message: 'Failed to fetch services' 
    }
  }
}
