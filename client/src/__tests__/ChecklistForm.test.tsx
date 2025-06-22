import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ChecklistForm } from '../components/checklists/ChecklistForm'

describe('ChecklistForm', () => {
  it('submits entered data', () => {
    const handleSubmit = vi.fn()
    render(<ChecklistForm onSubmit={handleSubmit} />)

    fireEvent.change(screen.getByLabelText(/Checklist Title/i), { target: { value: 'Test' } })
    fireEvent.change(screen.getAllByRole('textbox')[1], { target: { value: 'Item 1' } })
    fireEvent.click(screen.getByLabelText('Weekly'))
    fireEvent.click(screen.getByRole('button', { name: /Save Checklist/i }))

    expect(handleSubmit).toHaveBeenCalled()
    const values = handleSubmit.mock.calls[0][0]
    expect(values.title).toBe('Test')
    expect(values.schedule).toBe('weekly')
    expect(values.items[0].text).toBe('Item 1')
  })

  it('adds new item field', () => {
    render(<ChecklistForm onSubmit={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: 'Add Item' }))
    expect(screen.getAllByRole('textbox')).toHaveLength(3)
  })
})
