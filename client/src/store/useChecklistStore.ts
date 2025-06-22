import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'

export interface ChecklistItem {
  id: string
  text: string
}

export type ChecklistFrequency = 'daily' | 'weekly'

export interface ChecklistDraft {
  id: string
  title: string
  items: ChecklistItem[]
  frequency: ChecklistFrequency
}

export interface ChecklistRun {
  id: string
  checklistId: string
  completedAt: string
}

interface ChecklistStore {
  drafts: ChecklistDraft[]
  runs: ChecklistRun[]
  addDraft: (draft: ChecklistDraft) => void
  updateDraft: (id: string, partial: Partial<ChecklistDraft>) => void
  removeDraft: (id: string) => void
  addRun: (run: ChecklistRun) => void
}

const useChecklistStore = create<ChecklistStore>()(
  persist(
    (set) => ({
      drafts: [],
      runs: [],
      addDraft: (draft) =>
        set((state) => ({
          drafts: [...state.drafts, { ...draft, id: draft.id || nanoid() }],
        })),
      updateDraft: (id, partial) =>
        set((state) => ({
          drafts: state.drafts.map((d) => (d.id === id ? { ...d, ...partial } : d)),
        })),
      removeDraft: (id) =>
        set((state) => ({ drafts: state.drafts.filter((d) => d.id !== id) })),
      addRun: (run) =>
        set((state) => ({
          runs: [...state.runs, { ...run, id: run.id || nanoid() }],
        })),
    }),
    { name: 'checklist-store' }
  )
)

export default useChecklistStore
