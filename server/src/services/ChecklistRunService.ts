export interface ChecklistRun {
  id: string
  checklistId: string
  completedBy: string
  status: 'pending' | 'in_progress' | 'completed' | 'overdue'
  startedAt: string
  completedAt?: string
  notes?: string
}

export interface ChecklistRunItemUpdate {
  id: string
  isCompleted?: boolean
  notes?: string
}

export interface CompleteChecklistRunRequest {
  notes?: string
  items?: ChecklistRunItemUpdate[]
}

export interface ChecklistRunService {
  startRun(checklistId: string, userId: string): Promise<ChecklistRun | { success: boolean; message: string }>
  completeRun(id: string, userId: string, data: CompleteChecklistRunRequest): Promise<ChecklistRun | { success: boolean; message: string }>
}
