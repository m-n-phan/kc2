import { create } from 'zustand'
import { nanoid } from 'nanoid'

export type ContentBlock =
  | { kind: 'text-md'; md: string }
  | { kind: 'media'; url: string; type: 'image' | 'video' }

export type QuizBlock = {
  kind: 'quiz'
  question: string
  options: { id: string; text: string; correct: boolean }[]
}

export interface TrainingStep {
  id: string
  title: string
  blocks: (ContentBlock | QuizBlock)[]
}

export interface TrainingModule {
  id: string
  title: string
  description?: string
  steps: TrainingStep[]
  status: 'draft' | 'published'
}

interface TrainingStore {
  modules: TrainingModule[]
  draftModules: TrainingModule[]
  addDraft: (module: TrainingModule) => void
  updateDraft: (id: string, partial: Partial<TrainingModule>) => void
  publish: (id: string) => void
}

const useTrainingStore = create<TrainingStore>((set) => ({
  modules: [],
  draftModules: [],
  addDraft: (module) => 
    set((state) => ({ 
      draftModules: [...state.draftModules, { ...module, id: module.id || nanoid() }] 
    })),
  updateDraft: (id, partial) =>
    set((state) => ({
      draftModules: state.draftModules.map(draft => 
        draft.id === id ? { ...draft, ...partial } : draft
      )
    })),
  publish: (id) =>
    set((state) => {
      const module = state.draftModules.find(d => d.id === id)!
      return {
        draftModules: state.draftModules.filter(d => d.id !== id),
        modules: [...state.modules, { ...module, status: 'published' }]
      }
    })
}))

export default useTrainingStore 