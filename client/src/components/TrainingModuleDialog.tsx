import React, { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { useForm, useFieldArray } from 'react-hook-form'
import { Button } from './Button'
import { ModuleStepField } from './ModuleStepField'
import useTrainingStore, { DraftTrainingModule, TrainingStep } from '../store/useTrainingStore'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { nanoid } from 'nanoid'

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

interface TrainingModuleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const TrainingModuleDialog: React.FC<TrainingModuleDialogProps> = ({
  open,
  onOpenChange
}) => {
  const [step, setStep] = useState(1)
  const { addDraft, publish } = useTrainingStore()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      steps: [{ id: nanoid(), title: '', content: '', mediaUrl: '' }]
    },
    mode: 'onChange'
  })

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'steps'
  })

  const steps = ['Module Details', 'Build Steps', 'Review & Save']

  const formatSteps = (stepsData: FormData['steps']): TrainingStep[] =>
    stepsData.map((s) => ({
      id: s.id,
      title: s.title,
      blocks: [
        { kind: 'text-md', md: s.content } as const,
        ...(s.mediaUrl
          ? [{ kind: 'media', url: s.mediaUrl, type: 'image' } as const]
          : [])
      ]
    }))

  const onSaveDraft = (data: FormData) => {
    const module: DraftTrainingModule = {
      id: nanoid(),
      title: data.title,
      description: data.description || undefined,
      steps: data.steps.map<TrainingStep>((s) => ({
        id: s.id,
        title: s.title,
        blocks: [
          { kind: 'text-md', md: s.content },
          ...(s.mediaUrl ? [{ kind: 'media', url: s.mediaUrl, type: 'image' } as const] : [])

          { kind: 'text-md', md: s.content } as const,
          ...(s.mediaUrl ? [{ kind: 'media', url: s.mediaUrl, type: 'image' } as const] : [])


          { kind: 'text-md', md: s.content } as const,

          { kind: 'text-md', md: s.content },
          ...(s.mediaUrl
            ? [{ kind: 'media', url: s.mediaUrl, type: 'image' } as const]
            : [])
        ]
      })),

      steps: formatSteps(data.steps),
      status: 'draft'
    }

    addDraft(module)
    onOpenChange(false)
  }

  const onPublish = (data: FormData) => {
    const module: DraftTrainingModule = {
      id: nanoid(),
      title: data.title,
      description: data.description || undefined,
      steps: data.steps.map<TrainingStep>((s) => ({
        id: s.id,
        title: s.title,
        blocks: [
          { kind: 'text-md', md: s.content },
          ...(s.mediaUrl ? [{ kind: 'media', url: s.mediaUrl, type: 'image' } as const] : [])

          { kind: 'text-md', md: s.content } as const,
          ...(s.mediaUrl ? [{ kind: 'media', url: s.mediaUrl, type: 'image' } as const] : [])


          { kind: 'text-md', md: s.content } as const,

          { kind: 'text-md', md: s.content },
          ...(s.mediaUrl
            ? [{ kind: 'media', url: s.mediaUrl, type: 'image' } as const]
            : [])
        ]
      })),

      steps: formatSteps(data.steps),
      status: 'draft'
    }

    addDraft(module)
    publish(module.id)
    onOpenChange(false)
  }

  const nextStep = () => setStep(Math.min(step + 1, 3))
  const prevStep = () => setStep(Math.max(step - 1, 1))

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[720px] max-h-[90vh] bg-white rounded-lg shadow-lg z-50 overflow-hidden sm:w-[720px]">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div>
              <Dialog.Title className="text-h2 text-charcoal">Create Training Module</Dialog.Title>
              <Dialog.Description className="text-sm text-slate-600 mt-1">
                Build rich training content with interactive blocks
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Stepper */}
          <div className="px-6 py-4 border-b border-slate-100">
            <div className="flex items-center justify-center gap-4">
              {steps.map((stepName, index) => (
                <div key={stepName} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                    index + 1 === step 
                      ? 'bg-brand-orange text-white' 
                      : index + 1 < step 
                      ? 'bg-green-500 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    {index + 1}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    index + 1 === step ? 'text-brand-orange' : 'text-slate-500'
                  }`}>
                    {stepName}
                  </span>
                  {index < steps.length - 1 && (
                    <div className="w-8 h-px bg-slate-200 mx-4" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    Module Title *
                  </label>
                  <input
                    {...register('title', {
                      required: 'Title is required',
                      minLength: { value: 4, message: 'Title must be at least 4 characters' },
                      maxLength: { value: 120, message: 'Title must be 120 characters or less' }
                    })}
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-destructive">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    Description
                  </label>
                  <textarea
                    {...register('description', {
                      maxLength: { value: 280, message: 'Description must be 280 characters or less' }
                    })}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange resize-none"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-destructive">{errors.description.message}</p>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-h3">Training Steps</h3>
                {fields.map((field, index) => (
                  <div key={field.id} className="space-y-2">
                    <ModuleStepField
                      index={index}
                      register={register}
                      errors={errors}
                      onRemove={() => remove(index)}
                      canRemove={fields.length > 1}
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        aria-label="Move step up"
                        onClick={() => move(index, index - 1)}
                        disabled={index === 0}
                      >
                        <ChevronLeft className="w-4 h-4 rotate-90" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        aria-label="Move step down"
                        onClick={() => move(index, index + 1)}
                        disabled={index === fields.length - 1}
                      >
                        <ChevronRight className="w-4 h-4 rotate-90" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="ghost" onClick={() => append({ id: nanoid(), title: '', content: '', mediaUrl: '' })}>
                  Add Step
                </Button>
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 className="text-h3 mb-4">Review & Save</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-charcoal">Title: </span>
                    <span className="text-sm text-slate-600">{watch('title') || 'Untitled'}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-charcoal">Description: </span>
                    <span className="text-sm text-slate-600">{watch('description') || 'No description'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-slate-200">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={step === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex items-center gap-3">
              {step === 3 ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={handleSubmit(onSaveDraft)}
                    disabled={!isValid}
                  >
                    Save Draft
                  </Button>
                  <Button
                    onClick={handleSubmit(onPublish)}
                    disabled={!isValid}
                  >
                    Publish Module
                  </Button>
                </>
              ) : (
                <Button
                  onClick={nextStep}
                  disabled={step === 1 && !watch('title')}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
} 
