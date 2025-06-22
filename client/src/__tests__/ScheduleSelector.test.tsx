import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ScheduleSelector } from '../components/checklists/ScheduleSelector'

describe('ScheduleSelector', () => {
  it('calls onChange with selected value', () => {
    const fn = vi.fn()
    render(<ScheduleSelector value="daily" onChange={fn} />)
    fireEvent.click(screen.getByLabelText('Weekly'))
    expect(fn).toHaveBeenCalledWith('weekly')
  })
})
