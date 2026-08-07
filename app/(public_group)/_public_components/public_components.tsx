"use client"

import { useState } from "react"
import Image from "next/image"
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
import { Star, MapPin, Clock, Search, X, SlidersHorizontal, ChevronDown, Loader2, Calendar, CheckCircle } from "lucide-react"
import { toast } from "sonner"


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

// ============================================
// 2️⃣ ADVANCED FILTERS
// ============================================
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
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
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

// ============================================
// 3️⃣ SERVICE CARD
// ============================================
export function ServiceCard({ service }: { service: any }) {
  const tech = service.technician
  const name = tech?.user?.name || "Unknown"
  const rating = tech?.avgRating || 0
  const location = tech?.location || "N/A"
  const image = tech?.user?.image || null

  return (
    <Link href={`/technicians/${tech?.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition cursor-pointer group h-full">
        <div className="relative h-48 w-full bg-gray-100">
          {service.image ? (
            <Image src={service.image} alt={service.title} fill className="object-cover group-hover:scale-105 transition duration-300" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400 bg-gradient-to-br from-gray-50 to-gray-200">🔧</div>
          )}
          <Badge className="absolute bottom-2 right-2 bg-indigo-600 hover:bg-indigo-700">${service.price}</Badge>
        </div>

        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg line-clamp-1">{service.title}</CardTitle>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              {rating.toFixed(1)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pb-2 space-y-2">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={image || undefined} />
              <AvatarFallback className="text-xs">{name.charAt(0) || "?"}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-600">{name}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-1 font-semibold text-indigo-600">
              <Clock className="w-4 h-4" />
              <span>${service.price}</span>
            </div>
          </div>
          {service.category && (
            <Badge variant="outline" className="text-xs">{service.category.name}</Badge>
          )}
        </CardContent>

        <CardFooter>
          <Button className="w-full">View Profile</Button>
        </CardFooter>
      </Card>
    </Link>
  )
}


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

// ============================================
// 5️⃣ TECHNICIAN CARD
// ============================================
export function TechnicianCard({ technician }: { technician: any }) {
  const name = technician?.user?.name || "Unknown"
  const rating = technician?.avgRating || 0
  const totalReviews = technician?.totalReviews || 0
  const location = technician?.location || "N/A"
  const hourlyRate = technician?.hourlyRate || 0
  const isAvailable = technician?.isAvailable !== false
  const image = technician?.user?.image || null
  const services = technician?.services || []

  return (
    <Link href={`/technicians/${technician.id}`}>
      <Card className="hover:shadow-lg transition cursor-pointer h-full">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={image || undefined} />
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

// ============================================
// 6️⃣ TECHNICIAN GRID
// ============================================
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

// ============================================
// 7️⃣ TECHNICIAN PROFILE
// ============================================
export function TechnicianProfile({ 
  technician, 
  reviews = [], 
  isLoggedIn = false 
}: { 
  technician: any
  reviews?: any[]
  isLoggedIn?: boolean 
}) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const name = technician?.user?.name || "Unknown"
  const rating = technician?.avgRating || 0
  const totalReviews = technician?.totalReviews || 0
  const location = technician?.location || "N/A"
  const hourlyRate = technician?.hourlyRate || 0
  const isAvailable = technician?.isAvailable !== false
  const bio = technician?.bio || "No bio available"
  const image = technician?.user?.image || null
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
      {/* Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="w-24 h-24 md:w-32 md:h-32">
              <AvatarImage src={image || "/default-avatar.png"} alt={name} />
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
                  <Link href={isLoggedIn ? `/booking/${technician.id}` : "#"}>
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

      {/* About */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-2">About</h3>
          <p className="text-gray-600">{bio}</p>
        </CardContent>
      </Card>

      {/* Reviews */}
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

      {/* Availability Schedule */}
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

// ============================================
// 8️⃣ MAIN HOME PAGE (with all features)
// ============================================
export function HomePage({
  initialServices = [],
  initialTechnicians = [],
  categories = [],
}: {
  initialServices?: any[]
  initialTechnicians?: any[]
  categories?: any[]
}) {
  const [services, setServices] = useState(initialServices)
  const [technicians, setTechnicians] = useState(initialTechnicians)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("services")
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    location: "all",
    rating: "all",
    priceRange: "all",
  })

  const loadData = async (newFilters: any) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (newFilters.search) params.append("search", newFilters.search)
      if (newFilters.category && newFilters.category !== "all") params.append("categoryId", newFilters.category)
      if (newFilters.location && newFilters.location !== "all") params.append("location", newFilters.location)
      if (newFilters.rating && newFilters.rating !== "all") params.append("minRating", newFilters.rating)
      if (newFilters.priceRange && newFilters.priceRange !== "all") {
        const [min, max] = newFilters.priceRange.split("-")
        if (min) params.append("minPrice", min)
        if (max) params.append("maxPrice", max)
      }

      const [servicesRes, techniciansRes] = await Promise.all([
        fetch(`/api/customer/services?${params}`),
        fetch(`/api/customer/technicians?${params}`),
      ])

      const servicesData = await servicesRes.json()
      const techniciansData = await techniciansRes.json()

      if (servicesData.success) setServices(servicesData.data || [])
      if (techniciansData.success) setTechnicians(techniciansData.data || [])
    } catch (error) {
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (term: string) => {
    const newFilters = { ...filters, search: term }
    setFilters(newFilters)
    loadData(newFilters)
  }

  const handleFilterChange = (newFilters: any) => {
    
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    loadData(updated)
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <SearchBar onSearch={handleSearch} />
      <AdvancedFilters categories={categories} onFilterChange={handleFilterChange} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="technicians">Technicians</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="mt-6">
          <ServiceGrid services={services} isLoading={loading} />
        </TabsContent>

        <TabsContent value="technicians" className="mt-6">
          <TechnicianGrid technicians={technicians} isLoading={loading} />
        </TabsContent>
      </Tabs>
    </div>
  )
}