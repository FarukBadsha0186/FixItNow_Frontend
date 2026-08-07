"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ArrowRight, Star, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getServices, getTechnicians } from "./_public_action/action"
import { ServiceGrid } from "../(public_group)/_public_components/public_components"
import { toast } from "sonner"

export default function HomePage() {
  const [services, setServices] = useState([])
  const [technicians, setTechnicians] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        
        const [servicesRes, techniciansRes] = await Promise.all([
          getServices({ search: searchTerm || undefined }),
          getTechnicians({ search: searchTerm || undefined })
        ])
        setServices(servicesRes?.data?.slice(0, 8) || [])
        setTechnicians(techniciansRes?.data?.slice(0, 6) || [])
      } catch (error) {
        toast.error("Failed to load data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [searchTerm])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Trusted Home Service Professionals
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-indigo-100">
            Book verified technicians for plumbing, electrical, cleaning & more
          </p>
          
          
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Popular Services</h2>
              <p className="text-gray-600 mt-1">Book trusted professionals for your home</p>
            </div>
            <Link href="/services">
              <Button variant="outline" className="gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
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
          ) : services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No services found</p>
            </div>
          ) : (
            <ServiceGrid services={services} />
          )}
        </div>
      </section>

      {/* Technicians Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Top Technicians</h2>
              <p className="text-gray-600 mt-1">Highly rated professionals near you</p>
            </div>
            <Link href="/technicians">
              <Button variant="outline" className="gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-32 rounded-lg" />
                  <div className="bg-white p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : technicians.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No technicians found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {technicians.map((tech: any) => (
                <TechnicianCard key={tech.id} technician={tech} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-indigo-100 mb-6">
            Join thousands of satisfied customers who trust us for their home services
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Sign Up Free
              </Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-indigo-700">
                Browse Services
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}


function TechnicianCard({ technician }: { technician: any }) {
  return (
    <Link href={`/technicians/${technician.id}`}>
      <Card className="hover:shadow-lg transition cursor-pointer h-full">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-xl font-semibold text-indigo-600">
              {technician.name?.charAt(0) || "?"}
            </div>
            <div>
              <h3 className="font-semibold">{technician.name || "Unknown"}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  {technician.rating || 0}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {technician.location || "N/A"}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1">
            {technician.skills?.slice(0, 3).map((skill: string) => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
          <div className="mt-3 text-primary font-bold">
            ${technician.pricePerHour || 0}/hr
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}