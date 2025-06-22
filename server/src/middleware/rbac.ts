import { Response, NextFunction } from 'express'
import type { AuthRequest } from './auth'

const rolePermissions: Record<string, string[]> = {
  Manager: ['checklist.edit'],
  Supervisor: ['checklist.edit'],
  Staff: []
}

export function requirePermission(permission: string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }
    const permissions = rolePermissions[req.user.role] || []
    if (!permissions.includes(permission)) {
      return res.status(403).json({ success: false, error: 'Forbidden' })
    }
    next()
  }
}
