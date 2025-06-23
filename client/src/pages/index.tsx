import React, { useState } from 'react'
import { ChecklistForm, ChecklistFormValues } from '../components/checklists'
import useChecklistStore from '../store/useChecklistStore'
import { Button, Card } from '../components'

// Page Components
export { Dashboard } from './Dashboard'
export { Training } from './Training'
export { Register } from './Register'
export { ResetPassword } from './ResetPassword'

export { Reports } from './Reports'
export { Settings } from './Settings'

// Placeholder pages for navigation
export const Checklists: React.FC = () => {
  const [creating, setCreating] = useState(false)
  const drafts = useChecklistStore((s) => s.drafts)
  const addDraft = useChecklistStore((s) => s.addDraft)

  const handleSubmit = (values: ChecklistFormValues) => {
    const draft = {

    const draft: ChecklistDraft = {
      id: values.id,
      title: values.title,
      items: values.items,
      frequency: values.schedule,
    }
    addDraft(draft)
    setCreating(false)
  }

  return (
    <div className="space-y-section p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-h1 text-charcoal">Checklists</h1>
        <Button onClick={() => setCreating((c) => !c)}>
          {creating ? 'Cancel' : 'New Checklist'}
        </Button>
      </div>

      {creating && <ChecklistForm onSubmit={handleSubmit} />}

      <div className="grid gap-4">
        {drafts.map((d) => (
          <Card key={d.id} className="p-4">
            <h3 className="text-h3 mb-1">{d.title}</h3>
            <p className="text-sm text-slate-600 capitalize">{d.frequency}</p>
            <p className="text-sm text-slate-600">{d.items.length} items</p>
          </Card>
        ))}
        {drafts.length === 0 && !creating && (
          <p className="text-slate-600">No checklists yet.</p>
        )}
      </div>
    </div>
  )
}


export const NotFound: React.FC = () => (
  <div className="p-8 text-center">
    <h1 className="text-h1 text-charcoal mb-4">404 - Page Not Found</h1>
    <p className="text-slate-600">The page you're looking for doesn't exist.</p>
  </div>
) 
