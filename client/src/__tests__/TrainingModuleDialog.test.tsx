import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TrainingModuleDialog } from '../components/TrainingModuleDialog'

const noop = () => {}

describe('TrainingModuleDialog step builder', () => {
  it('adds a new step', () => {
    render(<TrainingModuleDialog open onOpenChange={noop} />)
    fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: 'Test' } })
    fireEvent.click(screen.getByRole('button', { name: /Next/i }))
    fireEvent.click(screen.getByRole('button', { name: /Add Step/i }))
    expect(screen.getByText('Step 2')).toBeInTheDocument()
  })

  it('removes a step', () => {
    render(<TrainingModuleDialog open onOpenChange={noop} />)
    fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: 'Test' } })
    fireEvent.click(screen.getByRole('button', { name: /Next/i }))
    fireEvent.click(screen.getByRole('button', { name: /Add Step/i }))
    const removeButtons = screen.getAllByLabelText('Remove step')
    fireEvent.click(removeButtons[1])
    expect(screen.queryByText('Step 2')).not.toBeInTheDocument()
  })

  it('reorders steps', () => {
    render(<TrainingModuleDialog open onOpenChange={noop} />)
    fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: 'Test' } })
    fireEvent.click(screen.getByRole('button', { name: /Next/i }))
    fireEvent.click(screen.getByRole('button', { name: /Add Step/i }))
    fireEvent.click(screen.getByRole('button', { name: /Add Step/i }))
    fireEvent.click(screen.getByRole('button', { name: 'Step 2' }))
    fireEvent.click(screen.getByRole('button', { name: 'Step 3' }))
    const inputs = screen.getAllByPlaceholderText('Enter step title')
    fireEvent.change(inputs[0], { target: { value: 'A' } })
    fireEvent.change(inputs[1], { target: { value: 'B' } })
    fireEvent.change(inputs[2], { target: { value: 'C' } })
    const moveDown = screen.getAllByLabelText('Move step down')
    fireEvent.click(moveDown[0])
    const newInputs = screen.getAllByPlaceholderText('Enter step title')
    expect(newInputs[0]).toHaveValue('B')
    expect(newInputs[1]).toHaveValue('A')
  })
})
