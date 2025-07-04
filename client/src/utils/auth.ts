let currentUserId = 'current-user-id'

// In-memory cache of the current JWT tokens
let accessToken: string | null = null
let refreshToken: string | null = null

export function setCurrentUserId(id: string) {
  currentUserId = id
}

export function getCurrentUserId(): string {
  return currentUserId
}

export function setAuthTokens(access: string, refresh: string) {
  accessToken = access
  refreshToken = refresh
  try {
    localStorage.setItem('accessToken', access)
    localStorage.setItem('refreshToken', refresh)
  } catch {
    // ignore persistence errors (e.g. SSR or disabled storage)
  }
}

export function getAccessToken(): string | null {
  if (accessToken) return accessToken
  try {
    accessToken = localStorage.getItem('accessToken')
  } catch {
    accessToken = null
  }
  return accessToken
}

