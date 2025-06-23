export interface CompletionTrend {
  date: string
  completionRate: number
}

const mockTrends: CompletionTrend[] = [
  { date: '2024-01-01', completionRate: 75 },
  { date: '2024-02-01', completionRate: 78 },
  { date: '2024-03-01', completionRate: 82 },
  { date: '2024-04-01', completionRate: 86 },
  { date: '2024-05-01', completionRate: 90 },
  { date: '2024-06-01', completionRate: 94 }
]

export const metricsApi = {
  async getCompletionTrends(): Promise<CompletionTrend[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockTrends
  }
}
