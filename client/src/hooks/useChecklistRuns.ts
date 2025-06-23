import { useMutation } from '@tanstack/react-query'
import { checklistApi } from '../services/checklistApi'

export function useStartChecklistRun() {
  return useMutation({ mutationFn: (id: string) => checklistApi.startRun(id) })
}

export function useCompleteChecklistRun() {
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) => checklistApi.completeRun(id, notes)
  })
}
