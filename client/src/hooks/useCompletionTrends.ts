import { useQuery } from '@tanstack/react-query'
import { metricsApi } from '../services/metricsApi'

const QUERY_KEYS = {
  completionTrends: ['metrics', 'completionTrends'] as const
}

export function useCompletionTrends() {
  return useQuery({
    queryKey: QUERY_KEYS.completionTrends,
    queryFn: metricsApi.getCompletionTrends,
    staleTime: 5 * 60 * 1000
  })
}
