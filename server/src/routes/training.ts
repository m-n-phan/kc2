import { Router } from 'express'
import { z } from 'zod'
import { DbTrainingService } from '../services/dbTrainingService'
import { MockTrainingService } from '../services/mockTrainingService'
import type { TrainingService } from '../services/TrainingService'
import type {
  CreateTrainingModuleRequest,
  UpdateTrainingModuleRequest,
} from '@shared/types/training'
import { authenticate, authorize } from '../middleware/auth'


const router = Router()

const service: TrainingService = process.env.DATABASE_URL
  ? new DbTrainingService()
  : new MockTrainingService()

// All training routes require authentication
router.use(authenticate)

const createModuleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  content: z.object({
    sections: z
      .array(
        z.object({
          title: z.string(),
          content: z.string(),
          type: z.enum(['text', 'video', 'quiz', 'checklist'])
        })
      )
      .optional()
  }),
  estimatedDuration: z.number().positive().optional(),
  status: z.enum(['draft', 'active', 'archived']).optional()
})

const assignModuleSchema = z.object({
  moduleId: z.string().uuid(),
  assignedTo: z.array(z.string().uuid()),
  dueDate: z.string().datetime().optional()
})

router.get('/modules', authorize('training.read'), async (_req, res, next) => {
  try {
    const modules = await service.getModules()
    res.json({ success: true, data: modules })
  } catch (err) {
    next({ code: 500, message: (err as Error).message })
  }
})

router.get('/modules/:id', authorize('training.read'), async (req, res, next) => {
  try {
    const module = await service.getModule(req.params.id)
    if (!module) {
      return res.status(404).json({ success: false, error: 'Training module not found' })
    }
    res.json({ success: true, data: module })
  } catch (err) {
    next({ code: 500, message: (err as Error).message })
  }
})

router.post('/modules', authorize('training.edit'), async (req, res, next) => {
  try {
    const validated = createModuleSchema.parse(req.body) as CreateTrainingModuleRequest & {
      status?: string
    }
    const createdBy = (req.headers['x-user-id'] as string) || 'system'
    const module = await service.createModule(validated, createdBy)
    res.status(201).json({ success: true, data: module })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: err.errors })
    }
    next({ code: 500, message: (err as Error).message })
  }
})

router.put('/modules/:id', authorize('training.edit'), async (req, res, next) => {
  try {
    const validated = createModuleSchema.partial().parse(req.body) as UpdateTrainingModuleRequest
    const module = await service.updateModule(req.params.id, validated)
    if (!module) {
      return res.status(404).json({ success: false, error: 'Training module not found' })
    }
    res.json({ success: true, data: module })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: err.errors })
    }
    next({ code: 500, message: (err as Error).message })
  }
})

router.delete('/modules/:id', authorize('training.edit'), async (req, res, next) => {
  try {
    const deleted = await service.deleteModule(req.params.id)
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Training module not found' })
    }
    res.json({ success: true, message: 'Training module deleted successfully' })
 } catch (err) {
    next({ code: 500, message: (err as Error).message })
  }
})

router.post('/assign', authorize('training.edit'), async (req, res, next) => {
  try {
    const validated = assignModuleSchema.parse(req.body)
    const assignedBy = (req.headers['x-user-id'] as string) || 'system'
    const result = await service.assignModule(validated, assignedBy)
    res.status(201).json({ success: true, data: result })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: err.errors })
    }
    next({ code: 500, message: (err as Error).message })
  }
})

router.get('/assignments', authorize('training.read'), async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'] as string
    if (!userId) {
      return res.status(401).json({ success: false, error: 'User ID required' })
    }
    const assignments = await service.getMyAssignments(userId)
    res.json({ success: true, data: assignments })
 } catch (err) {
    next({ code: 500, message: (err as Error).message })
  }
})

router.put('/assignments/:id/start', authorize('training.edit'), async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'] as string
    const assignment = await service.startAssignment(req.params.id, userId)
    res.json({ success: true, data: assignment })
  } catch (err) {
    next({ code: 500, message: (err as Error).message })
  }
})

router.put('/assignments/:id/complete', authorize('training.edit'), async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'] as string
    const assignment = await service.completeAssignment(req.params.id, userId, req.body)
    res.json({ success: true, data: assignment })
  } catch (err) {
    next({ code: 500, message: (err as Error).message })
  }
})

export default router
