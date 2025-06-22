import { describe, it, expect, beforeEach } from 'vitest'
import useChecklistStore from '../store/useChecklistStore'

describe('useChecklistStore', () => {
  beforeEach(() => {
    useChecklistStore.setState({ drafts: [], runs: [] })
    localStorage.clear()
  })

  it('adds a draft', () => {
    useChecklistStore.getState().addDraft({ id: '1', title: 'A', items: [], frequency: 'daily' })
    expect(useChecklistStore.getState().drafts).toHaveLength(1)
  })

  it('updates a draft', () => {
    useChecklistStore.getState().addDraft({ id: '1', title: 'A', items: [], frequency: 'daily' })
    useChecklistStore.getState().updateDraft('1', { title: 'B' })
    expect(useChecklistStore.getState().drafts[0].title).toBe('B')
  })

  it('adds a run', () => {
    useChecklistStore.getState().addRun({ id: 'r1', checklistId: '1', completedAt: 'now' })
    expect(useChecklistStore.getState().runs).toHaveLength(1)
  })
})
