import React, { useState } from 'react'
import { nanoid } from 'nanoid'
import { Button } from '../Button'
import { ChecklistItemField } from './ChecklistItemField'
import { ScheduleSelector } from './ScheduleSelector'

export interface ChecklistItem {
  id: string
  text: string
}

export interface ChecklistFormValues {
  id: string
  title: string
  schedule: 'daily' | 'weekly'
  items: ChecklistItem[]
}

interface ChecklistFormProps {
  initialValues?: Partial<ChecklistFormValues>
  onSubmit: (values: ChecklistFormValues) => void
}

export const ChecklistForm: React.FC<ChecklistFormProps> = ({ initialValues, onSubmit }) => {
  const [title, setTitle] = useState(initialValues?.title || '')
  const [schedule, setSchedule] = useState<'daily' | 'weekly'>(initialValues?.schedule || 'daily')
  const [items, setItems] = useState<ChecklistItem[]>(initialValues?.items || [{ id: nanoid(), text: '' }])

  const addItem = () => setItems([...items, { id: nanoid(), text: '' }])
  const updateItem = (id: string, text: string) => setItems(items.map(i => i.id === id ? { ...i, text } : i))
  const removeItem = (id: string) => setItems(items.filter(i => i.id !== id))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      id: initialValues?.id || nanoid(),
      title,
      schedule,
      items: items.filter(i => i.text.trim() !== '')
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="cl-title" className="block text-sm font-medium mb-1">Checklist Title *</label>
        <input
          id="cl-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Schedule *</label>
        <ScheduleSelector value={schedule} onChange={setSchedule} />
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <ChecklistItemField
            key={item.id}
            value={item.text}
            onChange={(text) => updateItem(item.id, text)}
            onRemove={() => removeItem(item.id)}
            autoFocus={index === 0}
          />
        ))}
        <Button type="button" variant="ghost" onClick={addItem}>Add Item</Button>
      </div>

      <div className="text-right">
        <Button type="submit" disabled={!title.trim() || items.length === 0}>Save Checklist</Button>
      </div>
    </form>
  )
}
