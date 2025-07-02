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

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6)
})

const resetSchema = z.object({
  email: z.string().email()
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
    next({ code: 500, message: (err as Error).message })
  }
})

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body)
    const tokens = await service.register(name, email, password)
    if (!tokens) {
      return res.status(409).json({ success: false, error: 'Email already in use' })
    }
    res.status(201).json({ success: true, data: tokens })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: err.errors })
    }
    next({ code: 500, message: (err as Error).message })
  }
})

router.post('/reset-password', async (req, res, next) => {
  try {
    const { email } = resetSchema.parse(req.body)
    await service.resetPassword(email)
    res.json({ success: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: err.errors })
    }
    next({ code: 500, message: (err as Error).message })
  }
})

router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body as { refreshToken?: string }
    if (!refreshToken) {
      return res.status(400).json({ success: false, error: 'refreshToken required' })
    }
    const tokens = await service.refresh(refreshToken)
    if (!tokens) {
      return res.status(401).json({ success: false, error: 'Invalid token' })
    }
    res.json({ success: true, data: tokens })
  } catch (err) {
    next({ code: 500, message: (err as Error).message })
  }
})

export default router
