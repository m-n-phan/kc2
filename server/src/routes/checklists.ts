import { Router } from 'express'
import { z } from 'zod'
import { DbChecklistService } from '../services/dbChecklistService'
import type { ChecklistService } from '../services/ChecklistService'
import { authenticate, authorize, AuthRequest } from '../middleware/auth'

const router = Router()
const service: ChecklistService = new DbChecklistService()

const checklistSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'on_demand']),
  locationId: z.string().uuid().optional(),
  isActive: z.boolean().optional()
})

router.get('/', authenticate, authorize('checklists.read'), async (_req, res, next) => {
  try {
    const data = await service.getChecklists()
    res.json({ success: true, data })
  } catch (err) {
    next({ code: 500, message: (err as Error).message })
  }
})

router.get('/:id', authenticate, authorize('checklists.read'), async (req, res, next) => {
  try {
    const checklist = await service.getChecklist(req.params.id)
    if (!checklist) {
      return res.status(404).json({ success: false, error: 'Checklist not found' })
    }
    res.json({ success: true, data: checklist })
  } catch (err) {
    next({ code: 500, message: (err as Error).message })
  }
})

router.post('/', authenticate, authorize('checklists.edit'), async (req: AuthRequest, res, next) => {
  try {
    const data = checklistSchema.parse(req.body)
    const createdBy = req.user!.id
    const item = await service.createChecklist(data, createdBy)
    res.status(201).json({ success: true, data: item })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: err.errors })
    }
    next({ code: 500, message: (err as Error).message })
  }
})

router.put('/:id', authenticate, authorize('checklists.edit'), async (req, res, next) => {
  try {
    const data = checklistSchema.partial().parse(req.body)
    const item = await service.updateChecklist(req.params.id, data)
    if (!item) {
      return res.status(404).json({ success: false, error: 'Checklist not found' })
    }
    res.json({ success: true, data: item })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: err.errors })
    }
    next({ code: 500, message: (err as Error).message })
  }
})

router.delete('/:id', authenticate, authorize('checklists.edit'), async (req, res, next) => {
  try {
    const ok = await service.deleteChecklist(req.params.id)
    if (!ok) {
      return res.status(404).json({ success: false, error: 'Checklist not found' })
    }
    res.json({ success: true, message: 'Checklist deleted' })
  } catch (err) {
    next({ code: 500, message: (err as Error).message })
  }
})

export default router
