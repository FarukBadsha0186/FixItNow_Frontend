
"use server"

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

// export async function getTechnicians(filters?: {
//   search?: string
//   category?: string
//   location?: string
//   rating?: string
//   priceRange?: string
// }) {
//   try {
//     let url = `${API_URL}/api/categories`
//     const params = new URLSearchParams()

//     if (filters?.search) {
//       params.append('search', filters.search)  
//     }
    
//     if (filters?.category && filters.category !== 'all') {
//       params.append('categoryId', filters.category)
//     }
    
//     if (filters?.location && filters.location !== 'all') {
//       params.append('location', filters.location)
//     }
    
//     if (filters?.rating && filters.rating !== 'all') {
//       params.append('minRating', filters.rating)
//     }

//     if (params.toString()) {
//       url += `?${params.toString()}`
//     }

//     console.log(`🔍 Fetching technicians: ${url}`)  
//     const res = await fetch(url, { 
//       cache: 'no-store',
//       headers: {
//         'Content-Type': 'application/json',
//       }
//     })
    
//     const data = await res.json()
//     console.log(`✅ Technicians response:`, data) 
    
//     return data
//   } catch (error) {
//     console.error('Error fetching technicians:', error)
//     return { success: false, data: [], message: 'Failed to fetch technicians' }
//   }
// }


// action.ts
export async function getTechnicians(filters?: {
  search?: string
  category?: string  
  location?: string
  rating?: string
  priceRange?: string
}) {
  try {
    
    let categoryId = undefined
    
    if (filters?.category && filters.category !== 'all') {
      
      const categoriesRes = await fetch(`${API_URL}/api/categories`, {
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' }
      })
      const categoriesData = await categoriesRes.json()
      
      const category = categoriesData?.data?.find((c: any) => c.name === filters.category)
      categoryId = category?.id
      
      console.log(`🔍 Category: ${filters.category} → ID: ${categoryId}`)
    }

    let url = `${API_URL}/api/technicians`  
    const params = new URLSearchParams()

    if (filters?.search) {
      params.append('search', filters.search)  
    }
    
    
    if (categoryId) {
      params.append('categoryId', categoryId)
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
    console.log("📦 Categories API Response:", result)
    
    if (result.success && result.data) {
      return {
        success: true,
        data: result.data,
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
    // Fetch categories first
    const categoriesRes = await fetch(`${API_URL}/api/categories`, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' }
    })
    
    const categoriesData = await categoriesRes.json()
    console.log("📦 Categories Data:", categoriesData)
    
    // Create category map
    const categoryMap = new Map<string, string>()
    if (categoriesData?.data && Array.isArray(categoriesData.data)) {
      categoriesData.data.forEach((cat: any) => {
        if (cat.name && cat.id) {
          categoryMap.set(cat.name, cat.id)
        }
      })
    }
    console.log("🗺️ Category Map:", categoryMap)

    let url = `${API_URL}/api/customer/services`
    const params = new URLSearchParams()

    if (filters?.search) {
      params.append('search', filters.search)
    }
    
    // Convert category NAME to ID
    if (filters?.category && filters.category !== 'all') {
      const categoryId = categoryMap.get(filters.category)
      if (categoryId) {
        params.append('categoryId', categoryId)
        console.log(`✅ Category '${filters.category}' → ID: ${categoryId}`)
      }
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

    console.log(`🔍 Fetching services from: ${url}`)

    const res = await fetch(url, { 
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' }
    })
    
    const data = await res.json()
    console.log(" Services Response:", data)
    
    return {
      success: true,
      data: {
        categories: categoriesData?.data || [],
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