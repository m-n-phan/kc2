import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TrainingAssignments } from '../pages/training/Assignments'
import * as trainingHooks from '../hooks/useTrainingModules'
vi.mock('../utils/offline', () => ({ queueRequest: vi.fn() }))

const queryClient = new QueryClient()

vi.spyOn(trainingHooks, 'useTrainingAssignments').mockReturnValue({ data: [
  { id: 'a1', status: 'pending', module: { id: 'm1', title: 'Test', description: '', estimatedDuration: 5 } }
] })

const startMock = vi.fn()
const completeMock = vi.fn()
vi.spyOn(trainingHooks, 'useStartTrainingAssignment').mockReturnValue({ mutate: startMock })
vi.spyOn(trainingHooks, 'useCompleteTrainingAssignment').mockReturnValue({ mutate: completeMock })

describe('Training assignment flow UI', () => {
  it('starts and completes assignment', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <TrainingAssignments />
      </QueryClientProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: /start/i }))
    expect(startMock).toHaveBeenCalledWith('a1')

    vi.mocked(trainingHooks.useTrainingAssignments).mockReturnValue({ data: [
      { id: 'a1', status: 'in_progress', module: { id: 'm1', title: 'Test' } }
    ] })

    render(
      <QueryClientProvider client={queryClient}>
        <TrainingAssignments />
      </QueryClientProvider>
    )
    fireEvent.click(screen.getByRole('button', { name: /complete/i }))
    expect(completeMock).toHaveBeenCalledWith({ id: 'a1' })
  })
})
