import React, { useState } from 'react'
import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { Button } from './Button'  
import { Card } from './Card'
import { ChevronDown, ChevronRight, Trash2, Upload } from 'lucide-react'

interface FormData {
  title: string
  description: string
  steps: Array<{
    id: string
    title: string
    content: string
    mediaUrl?: string
  }>
}

interface ModuleStepFieldProps {
  index: number
  register: UseFormRegister<FormData>
  errors: FieldErrors<FormData>
  onRemove: () => void
  canRemove: boolean
}

export const ModuleStepField: React.FC<ModuleStepFieldProps> = ({
  index,
  register,
  errors,
  onRemove,
  canRemove
}) => {
  const [isExpanded, setIsExpanded] = useState(index === 0)
  const [mediaPreview, setMediaPreview] = useState<string>('')

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setMediaPreview(url)
    }
  }

  const stepError = errors.steps && Array.isArray(errors.steps) ? errors.steps[index] : undefined

  return (
    <Card className="border-slate-200">
      <div className="p-4">
        {/* Step Header */}
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm font-medium text-charcoal hover:text-brand-orange transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            Step {index + 1}
          </button>
          
          {canRemove && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Step Content */}
        {isExpanded && (
          <div className="space-y-4">
            {/* Step Title */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Step Title *
              </label>
              <input
                {...register(`steps.${index}.title`, {
                  required: 'Step title is required'
                })}
                type="text"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange"
                placeholder="Enter step title"
              />
              {stepError?.title && (
                <p className="mt-1 text-sm text-destructive">{stepError.title.message}</p>
              )}
            </div>

            {/* Step Content */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Content (Markdown) *
              </label>
              <textarea
                {...register(`steps.${index}.content`, {
                  required: 'Step content is required'
                })}
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange resize-none"
                placeholder="Enter step content in Markdown format..."
              />
              {stepError?.content && (
                <p className="mt-1 text-sm text-destructive">{stepError.content.message}</p>
              )}
            </div>

            {/* Media Upload */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Media (Image/Video)
              </label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => document.getElementById(`media-${index}`)?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Choose File
                </Button>
                <input
                  id={`media-${index}`}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleMediaUpload}
                  className="hidden"
                />
                {mediaPreview && (
                  <span className="text-sm text-slate-600">File selected</span>
                )}
              </div>
              {mediaPreview && (
                <div className="mt-2">
                  {mediaPreview.includes('image') ? (
                    <img src={mediaPreview} alt="Preview" className="w-20 h-20 object-cover rounded" />
                  ) : (
                    <video src={mediaPreview} className="w-20 h-20 object-cover rounded" />
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
} 
