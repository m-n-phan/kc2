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

// Local draft representation separate from the shared TrainingModule type in
// `shared` to keep this store self-contained
export interface DraftTrainingModule {
  id: string
  title: string
  description?: string
  steps: TrainingStep[]
  status: 'draft' | 'published'
}

interface TrainingStore {
  modules: DraftTrainingModule[]
  draftModules: DraftTrainingModule[]
  addDraft: (module: DraftTrainingModule) => void
  updateDraft: (id: string, partial: Partial<DraftTrainingModule>) => void
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