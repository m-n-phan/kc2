import { and, desc, eq } from 'drizzle-orm'
import { db, trainingModules, trainingAssignments, users } from '../db'
import {
  TrainingService
} from './TrainingService'
import {
  CreateTrainingModuleRequest,
  UpdateTrainingModuleRequest,
  AssignTrainingModuleRequest,
  CompleteTrainingAssignmentRequest,
  TrainingModule,
  TrainingModuleListItem,
  TrainingAssignment,
  TrainingAssignmentWithModule
} from '@shared/types/training'

export class DbTrainingService implements TrainingService {
  async getModules(): Promise<TrainingModuleListItem[]> {
    const modules = await db
      .select({
        id: trainingModules.id,
        title: trainingModules.title,
        description: trainingModules.description,
        estimatedDuration: trainingModules.estimatedDuration,
        status: trainingModules.status,
        createdAt: trainingModules.createdAt,
        creator: {
          id: users.id,
          name: users.name
        }
      })
      .from(trainingModules)
      .leftJoin(users, eq(trainingModules.createdBy, users.id))
      .orderBy(desc(trainingModules.createdAt))

    return modules as unknown as TrainingModuleListItem[]
  }

  async getModule(id: string): Promise<TrainingModule | null> {
    const module = await db
      .select()
      .from(trainingModules)
      .where(eq(trainingModules.id, id))
      .limit(1)

    return module[0] as unknown as TrainingModule || null
  }

  async createModule(data: CreateTrainingModuleRequest & { status?: string }, createdBy?: string): Promise<TrainingModule> {
    const [newModule] = await db
      .insert(trainingModules)
      .values({
        title: data.title,
        description: data.description,
        content: data.content,
        estimatedDuration: data.estimatedDuration,
        status: (data.status ?? 'draft') as 'draft' | 'active' | 'archived',
        createdBy
      })
      .returning()

    return newModule as unknown as TrainingModule
  }

  async updateModule(id: string, data: UpdateTrainingModuleRequest): Promise<TrainingModule | null> {
    const [updatedModule] = await db
      .update(trainingModules)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(trainingModules.id, id))
      .returning()

    return updatedModule as unknown as TrainingModule || null
  }

  async deleteModule(id: string): Promise<boolean> {
    const [deletedModule] = await db
      .delete(trainingModules)
      .where(eq(trainingModules.id, id))
      .returning()

    return !!deletedModule
  }

  async assignModule(data: AssignTrainingModuleRequest, assignedBy: string): Promise<TrainingAssignment[]> {
    const assignments = data.assignedTo.map((userId: string) => ({
      moduleId: data.moduleId,
      assignedTo: userId,
      assignedBy,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      status: 'pending' as const
    }))

    const newAssignments = await db
      .insert(trainingAssignments)
      .values(assignments)
      .returning()

    return newAssignments as unknown as TrainingAssignment[]
  }

  async getMyAssignments(userId: string): Promise<TrainingAssignmentWithModule[]> {
    const assignments = await db
      .select({
        id: trainingAssignments.id,
        status: trainingAssignments.status,
        dueDate: trainingAssignments.dueDate,
        startedAt: trainingAssignments.startedAt,
        completedAt: trainingAssignments.completedAt,
        score: trainingAssignments.score,
        module: {
          id: trainingModules.id,
          title: trainingModules.title,
          description: trainingModules.description,
          estimatedDuration: trainingModules.estimatedDuration
        }
      })
      .from(trainingAssignments)
      .innerJoin(trainingModules, eq(trainingAssignments.moduleId, trainingModules.id))
      .where(eq(trainingAssignments.assignedTo, userId))
      .orderBy(desc(trainingAssignments.createdAt))

    return assignments as unknown as TrainingAssignmentWithModule[]
  }

  async startAssignment(id: string, userId: string): Promise<TrainingAssignment> {
    const [updated] = await db
      .update(trainingAssignments)
      .set({
        status: 'in_progress',
        startedAt: new Date(),
        updatedAt: new Date()
      })
      .where(and(eq(trainingAssignments.id, id), eq(trainingAssignments.assignedTo, userId)))
      .returning()

    if (!updated) {
      throw new Error('Training assignment not found')
    }

    return updated as unknown as TrainingAssignment
  }

  async completeAssignment(id: string, userId: string, data: CompleteTrainingAssignmentRequest): Promise<TrainingAssignment> {
    const [updated] = await db
      .update(trainingAssignments)
      .set({
        status: 'completed',
        completedAt: new Date(),
        score: data.score || null,
        updatedAt: new Date()
      })
      .where(and(eq(trainingAssignments.id, id), eq(trainingAssignments.assignedTo, userId)))
      .returning()

    if (!updated) {
      throw new Error('Training assignment not found')
    }

    return updated as unknown as TrainingAssignment
  }
}
