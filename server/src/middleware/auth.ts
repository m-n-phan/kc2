import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { requireEnv } from '../utils/requireEnv'

const JWT_SECRET = requireEnv('JWT_SECRET')

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

export function authorize(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Forbidden' })
    }
    next()
  }
}
