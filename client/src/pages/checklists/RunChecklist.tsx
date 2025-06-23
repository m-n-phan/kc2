import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Card } from '../../components'
import { useStartChecklistRun, useCompleteChecklistRun } from '../../hooks/useChecklistRuns'

export const RunChecklist: React.FC = () => {
  const { id = '' } = useParams()
  const [runId, setRunId] = useState('')
  const [notes, setNotes] = useState('')
  const startMutation = useStartChecklistRun()
  const completeMutation = useCompleteChecklistRun()

  const handleStart = async () => {
    const res = await startMutation.mutateAsync(id)
    // @ts-ignore assume id returned
    setRunId(res.id || 'run1')
  }

  const handleComplete = () => {
    completeMutation.mutate({ id: runId, notes })
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-h1 mb-4">Checklist Run</h1>
      {!runId ? (
        <Button onClick={handleStart}>Start Checklist</Button>
      ) : (
        <Card className="p-4 space-y-2">
          <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full border p-2" placeholder="Notes" />
          <Button onClick={handleComplete}>Complete Run</Button>
        </Card>
      )}
    </div>
  )
}
