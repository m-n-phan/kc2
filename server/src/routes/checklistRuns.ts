import { Router } from 'express'
import { DbChecklistRunService } from '../services/dbChecklistRunService'
import { MockChecklistRunService } from '../services/mockChecklistRunService'
import type { ChecklistRunService } from '../services/ChecklistRunService'
import { authenticate, AuthRequest } from '../middleware/auth'
import { requirePermission } from '../middleware/rbac'

const router = Router()

const service: ChecklistRunService = process.env.DATABASE_URL
  ? new DbChecklistRunService()
  : new MockChecklistRunService()

router.post('/:id/start', authenticate, requirePermission('checklists.edit'), async (req: AuthRequest, res, next) => {
  try {
    const result = await service.startRun(req.params.id, req.user!.id)
    res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
})

router.put('/runs/:id/complete', authenticate, requirePermission('checklists.edit'), async (req: AuthRequest, res, next) => {
  try {
    const result = await service.completeRun(req.params.id, req.user!.id, req.body)
    res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
})

export default router
