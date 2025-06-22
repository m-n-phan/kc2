let currentUserId = 'current-user-id'

export function setCurrentUserId(id: string) {
  currentUserId = id
}

export function getCurrentUserId(): string {
  return currentUserId
}

