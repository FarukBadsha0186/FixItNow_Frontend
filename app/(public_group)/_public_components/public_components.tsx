"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Star, MapPin, Clock, Search, X, SlidersHorizontal, ChevronDown, Loader2, Calendar, ArrowRight } from "lucide-react"
import { toast } from "sonner"


// 1️⃣ SEARCH BAR

export function SearchBar({ 
  onSearch, 
  placeholder = "Search services or technicians...",
  className = "" 
}: { 
  onSearch: (term: string) => void
  placeholder?: string
  className?: string 
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    setIsLoading(true)

    clearTimeout((window as any).searchTimeout)
    ;(window as any).searchTimeout = setTimeout(() => {
      onSearch(value)
      setIsLoading(false)
    }, 500)
  }

  const clearSearch = () => {
    setSearchTerm("")
    onSearch("")
  }

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearch}
        className="pl-10 pr-10 text-black border-gray-200 focus:border-indigo-500"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={clearSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      {isLoading && (
        <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
        </div>
      )}
    </div>
  )
}


//  ADVANCED FILTERS



//  ADVANCED FILTERS 

export function AdvancedFilters({ 
  categories, 
  onFilterChange,
  locations = ["Dhaka", "Chittagong", "Khulna", "Rajshahi", "Sylhet", "Barisal", "Rangpur"]
}: { 
  categories: any[]
  onFilterChange: (filters: any) => void
  locations?: string[]
}) {
  const [filters, setFilters] = useState({
    category: "all",
    location: "all",
    rating: "all",
    priceRange: "all",
  })
  const [isOpen, setIsOpen] = useState(false)

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const defaultFilters = { category: "all", location: "all", rating: "all", priceRange: "all" }
    setFilters(defaultFilters)
    onFilterChange(defaultFilters)
  }

  const hasActiveFilters = Object.values(filters).some((v) => v !== "all")

  return (
    <div className="space-y-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition"
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span className="font-medium">Filters</span>
        {hasActiveFilters && (
          <Badge variant="secondary" className="text-xs bg-indigo-100 text-indigo-700">
            Active
          </Badge>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted rounded-lg border">
          <div>
            <label className="text-xs font-medium text-gray-500">Category</label>
            <Select value={filters.category} onValueChange={(v) => handleFilterChange("category", v)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
             
                {categories?.map((cat) => {
                  
                  if (typeof cat === 'string') {
                    return (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    )
                  }
                  
                  return (
                    <SelectItem key={cat.id || cat.name} value={cat.name || cat}>
                      {cat.name || cat}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500">Location</label>
            <Select value={filters.location} onValueChange={(v) => handleFilterChange("location", v)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc.toLowerCase()}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500">Rating</label>
            <Select value={filters.rating} onValueChange={(v) => handleFilterChange("rating", v)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="All Ratings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="4.5">⭐ 4.5+</SelectItem>
                <SelectItem value="4.0">⭐ 4.0+</SelectItem>
                <SelectItem value="3.5">⭐ 3.5+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500">Price Range</label>
            <Select value={filters.priceRange} onValueChange={(v) => handleFilterChange("priceRange", v)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Any Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Price</SelectItem>
                <SelectItem value="0-25">$0 - $25</SelectItem>
                <SelectItem value="25-50">$25 - $50</SelectItem>
                <SelectItem value="50-100">$50 - $100</SelectItem>
                <SelectItem value="100-200">$100 - $200</SelectItem>
                <SelectItem value="200+">$200+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <div className="col-span-full flex justify-end">
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}


// CATEGORY CARD WITH DESCRIPTION (For Homepage)

export function CategoryCardWithDescription({ category }: { category: any }) {
  const getCategoryIcon = (name: string) => {
    const icons: Record<string, string> = {
      'Electrical': '',
      'Plumbing': '',
      'Cleaning': '',
      'Carpentry': '',
      'Painting': '',
      'Gardening': '',
      'HVAC': '',
      'Appliance': ''
    }
    return icons[name] || '🔧'
  }

  const getCategoryColor = (name: string) => {
    const colors: Record<string, string> = {
      'Electrical': 'from-yellow-500 to-orange-500',
      'Plumbing': 'from-blue-500 to-cyan-500',
      'Cleaning': 'from-green-500 to-emerald-500',
      'Carpentry': 'from-amber-500 to-orange-600',
      'Painting': 'from-pink-500 to-rose-500',
      'Gardening': 'from-green-600 to-lime-500',
      'HVAC': 'from-red-500 to-pink-500',
      'Appliance': 'from-purple-500 to-indigo-500'
    }
    return colors[name] || 'from-indigo-500 to-purple-500'
  }

  return (
    <Link href={`/services?category=${category.name}`}>
      <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
        <div className={`h-48 bg-gradient-to-br ${getCategoryColor(category.name)} flex items-center justify-center`}>
          <span className="text-7xl text-white">
            {getCategoryIcon(category.name)}
          </span>
        </div>
        <div className="p-5">
          <h3 className="font-bold text-xl text-gray-900">
            {category.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {category.description || `${category.name} services for your home`}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-gray-400">Available now</span>
            <ArrowRight className="w-4 h-4 text-indigo-600" />
          </div>
        </div>
      </div>
    </Link>
  )
}


//  CATEGORY GRID WITH DESCRIPTION (For Homepage)

export function CategoryGridWithDescription({ categories, isLoading = false }: { categories: any[]; isLoading?: boolean }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-t-lg" />
            <div className="bg-white p-4 space-y-3 rounded-b-lg">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No categories found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map((category) => (
        <CategoryCardWithDescription key={category.id} category={category} />
      ))}
    </div>
  )
}


//  SERVICE CARD

export function ServiceCard({ service }: { service: any }) {
  const title = service?.title || "Untitled Service"
  const description = service?.description || "No description"
  const price = service?.price || 0
  const categoryName = service?.category?.name || "General"
  const technicianName = service?.technician?.user?.name || "Technician"

  return (
    //<Link href={`/services/${service.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition cursor-pointer h-full">
        <div className="relative h-48 w-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
          <div className="text-6xl">🔧</div>
        </div>

        <CardHeader className="pb-2">
          <div className="flex justify-between items-center gap-2">
            <CardTitle className="text-lg line-clamp-1">{title}</CardTitle>
            <Badge variant="outline" className="text-xs whitespace-nowrap">
              {categoryName}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pb-2 space-y-2">
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">by {technicianName}</span>
          </div>
        </CardContent>

        {/* <CardFooter className="flex items-center justify-between">
          <span className="font-bold text-primary">${price}/hr</span>
          <Button size="sm">View Details</Button>
        </CardFooter> */}
      </Card>
   // </Link>
  )
}


//  SERVICE GRID

export function ServiceGrid({ services, isLoading = false }: { services: any[]; isLoading?: boolean }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-t-lg" />
            <div className="p-4 space-y-3 bg-white rounded-b-lg">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
              <div className="h-8 bg-gray-200 rounded w-full mt-2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!services || services.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">🔍</div>
        <p className="text-gray-500 text-lg font-medium">No services found</p>
        <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  )
}


//  TECHNICIAN CARD

export function TechnicianCard({ technician }: { technician: any }) {
  const name = technician?.user?.name || "Unknown"
  const rating = technician?.avgRating || 0
  const totalReviews = technician?.totalReviews || 0
  const location = technician?.location || "N/A"
  const hourlyRate = technician?.hourlyRate || 0
  const isAvailable = technician?.isAvailable !== false
  const services = technician?.services || []

  return (
    <Link href={`/technicians/${technician.id}`}>
      <Card className="hover:shadow-lg transition cursor-pointer h-full">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="text-xl bg-primary/10">{name.charAt(0) || "?"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">{name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  {rating.toFixed(1)}
                </span>
                <span className="text-xs">({totalReviews})</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {location}
                </span>
              </div>
            </div>
            <Badge className={isAvailable ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"}>
              {isAvailable ? "Available" : "Unavailable"}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-1 mt-3">
            {services.slice(0, 3).map((s: any) => (
              <Badge key={s.id} variant="outline" className="text-xs">{s.title}</Badge>
            ))}
            {services.length > 3 && (
              <Badge variant="outline" className="text-xs">+{services.length - 3}</Badge>
            )}
          </div>

          <div className="mt-3 text-primary font-bold">${hourlyRate}/hr</div>
        </CardContent>
      </Card>
    </Link>
  )
}


//  TECHNICIAN GRID

export function TechnicianGrid({ technicians, isLoading = false }: { technicians: any[]; isLoading?: boolean }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-32 rounded-lg" />
            <div className="p-4 space-y-3 bg-white rounded-b-lg">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!technicians || technicians.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">👷</div>
        <p className="text-gray-500 text-lg font-medium">No technicians found</p>
        <p className="text-gray-400 text-sm">Try adjusting your search or location</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {technicians.map((tech) => (
        <TechnicianCard key={tech.id} technician={tech} />
      ))}
    </div>
  )
}


//  TECHNICIAN PROFILE

export function TechnicianProfile({ 
  technician, 
  reviews = [], 
  isLoggedIn = false 
}: { 
  technician: any
  reviews?: any[]
  isLoggedIn?: boolean 
}) {
  const name = technician?.user?.name || "Unknown"
  const rating = technician?.avgRating || 0
  const totalReviews = technician?.totalReviews || 0
  const location = technician?.location || "N/A"
  const hourlyRate = technician?.hourlyRate || 0
  const isAvailable = technician?.isAvailable !== false
  const bio = technician?.bio || "No bio available"
  const skills = technician?.services?.map((s: any) => s.title) || []

  const handleBookNow = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault()
      toast.error("Please login to book!")
      return
    }
    toast.success("Proceed to booking!")
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="w-24 h-24 md:w-32 md:h-32">
              <AvatarFallback className="text-3xl md:text-4xl bg-indigo-100 text-indigo-600">
                {name.charAt(0) || "?"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-2xl font-bold">{name}</h1>

              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {rating} ({totalReviews} reviews)
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  ${hourlyRate}/hr
                </span>
                <Badge className={isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                  {isAvailable ? "✅ Available" : "❌ Unavailable"}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {skills.map((skill: string) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>

              <div className="mt-4">
                {isAvailable ? (
                  <Link href={isLoggedIn ? `/customer_dashboard/booking/${technician.id}` : "#"}>
                    <Button className="w-full md:w-auto" onClick={handleBookNow}>
                      {isLoggedIn ? "Book Now" : "Login to Book"}
                    </Button>
                  </Link>
                ) : (
                  <Button className="w-full md:w-auto" disabled variant="outline">
                    Currently Unavailable
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-2">About</h3>
          <p className="text-gray-600">{bio}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4">Reviews ({reviews.length})</h3>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-4 last:border-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{review.customer?.name || "Anonymous"}</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 mt-1">{review.comment}</p>
                  <p className="text-sm text-gray-400 mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}
        </CardContent>
      </Card>

      {technician?.availability && technician.availability.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Working Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {technician.availability.map((slot: any) => (
                <div key={slot.id} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-sm w-24">
                      {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][slot.dayOfWeek]}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {slot.startTime} - {slot.endTime}
                    </Badge>
                  </div>
                  <Badge className="bg-green-100 text-green-800 text-xs">Available</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}