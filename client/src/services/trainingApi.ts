import type {
  TrainingModuleListItem,
  TrainingModule,
  CreateTrainingModuleRequest,
  UpdateTrainingModuleRequest,
  TrainingAssignment,
  AssignTrainingModuleRequest,
  CompleteTrainingAssignmentRequest
} from '@shared/types/training'
import { getCurrentUserId, getAccessToken } from '../utils/auth'
import { queueRequest } from '../utils/offline'
import { nanoid } from 'nanoid'

const API_BASE = '/api/v1'

const authHeaders = () => {
  const token = getAccessToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(errorData.error || `HTTP ${response.status}`)
  }
  return response.json()
}

export const trainingApi = {
  // Get all training modules
  async getModules(): Promise<TrainingModuleListItem[]> {
    const response = await fetch(`${API_BASE}/training/modules`, {
      headers: authHeaders()
    })
    const data = await handleResponse(response)
    
    // Handle both formats: direct array (mock) or wrapped response (database)
    return Array.isArray(data) ? data : (data.data || [])
  },

  // Get specific training module
  async getModule(id: string): Promise<TrainingModule> {
    const response = await fetch(`${API_BASE}/training/modules/${id}` , {
      headers: authHeaders()
    })
    const data = await handleResponse(response)
    
    // Handle both formats: direct object (mock) or wrapped response (database)
    return data.data || data
  },

  // Create new training module
  async createModule(moduleData: CreateTrainingModuleRequest): Promise<TrainingModule> {
    if (!navigator.onLine) {
      await queueRequest({
        id: nanoid(),
        url: `${API_BASE}/training/modules`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(moduleData),
      })
      // Return minimal placeholder until synced
      return moduleData as unknown as TrainingModule
    }

    const response = await fetch(`${API_BASE}/training/modules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      },
      body: JSON.stringify(moduleData),
    })
    const data = await handleResponse(response)

    // Handle both formats: direct object (mock) or wrapped response (database)
    return data.data || data
  },

  // Update training module
  async updateModule(id: string, moduleData: UpdateTrainingModuleRequest): Promise<TrainingModule> {
    if (!navigator.onLine) {
      await queueRequest({
        id: nanoid(),
        url: `${API_BASE}/training/modules/${id}`,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(moduleData),
      })
      return moduleData as unknown as TrainingModule
    }

    const response = await fetch(`${API_BASE}/training/modules/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      },
      body: JSON.stringify(moduleData),
    })
    const data = await handleResponse(response)

    // Handle both formats: direct object (mock) or wrapped response (database)
    return data.data || data
  },

  // Delete training module
  async deleteModule(id: string): Promise<void> {
    if (!navigator.onLine) {
      await queueRequest({
        id: nanoid(),
        url: `${API_BASE}/training/modules/${id}`,
        method: 'DELETE',
        headers: authHeaders()
      })
      return
    }

    const response = await fetch(`${API_BASE}/training/modules/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(errorData.error || `HTTP ${response.status}`)
    }
    
    // Handle both 204 (no content) and 200 (with message) responses
    if (response.status !== 204) {
      await response.json() // Consume response body if present
    }
  },

  // Get user's training assignments
  async getMyAssignments(): Promise<TrainingAssignment[]> {
    const response = await fetch(`${API_BASE}/training/assignments`, {
      headers: {
        'x-user-id': getCurrentUserId(),
        ...authHeaders()
      },
    })
    const data = await handleResponse(response)
    
    // Handle both formats: direct array (mock) or wrapped response (database)
    return Array.isArray(data) ? data : (data.data || [])
  },

  // Assign training module to users
  async assignModule(assignmentData: AssignTrainingModuleRequest): Promise<unknown> {
    if (!navigator.onLine) {
      await queueRequest({
        id: nanoid(),
        url: `${API_BASE}/training/assign`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': getCurrentUserId(),
          ...authHeaders()
        },
        body: JSON.stringify(assignmentData),
      })
      return
    }

    const response = await fetch(`${API_BASE}/training/assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': getCurrentUserId(),
        ...authHeaders()
      },
      body: JSON.stringify(assignmentData),
    })
    const data = await handleResponse(response)

    // Handle both formats: direct object (mock) or wrapped response (database)
    return data.data || data
  },

  // Start training assignment
  async startAssignment(assignmentId: string): Promise<unknown> {
    if (!navigator.onLine) {
      await queueRequest({
        id: nanoid(),
        url: `${API_BASE}/training/assignments/${assignmentId}/start`,
        method: 'PUT',
        headers: { 'x-user-id': getCurrentUserId(), ...authHeaders() },
      })
      return
    }

    const response = await fetch(`${API_BASE}/training/assignments/${assignmentId}/start`, {
      method: 'PUT',
      headers: {
        'x-user-id': getCurrentUserId(),
        ...authHeaders()
      },
    })
    const data = await handleResponse(response)

    // Handle both formats: direct object (mock) or wrapped response (database)
    return data.data || data
  },

  // Complete training assignment
  async completeAssignment(
    assignmentId: string,
    completionData: CompleteTrainingAssignmentRequest
  ): Promise<unknown> {
    if (!navigator.onLine) {
      await queueRequest({
        id: nanoid(),
        url: `${API_BASE}/training/assignments/${assignmentId}/complete`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': getCurrentUserId(),
          ...authHeaders()
        },
        body: JSON.stringify(completionData),
      })
      return
    }

    const response = await fetch(`${API_BASE}/training/assignments/${assignmentId}/complete`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': getCurrentUserId(),
        ...authHeaders()
      },
      body: JSON.stringify(completionData),
    })
    const data = await handleResponse(response)

    // Handle both formats: direct object (mock) or wrapped response (database)
    return data.data || data
  },
}
