export type TrainingStatus = 'draft' | 'active' | 'archived'
export type AssignmentStatus = 'pending' | 'in_progress' | 'completed' | 'overdue'

export interface TrainingModuleContent {
  sections?: TrainingSection[]
}

export interface TrainingSection {
  title: string
  content: string
  type: 'text' | 'video' | 'quiz' | 'checklist'
}

export interface TrainingModule {
  id: string
  title: string
  description?: string
  content: TrainingModuleContent
  estimatedDuration?: number // minutes
  version?: number
  status: TrainingStatus
  createdBy?: string
  createdAt: string
  updatedAt: string
}

export interface TrainingModuleListItem {
  id: string
  title: string
  description?: string
  estimatedDuration?: number
  enrollmentCount?: number
  status: TrainingStatus
  createdAt: string
  creator?: {
    id: string
    name: string
  }
}

export interface TrainingAssignment {
  id: string
  moduleId: string
  assignedTo: string
  assignedBy: string
  status: AssignmentStatus
  dueDate?: string
  startedAt?: string
  completedAt?: string
  score?: number // 0-100
  createdAt: string
  updatedAt: string
}

export interface TrainingAssignmentWithModule {
  id: string
  status: AssignmentStatus
  dueDate?: string
  startedAt?: string
  completedAt?: string
  score?: number
  module: {
    id: string
    title: string
    description?: string
    estimatedDuration?: number
  }
}

export interface CreateTrainingModuleRequest {
  title: string
  description?: string
  content: TrainingModuleContent
  estimatedDuration?: number
}

export interface UpdateTrainingModuleRequest extends Partial<CreateTrainingModuleRequest> {}

export interface AssignTrainingModuleRequest {
  moduleId: string
  assignedTo: string[]
  dueDate?: string
}

export interface CompleteTrainingAssignmentRequest {
  score?: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  details?: unknown
} 
