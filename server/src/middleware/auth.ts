import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { requireEnv } from '../utils/requireEnv'

const JWT_SECRET = requireEnv('JWT_SECRET')

export const rolePermissions = {
  Manager: ['training.read', 'training.edit', 'checklists.read', 'checklists.edit'],
  Supervisor: ['training.read', 'training.edit', 'checklists.read', 'checklists.edit'],
  Staff: ['training.read', 'checklists.read'],
} as const
export type Permission = (typeof rolePermissions)[keyof typeof rolePermissions][number]

export interface AuthRequest extends Request {
  user?: { id: string; role: string }
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized' })
  }
  const token = header.split(' ')[1]
  try {
    const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload
    req.user = { id: payload.sub as string, role: payload.role as string }
    next()
  } catch {
    res.status(401).json({ success: false, error: 'Invalid token' })
  }
}

export function authorize(permission: Permission) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }
    const perms =
      rolePermissions[req.user.role as keyof typeof rolePermissions] || []
    if (!perms.includes(permission)) {
      return res.status(403).json({ success: false, error: 'Forbidden' })
    }
    next()
  }
}
