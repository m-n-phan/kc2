import React from 'react'

export interface ScheduleSelectorProps {
  value: 'daily' | 'weekly'
  onChange: (value: 'daily' | 'weekly') => void
}

export const ScheduleSelector: React.FC<ScheduleSelectorProps> = ({ value, onChange }) => (
  <div className="flex items-center gap-4">
    <label className="flex items-center gap-1">
      <input
        type="radio"
        checked={value === 'daily'}
        onChange={() => onChange('daily')}
        className="accent-brand-orange"
      />
      Daily
    </label>
    <label className="flex items-center gap-1">
      <input
        type="radio"
        checked={value === 'weekly'}
        onChange={() => onChange('weekly')}
        className="accent-brand-orange"
      />
      Weekly
    </label>
  </div>
)
