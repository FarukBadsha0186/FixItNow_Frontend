'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Loader2, Edit, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export interface ServicesPageProps {
  services: Array<{
    id: string
    title: string
    description: string | null
    price: number
    category: { id: string; name: string }
  }>
  categories: Array<{ id: string; name: string }>
  onCreateService: (data: { title: string; description: string; price: number; categoryId: string }) => Promise<void>
  onUpdateService: (id: string, data: { title?: string; description?: string; price?: number; categoryId?: string }) => Promise<void>
  onDeleteService: (id: string) => Promise<void>
}

const CreateServiceDialog = ({
  open,
  onOpenChange,
  categories,
  onSave,
  isLoading,
  editData,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: ServicesPageProps['categories']
  onSave: (data: any) => Promise<void>
  isLoading: boolean
  editData?: any
}) => {
  const [formData, setFormData] = useState({
    title: editData?.title || '',
    description: editData?.description || '',
    price: editData?.price?.toString() || '',
    categoryId: editData?.category?.id || categories[0]?.id || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSave({
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      categoryId: formData.categoryId,
    })
    setFormData({
      title: '',
      description: '',
      price: '',
      categoryId: categories[0]?.id || '',
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editData ? 'Edit Service' : 'Add New Service'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Service Title</label>
            <input
              type="text"
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="e.g., Plumbing Repair"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Description (Optional)</label>
            <textarea
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              rows={3}
              placeholder="Describe what this service includes"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Price ($)</label>
            <input
              type="number"
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Category</label>
            <select
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              required
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editData ? 'Update Service' : 'Create Service'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function ServicesPage({ 
  services, 
  categories, 
  onCreateService,
  onUpdateService,
  onDeleteService
}: ServicesPageProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<any>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleCreateService = async (data: any) => {
    setIsCreating(true)
    try {
      await onCreateService(data)
    } finally {
      setIsCreating(false)
    }
  }

  const handleUpdateService = async (data: any) => {
    setIsCreating(true)
    try {
      await onUpdateService(selectedService.id, data)
      setSelectedService(null)
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteService = async () => {
    if (!selectedService) return
    setIsDeleting(true)
    try {
      await onDeleteService(selectedService.id)
      setDeleteDialogOpen(false)
      setSelectedService(null)
    } finally {
      setIsDeleting(false)
    }
  }

  const openEditDialog = (service: any) => {
    setSelectedService(service)
    setDialogOpen(true)
  }

  const openDeleteDialog = (service: any) => {
    setSelectedService(service)
    setDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Services</h1>
          <p className="text-muted-foreground">Manage your service offerings</p>
        </div>
        <Button onClick={() => { setSelectedService(null); setDialogOpen(true) }} className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Service
        </Button>
      </div>

      {/* Services Grid */}
      {services.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card py-12">
          <p className="text-lg text-muted-foreground">You haven&apos;t added any services yet</p>
          <Button onClick={() => { setSelectedService(null); setDialogOpen(true) }} className="mt-4" variant="outline">
            Create Your First Service
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div key={service.id} className="rounded-lg border border-border bg-card p-6 relative group">
              <div className="mb-4 flex items-start justify-between">
                <h3 className="text-lg font-semibold text-foreground">{service.title}</h3>
                <Badge variant="outline">{service.category.name}</Badge>
              </div>

              {service.description && (
                <p className="mb-4 text-sm text-muted-foreground line-clamp-3">{service.description}</p>
              )}

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">
                  ${service.price.toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground">per service</span>
              </div>

              {/* Action Buttons */}
              <div className="absolute top-4 right-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => openEditDialog(service)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-red-500 hover:text-red-700"
                  onClick={() => openDeleteDialog(service)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <CreateServiceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        categories={categories}
        onSave={selectedService ? handleUpdateService : handleCreateService}
        isLoading={isCreating}
        editData={selectedService}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedService?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteService} disabled={isDeleting} className="bg-red-500 hover:bg-red-600">
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}