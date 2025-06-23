import { TrainingService } from './TrainingService'
import {
  CreateTrainingModuleRequest,
  UpdateTrainingModuleRequest,
  AssignTrainingModuleRequest,
  CompleteTrainingAssignmentRequest,
  TrainingModule,
  TrainingModuleListItem,
  TrainingAssignmentWithModule,



  TrainingStatus,


  TrainingStatus,

  TrainingStatus
} from '@shared/types/training'

// Mock data for development
const mockModules = [
  {
    id: '1',
    title: 'Food Safety Basics',
    description: 'Essential food safety protocols and HACCP principles for all kitchen staff. Learn proper temperature control, cross-contamination prevention, and hygiene practices.',
    content: {
      sections: [
        {
          title: 'Introduction to Food Safety',
          content: 'Food safety is critical in restaurant operations...',
          type: 'text'
        },
        {
          title: 'Temperature Control',
          content: 'Proper temperature control prevents bacterial growth...',
          type: 'text'
        }
      ]
    },
    status: 'active' as const,
    estimatedDuration: 45,
    enrollmentCount: 0,
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
    creator: {
      id: '1',
      name: 'Chef Manager',
      email: 'chef@restaurant.com'
    }
  },
  {
    id: '2',
    title: 'Kitchen Equipment Safety',
    description: 'Proper operation and maintenance of commercial kitchen equipment. Safety protocols for ovens, fryers, and other machinery.',
    content: {
      sections: [
        {
          title: 'Equipment Overview',
          content: 'Understanding your kitchen equipment...',
          type: 'text'
        }
      ]
    },
    status: 'draft' as const,
    estimatedDuration: 30,
    enrollmentCount: 0,
    createdAt: '2024-01-20T00:00:00.000Z',
    updatedAt: '2024-01-20T00:00:00.000Z',
    creator: {
      id: '1',
      name: 'Chef Manager',
      email: 'chef@restaurant.com'
    }
  },
  {
    id: '3',
    title: 'Emergency Procedures',
    description: 'Fire safety, first aid, and emergency response protocols. Know what to do in case of accidents or emergencies.',
    content: {
      sections: [
        {
          title: 'Fire Safety',
          content: 'In case of fire, follow these steps...',
          type: 'text'
        }
      ]
    },
    status: 'active' as const,
    estimatedDuration: 20,
    enrollmentCount: 0,
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2024-01-10T00:00:00.000Z',
    creator: {
      id: '1',
      name: 'Chef Manager',
      email: 'chef@restaurant.com'
    }
  }
]

type ModuleWithCreator = TrainingModule & {
  creator: {
    id: string
    name: string
    email: string
  }
}

export class MockTrainingService implements TrainingService {
  private modules: ModuleWithCreator[] = [...(mockModules as ModuleWithCreator[])]

  async getModules(): Promise<TrainingModuleListItem[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
      return this.modules.map(module => ({
        id: module.id,
        title: module.title,
        description: module.description,
        status: module.status,
        enrollmentCount: 0,
        estimatedDuration: module.estimatedDuration,
        createdAt: module.createdAt,
        updatedAt: module.updatedAt,
        creator: module.creator
      }))
  }

  async getModule(id: string): Promise<TrainingModule | null> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return this.modules.find(module => module.id === id) || null
  }

  async createModule(data: CreateTrainingModuleRequest & { status?: string }): Promise<TrainingModule> {
    await new Promise(resolve => setTimeout(resolve, 400))
    const status: TrainingStatus = (data.status ?? 'draft') as TrainingStatus
    const newModule: ModuleWithCreator = {
      id: (this.modules.length + 1).toString(),
      title: data.title,
      description: data.description || '',
      content: data.content,
      status,
      estimatedDuration: data.estimatedDuration,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      creator: {
        id: '1',
        name: 'Current User',
        email: 'user@restaurant.com'
      }
    }

    
    this.modules.push(newModule)
    return newModule
  }

  async updateModule(id: string, data: UpdateTrainingModuleRequest): Promise<TrainingModule | null> {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const moduleIndex = this.modules.findIndex(module => module.id === id)
    if (moduleIndex === -1) return null
    
    const updatedModule: ModuleWithCreator = {
      ...this.modules[moduleIndex],
      ...data,
      updatedAt: new Date().toISOString()
    }

    this.modules[moduleIndex] = updatedModule
    return updatedModule
  }

  async deleteModule(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const moduleIndex = this.modules.findIndex(module => module.id === id)
    if (moduleIndex === -1) return false
    
    this.modules.splice(moduleIndex, 1)
    return true
  }

  async getMyAssignments(_userId: string): Promise<TrainingAssignmentWithModule[]> {
    // Mock assignments for development
    await new Promise(resolve => setTimeout(resolve, 200))
    return []
  }

  async assignModule(_data: AssignTrainingModuleRequest, _assignedBy: string): Promise<{ success: boolean; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return { success: true, message: 'Module assigned successfully' }
  }

  async startAssignment(_id: string, _userId: string): Promise<{ success: boolean; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return { success: true, message: 'Assignment started' }
  }

  async completeAssignment(_id: string, _userId: string, _data: CompleteTrainingAssignmentRequest): Promise<{ success: boolean; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return { success: true, message: 'Assignment completed' }
  }
} 
