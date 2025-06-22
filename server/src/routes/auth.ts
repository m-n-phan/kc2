import { Router } from 'express'
import { z } from 'zod'
import { DbAuthService } from '../services/dbAuthService'
import type { AuthService } from '../services/AuthService'

const router = Router()
const service: AuthService = new DbAuthService()

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body)
    const tokens = await service.login(email, password)
    if (!tokens) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' })
    }
    res.json({ success: true, data: tokens })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: err.errors })
    }
    next(err)
  }
})

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body as { refreshToken?: string }
  if (!refreshToken) {
    return res.status(400).json({ success: false, error: 'refreshToken required' })
  }
  const tokens = await service.refresh(refreshToken)
  if (!tokens) {
    return res.status(401).json({ success: false, error: 'Invalid token' })
  }
  res.json({ success: true, data: tokens })
})

export default router
