import { nanoid } from 'nanoid'
import { getCurrentUserId, getAccessToken } from '../utils/auth'
import { queueRequest } from '../utils/offline'

const API_BASE = '/api/v1'

const authHeaders = () => {
  const token = getAccessToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(errorData.error || `HTTP ${response.status}`)
  }
  return response.json()
}

export const checklistApi = {
  async startRun(checklistId: string): Promise<unknown> {
    if (!navigator.onLine) {
      await queueRequest({
        id: nanoid(),
        url: `${API_BASE}/checklists/${checklistId}/start`,
        method: 'POST',
        headers: { 'x-user-id': getCurrentUserId(), ...authHeaders() }
      })
      return
    }
    const response = await fetch(`${API_BASE}/checklists/${checklistId}/start`, {
      method: 'POST',
      headers: { 'x-user-id': getCurrentUserId(), ...authHeaders() }
    })
    const data = await handleResponse(response)
    return data.data || data
  },

  async completeRun(runId: string, notes?: string): Promise<unknown> {
    if (!navigator.onLine) {
      await queueRequest({
        id: nanoid(),
        url: `${API_BASE}/checklists/runs/${runId}/complete`,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-user-id': getCurrentUserId(), ...authHeaders() },
        body: JSON.stringify({ notes })
      })
      return
    }

    const response = await fetch(`${API_BASE}/checklists/runs/${runId}/complete`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-user-id': getCurrentUserId(), ...authHeaders() },
      body: JSON.stringify({ notes })
    })
    const data = await handleResponse(response)
    return data.data || data
  }
}
