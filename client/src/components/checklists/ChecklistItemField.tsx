import React from 'react'
import { X } from 'lucide-react'

export interface ChecklistItemFieldProps {
  value: string
  onChange: (value: string) => void
  onRemove: () => void
  autoFocus?: boolean
}

export const ChecklistItemField: React.FC<ChecklistItemFieldProps> = ({
  value,
  onChange,
  onRemove,
  autoFocus,
}) => (
  <div className="flex items-center gap-2">
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange"
      autoFocus={autoFocus}
    />
    <button
      type="button"
      onClick={onRemove}
      className="text-slate-500 hover:text-destructive"
      aria-label="Remove item"
    >
      <X className="w-4 h-4" />
    </button>
  </div>
)
