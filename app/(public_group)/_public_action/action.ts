
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
    let url = `${API_URL}/api/services`
    const params = new URLSearchParams()

    if (filters?.search) {
      params.append('name', filters.search)
    }
    if (filters?.category && filters.category !== 'all') {
      params.append('category', filters.category)
    }
    if (filters?.location && filters.location !== 'all') {
      params.append('location', filters.location)
    }
    if (filters?.rating && filters.rating !== 'all') {
      params.append('rating', filters.rating)
    }
    if (filters?.priceRange && filters.priceRange !== 'all') {
      params.append('priceRange', filters.priceRange)
    }

    if (params.toString()) {
      url += `?${params.toString()}`
    }

    const res = await fetch(url, { cache: 'no-store' })
    return res.json()
  } catch (error) {
    console.error('Error fetching services:', error)
    return { data: [] }
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
    let url = `${API_URL}/api/technicians`
    const params = new URLSearchParams()

    if (filters?.search) {
      params.append('name', filters.search)
    }
    if (filters?.location && filters.location !== 'all') {
      params.append('location', filters.location)
    }
    if (filters?.rating && filters.rating !== 'all') {
      params.append('rating', filters.rating)
    }
    if (filters?.priceRange && filters.priceRange !== 'all') {
      params.append('priceRange', filters.priceRange)
    }

    if (params.toString()) {
      url += `?${params.toString()}`
    }

    const res = await fetch(url, { cache: 'no-store' })
    return res.json()
  } catch (error) {
    console.error('Error fetching technicians:', error)
    return { data: [] }
  }
}


export async function getTechnician(id: string) {
  try {
    
    const res = await fetch(`${API_URL}/api/technicians/${id}`, {
      cache: 'no-store'
    })
    
    if (!res.ok) {
      return { data: null }
    }
    
    return res.json()
  } catch (error) {
    console.error('Error fetching technician:', error)
    return { data: null }
  }
}

// 4️⃣ GET CATEGORIES

export async function getCategories() {
  try {
    const res = await fetch(`${API_URL}/api/customer/categories`, {
      cache: 'no-store'
    })
    return res.json()
  } catch (error) {
    console.error('Error fetching categories:', error)
    return { data: [] }
  }
}


