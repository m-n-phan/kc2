import React, { useState } from 'react'
import { Button } from './Button'
import { Card } from './Card'
import { X } from 'lucide-react'
import { useCreateTrainingModule } from '../hooks/useTrainingModules'

interface CreateModuleModalProps {
  isOpen: boolean
  onClose: () => void
}

export const CreateModuleModal: React.FC<CreateModuleModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    estimatedDuration: '',
    status: 'draft' as const
  })
  
  const createModuleMutation = useCreateTrainingModule()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      alert('Please enter a title')
      return
    }

    try {
      await createModuleMutation.mutateAsync({
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        content: { sections: [] },
        estimatedDuration: formData.estimatedDuration ? parseInt(formData.estimatedDuration) : undefined
      })
      
      // Reset form and close modal
      setFormData({
        title: '',
        description: '',
        estimatedDuration: '',
        status: 'draft'
      })
      onClose()
    } catch (error) {
      console.error('Failed to create module:', error)
      alert('Failed to create training module. Please try again.')
    }
  }

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-h2 text-charcoal">Create Training Module</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-charcoal mb-1">
                Title *
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={handleChange('title')}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange"
                placeholder="Enter module title"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-charcoal mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={handleChange('description')}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange resize-none"
                placeholder="Brief description of the training module"
              />
            </div>

            <div>
              <label htmlFor="estimatedDuration" className="block text-sm font-medium text-charcoal mb-1">
                Estimated Duration (minutes)
              </label>
              <input
                id="estimatedDuration"
                type="number"
                value={formData.estimatedDuration}
                onChange={handleChange('estimatedDuration')}
                min="1"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange"
                placeholder="e.g., 30"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-charcoal mb-1">
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={handleChange('status')}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={onClose}
                disabled={createModuleMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={createModuleMutation.isPending || !formData.title.trim()}
              >
                {createModuleMutation.isPending ? 'Creating...' : 'Create Module'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
} 