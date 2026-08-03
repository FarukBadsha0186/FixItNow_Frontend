"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { 
  Star, MapPin, Clock, Search, X, 
  SlidersHorizontal, ChevronDown 
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

// ============================================
// 1️⃣ SEARCH BAR
// ============================================
interface SearchBarProps {
  onSearch: (term: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({ onSearch, placeholder = "Search...", className = "" }: SearchBarProps) {
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
        className="pl-10 pr-10 text-black"
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
          <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}


// 2️⃣ ADVANCED FILTERS

interface FilterState {
  location: string
  rating: string
  priceRange: string
  category: string
}

interface FiltersProps {
  categories: any[]
  onFilterChange: (filters: FilterState) => void
  initialFilters?: FilterState
}

export function AdvancedFilters({ categories, onFilterChange, initialFilters }: FiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    location: initialFilters?.location || "all",
    rating: initialFilters?.rating || "all",
    priceRange: initialFilters?.priceRange || "all",
    category: initialFilters?.category || "all",
  })

  const [isOpen, setIsOpen] = useState(false)

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const defaultFilters = {
      location: "all",
      rating: "all",
      priceRange: "all",
      category: "all",
    }
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
        <span>Filters</span>
        {hasActiveFilters && (
          <Badge variant="secondary" className="text-xs">
            Active
          </Badge>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted rounded-lg border">
          <div>
            <label className="text-xs font-medium text-gray-500">Category</label>
            <Select
              value={filters.category}
              onValueChange={(value) => handleFilterChange("category", value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500">Location</label>
            <Select
              value={filters.location}
              onValueChange={(value) => handleFilterChange("location", value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="dhaka">Dhaka</SelectItem>
                <SelectItem value="chittagong">Chittagong</SelectItem>
                <SelectItem value="khulna">Khulna</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500">Rating</label>
            <Select
              value={filters.rating}
              onValueChange={(value) => handleFilterChange("rating", value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="All Ratings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="4.5">4.5+</SelectItem>
                <SelectItem value="4.0">4.0+</SelectItem>
                <SelectItem value="3.5">3.5+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500">Price Range</label>
            <Select
              value={filters.priceRange}
              onValueChange={(value) => handleFilterChange("priceRange", value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Any Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Price</SelectItem>
                <SelectItem value="0-50">$0 - $50</SelectItem>
                <SelectItem value="50-100">$50 - $100</SelectItem>
                <SelectItem value="100-200">$100 - $200</SelectItem>
                <SelectItem value="200+">$200+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <div className="col-span-full flex justify-end">
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-500">
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}


// 3️⃣ SERVICE CARD

export function ServiceCard({ service }: { service: any }) {
  return (
    <Link href={`/technicians/${service.technician?.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition cursor-pointer group h-full">
        <div className="relative h-48 w-full bg-gray-100">
          {service.image ? (
            <Image
              src={service.image}
              alt={service.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
              🔧
            </div>
          )}
        </div>

        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg line-clamp-1">{service.name}</CardTitle>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              {service.rating || 0}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pb-2 space-y-2">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={service.technician?.image} />
              <AvatarFallback>{service.technician?.name?.charAt(0) || '?'}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-600">{service.technician?.name || 'Unknown'}</span>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{service.location || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-1 font-semibold text-indigo-600">
              <Clock className="w-4 h-4" />
              <span>${service.price || 0}/hr</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {service.skills?.slice(0, 3).map((skill: string) => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {service.skills?.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{service.skills.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter>
          <Button className="w-full">View Profile</Button>
        </CardFooter>
      </Card>
    </Link>
  )
}


// 4️⃣ SERVICE GRID

export function ServiceGrid({ services, isLoading = false }: { services: any[]; isLoading?: boolean }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-t-lg" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!services || services.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No services found</p>
        <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  )
}


// 5️⃣ TECHNICIAN CARD

export function TechnicianCard({ technician }: { technician: any }) {
  return (
    <Link href={`/technicians/${technician.id}`}>
      <Card className="hover:shadow-lg transition cursor-pointer h-full">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={technician.profilePicture} />
              <AvatarFallback className="text-xl bg-primary/10">
                {technician.name?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground">{technician.name || 'Unknown'}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  {technician.rating || 0}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {technician.location || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mt-3">
            {technician.skills?.slice(0, 3).map((skill: string) => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {technician.skills?.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{technician.skills.length - 3}
              </Badge>
            )}
          </div>

          <div className="mt-3 text-primary font-bold">
            ${technician.pricePerHour || 0}/hr
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}


// 6️⃣ TECHNICIAN GRID

export function TechnicianGrid({ technicians, isLoading = false }: { technicians: any[]; isLoading?: boolean }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-32 rounded-lg" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!technicians || technicians.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No technicians found</p>
        <p className="text-gray-400 text-sm">Try adjusting your search</p>
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


// 7️⃣ TECHNICIAN PROFILE

export function TechnicianProfile({ technician, reviews = [], isLoggedIn = false }: { technician: any; reviews?: any[]; isLoggedIn?: boolean }) {
  const handleBookNow = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault()
      toast.error('Please login or register to book services!')
      setTimeout(() => {
        window.location.href = '/login'
      }, 2000)
    }
  }

  const isAvailable = technician?.isAvailable !== false

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="w-24 h-24 md:w-32 md:h-32">
              <AvatarImage src={technician.profilePicture || "/default-avatar.png"} alt={technician.name} />
              <AvatarFallback className="text-3xl md:text-4xl bg-indigo-100 text-indigo-600">
                {technician.name?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-2xl font-bold">{technician.name}</h1>

              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {technician.rating} ({technician.totalReviews} reviews)
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {technician.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  ${technician.pricePerHour}/hr
                </span>
                <Badge className={isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {isAvailable ? '✅ Available' : '❌ Unavailable'}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {technician.skills?.map((skill: string) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>

              <div className="mt-4">
                {isAvailable ? (
                  <Link href={isLoggedIn ? `/customer_dashboard/booking/${technician.id}` : '#'}>
                    <Button className="w-full md:w-auto" onClick={handleBookNow}>
                      {isLoggedIn ? 'Book Now' : 'Login to Book'}
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
          <p className="text-gray-600">{technician.bio || 'No bio available'}</p>
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
                    <span className="font-semibold">{review.customerName}</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
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
    </div>
  )
}
