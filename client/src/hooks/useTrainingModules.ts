import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { trainingApi } from '../services/trainingApi'
import type { 
  TrainingModule, 
  CreateTrainingModuleRequest, 
  UpdateTrainingModuleRequest 
} from '@shared/types/training'

// Query keys
const QUERY_KEYS = {
  trainingModules: ['training', 'modules'] as const,
  trainingModule: (id: string) => ['training', 'modules', id] as const,
  trainingAssignments: ['training', 'assignments'] as const,
}

// Hook for fetching all training modules
export function useTrainingModules() {
  return useQuery({
    queryKey: QUERY_KEYS.trainingModules,
    queryFn: trainingApi.getModules,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook for fetching a specific training module
export function useTrainingModule(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.trainingModule(id),
    queryFn: () => trainingApi.getModule(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

// Hook for fetching user's training assignments
export function useTrainingAssignments() {
  return useQuery({
    queryKey: QUERY_KEYS.trainingAssignments,
    queryFn: trainingApi.getMyAssignments,
    staleTime: 2 * 60 * 1000, // 2 minutes - more frequent updates for assignments
  })
}

// Hook for creating a training module
export function useCreateTrainingModule() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateTrainingModuleRequest) => trainingApi.createModule(data),
    onSuccess: () => {
      // Invalidate and refetch training modules list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trainingModules })
    },
  })
}

// Hook for updating a training module
export function useUpdateTrainingModule() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTrainingModuleRequest }) => 
      trainingApi.updateModule(id, data),
    onSuccess: (updatedModule: TrainingModule) => {
      // Update the specific module in cache
      queryClient.setQueryData(
        QUERY_KEYS.trainingModule(updatedModule.id), 
        updatedModule
      )
      // Invalidate the modules list to reflect changes
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trainingModules })
    },
  })
}

// Hook for deleting a training module
export function useDeleteTrainingModule() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => trainingApi.deleteModule(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: QUERY_KEYS.trainingModule(deletedId) })
      // Invalidate modules list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trainingModules })
    },
  })
}

// Hook for starting a training assignment
export function useStartTrainingAssignment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (assignmentId: string) => trainingApi.startAssignment(assignmentId),
    onSuccess: () => {
      // Invalidate assignments to reflect the status change
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trainingAssignments })
    },
  })
}

// Hook for completing a training assignment
export function useCompleteTrainingAssignment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, score }: { id: string; score?: number }) => 
      trainingApi.completeAssignment(id, { score }),
    onSuccess: () => {
      // Invalidate assignments to reflect the completion
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trainingAssignments })
    },
  })
} 
