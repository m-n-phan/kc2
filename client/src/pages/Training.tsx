import React, { useState } from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { TrainingModuleCard } from '../components/TrainingModuleCard'
import { TrainingModuleDialog } from '../components/TrainingModuleDialog'
import { BookOpen, Plus, AlertCircle, Loader2 } from 'lucide-react'
import { useTrainingModules, useDeleteTrainingModule } from '../hooks/useTrainingModules'

export const Training: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  
  const { 
    data: modules = [], 
    isLoading, 
    error,
    isError 
  } = useTrainingModules()
  
  const deleteModuleMutation = useDeleteTrainingModule()

  const handleStartTraining = (moduleId: string) => {
    // TODO: Navigate to training module viewer
    console.log('Starting training module:', moduleId)
  }

  const handleEditModule = (moduleId: string) => {
    // TODO: Navigate to training module editor
    console.log('Editing training module:', moduleId)
  }

  const handleDeleteModule = async (moduleId: string) => {
    if (window.confirm('Are you sure you want to delete this training module?')) {
      try {
        await deleteModuleMutation.mutateAsync(moduleId)
      } catch (error) {
        console.error('Failed to delete training module:', error)
        // TODO: Show error toast
      }
    }
  }

  const handleCreateModule = () => {
    setShowCreateModal(true)
  }

  return (
    <div className="space-y-section">
      {/* Page Header */}
      <div>
        <h1 className="text-h1 text-charcoal mb-2">Training Modules</h1>
        <div className="flex items-center justify-between">
          <p className="text-slate-600">Manage and track employee training progress</p>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">Filter</Button>
            <Button variant="ghost" size="sm">Sort</Button>
            <Button 
              onClick={handleCreateModule}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Module
            </Button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-slate-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading training modules...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <Card className="p-6 border-red-200 bg-red-50">
          <div className="flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <div>
              <h3 className="font-medium">Failed to load training modules</h3>
              <p className="text-sm text-red-600 mt-1">
                {error instanceof Error ? error.message : 'An unexpected error occurred'}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Training Modules Grid */}
      {!isLoading && !isError && modules.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
          {modules.map((module) => (
            <TrainingModuleCard
              key={module.id}
              module={module}
              onStart={handleStartTraining}
              onEdit={handleEditModule}
              onDelete={handleDeleteModule}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && modules.length === 0 && (
        <Card className="p-8 border-2 border-dashed border-slate-200 bg-slate-50/50">
          <div className="text-center">
            <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-h3 text-slate-600 mb-2">No training modules yet</h3>
            <p className="text-sm text-slate-500 mb-4 max-w-md mx-auto">
              Get started by creating your first training module. You can add content, set duration, and assign it to team members.
            </p>
            <Button 
              onClick={handleCreateModule}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Your First Module
            </Button>
          </div>
        </Card>
      )}

      {/* Development Note */}
      {!isLoading && !isError && (
        <Card className="p-4 border-blue-200 bg-blue-50">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <div className="text-sm">
              <p className="text-blue-800 font-medium">Development Mode</p>
              <p className="text-blue-700 mt-1">
                Training modules are loaded from the API. To see data, ensure the server is running and has a connected database.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Create Module Dialog */}
      <TrainingModuleDialog 
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </div>
  )
} 