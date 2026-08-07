
// "use server"

// const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

// export async function getServices(filters?: {
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
//       params.append('name', filters.search)
//     }
//     if (filters?.category && filters.category !== 'all') {
//       params.append('category', filters.category)
//     }
//     if (filters?.location && filters.location !== 'all') {
//       params.append('location', filters.location)
//     }
//     if (filters?.rating && filters.rating !== 'all') {
//       params.append('rating', filters.rating)
//     }
//     if (filters?.priceRange && filters.priceRange !== 'all') {
//       params.append('priceRange', filters.priceRange)
//     }

//     if (params.toString()) {
//       url += `?${params.toString()}`
//     }

//     const res = await fetch(url, { cache: 'no-store' })
//     return res.json()
//   } catch (error) {
//     console.error('Error fetching services:', error)
//     return { data: [] }
//   }
// }

// export async function getTechnicians(filters?: {
//   search?: string
//   category?: string
//   location?: string
//   rating?: string
//   priceRange?: string
// }) {
//   try {
//     let url = `${API_URL}/api/technicians`
//     const params = new URLSearchParams()

//     if (filters?.search) {
//       params.append('name', filters.search)
//     }
//     if (filters?.location && filters.location !== 'all') {
//       params.append('location', filters.location)
//     }
//     if (filters?.rating && filters.rating !== 'all') {
//       params.append('rating', filters.rating)
//     }
//     if (filters?.priceRange && filters.priceRange !== 'all') {
//       params.append('priceRange', filters.priceRange)
//     }

//     if (params.toString()) {
//       url += `?${params.toString()}`
//     }

//     const res = await fetch(url, { cache: 'no-store' })
//     return res.json()
//   } catch (error) {
//     console.error('Error fetching technicians:', error)
//     return { data: [] }
//   }
// }


// export async function getTechnician(id: string) {
//   try {
    
//     const res = await fetch(`${API_URL}/api/technicians/${id}`, {
//       cache: 'no-store'
//     })
    
//     if (!res.ok) {
//       return { data: null }
//     }
    
//     return res.json()
//   } catch (error) {
//     console.error('Error fetching technician:', error)
//     return { data: null }
//   }
// }

// // 4️⃣ GET CATEGORIES

// export async function getCategories() {
//   try {
//     const res = await fetch(`${API_URL}/api/customer/categories`, {
//       cache: 'no-store'
//     })
//     return res.json()
//   } catch (error) {
//     console.error('Error fetching categories:', error)
//     return { data: [] }
//   }
// }


"use server"

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

// ============================================
// 1️⃣ GET SERVICES (WITH FILTERS)
// ============================================
export async function getServices(filters?: {
  search?: string
  category?: string
  location?: string
  rating?: string
  priceRange?: string
}) {
  try {
    // ✅ Correct URL: /api/customer/services
    let url = `${API_URL}/api/customer/services`
    const params = new URLSearchParams()

    // ✅ Search filter
    if (filters?.search) {
      params.append('search', filters.search)  // ✅ Changed from 'name' to 'search'
    }
    
    // ✅ Category filter
    if (filters?.category && filters.category !== 'all') {
      params.append('categoryId', filters.category)  // ✅ Changed from 'category' to 'categoryId'
    }
    
    // ✅ Location filter
    if (filters?.location && filters.location !== 'all') {
      params.append('location', filters.location)
    }
    
    // ✅ Rating filter
    if (filters?.rating && filters.rating !== 'all') {
      params.append('minRating', filters.rating)
    }
    
    // ✅ Price Range filter
    if (filters?.priceRange && filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-')
      if (min) params.append('minPrice', min)
      if (max) params.append('maxPrice', max)
    }

    if (params.toString()) {
      url += `?${params.toString()}`
    }

    console.log(`🔍 Fetching services: ${url}`)  // ✅ Debug log

    const res = await fetch(url, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    const data = await res.json()
    console.log(`📦 Services response:`, data)  // ✅ Debug log
    
    return data
  } catch (error) {
    console.error('Error fetching services:', error)
    return { success: false, data: [], message: 'Failed to fetch services' }
  }
}

// ============================================
// 2️⃣ GET TECHNICIANS (WITH FILTERS)
// ============================================
export async function getTechnicians(filters?: {
  search?: string
  category?: string
  location?: string
  rating?: string
  priceRange?: string
}) {
  try {
    // ✅ Correct URL: /api/customer/technicians
    let url = `${API_URL}/api/customer/technicians`
    const params = new URLSearchParams()

    // ✅ Search filter
    if (filters?.search) {
      params.append('search', filters.search)  // ✅ Changed from 'name' to 'search'
    }
    
    // ✅ Category filter (for technicians, category works through services)
    if (filters?.category && filters.category !== 'all') {
      params.append('categoryId', filters.category)
    }
    
    // ✅ Location filter
    if (filters?.location && filters.location !== 'all') {
      params.append('location', filters.location)
    }
    
    // ✅ Rating filter
    if (filters?.rating && filters.rating !== 'all') {
      params.append('minRating', filters.rating)
    }

    if (params.toString()) {
      url += `?${params.toString()}`
    }

    console.log(`🔍 Fetching technicians: ${url}`)  // ✅ Debug log

    const res = await fetch(url, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    const data = await res.json()
    console.log(`📦 Technicians response:`, data)  // ✅ Debug log
    
    return data
  } catch (error) {
    console.error('Error fetching technicians:', error)
    return { success: false, data: [], message: 'Failed to fetch technicians' }
  }
}

// ============================================
// 3️⃣ GET TECHNICIAN BY ID
// ============================================
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

// ============================================
// 4️⃣ GET CATEGORIES
// ============================================
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

