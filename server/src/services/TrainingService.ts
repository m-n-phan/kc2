import {
  TrainingModuleListItem,
  TrainingModule,
  TrainingAssignmentWithModule,
  CreateTrainingModuleRequest,
  UpdateTrainingModuleRequest,
  AssignTrainingModuleRequest,
  CompleteTrainingAssignmentRequest,
  TrainingAssignment
} from '@shared/types/training'

export interface TrainingService {
  getModules(): Promise<TrainingModuleListItem[]>
  getModule(id: string): Promise<TrainingModule | null>
  createModule(data: CreateTrainingModuleRequest & { status?: string }, createdBy?: string): Promise<TrainingModule>
  updateModule(id: string, data: UpdateTrainingModuleRequest): Promise<TrainingModule | null>
  deleteModule(id: string): Promise<boolean>
  assignModule(data: AssignTrainingModuleRequest, assignedBy: string): Promise<TrainingAssignment[] | { success: boolean; message: string }>
  getMyAssignments(userId: string): Promise<TrainingAssignmentWithModule[]>
  startAssignment(id: string, userId: string): Promise<TrainingAssignment | { success: boolean; message: string }>
  completeAssignment(id: string, userId: string, data: CompleteTrainingAssignmentRequest): Promise<TrainingAssignment | { success: boolean; message: string }>
}
