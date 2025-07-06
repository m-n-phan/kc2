import React from 'react'
import { Button, Card } from '../../components'
import { useTrainingAssignments, useStartTrainingAssignment, useCompleteTrainingAssignment } from '../../hooks/useTrainingModules'
import type { TrainingAssignmentWithModule } from '@shared/types/training'

export const TrainingAssignments: React.FC = () => {
  const { data: assignments = [] }: { data?: TrainingAssignmentWithModule[] } =
    useTrainingAssignments()
  const startMutation = useStartTrainingAssignment()
  const completeMutation = useCompleteTrainingAssignment()

  const handleStart = (id: string) => {
    startMutation.mutate(id)
  }

  const handleComplete = (id: string) => {
    completeMutation.mutate({ id })
  }

  return (
    <div className="space-y-section p-8">
      <h1 className="text-h1 text-charcoal mb-4">My Training Assignments</h1>
      {assignments.length === 0 && <p className="text-slate-600">No assignments.</p>}
      <div className="grid gap-4">
        {assignments.map(a => (
          <Card key={a.id} className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-h3">{a.module.title}</h3>
              <p className="text-sm text-slate-600">Status: {a.status}</p>
            </div>
            <div className="flex gap-2">
              {a.status === 'pending' && <Button size="sm" onClick={() => handleStart(a.id)}>Start</Button>}
              {a.status === 'in_progress' && <Button size="sm" onClick={() => handleComplete(a.id)}>Complete</Button>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
