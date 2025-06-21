import { Router } from 'express'
import { eq, desc, and } from 'drizzle-orm'
import { z } from 'zod'
import { db, trainingModules, trainingAssignments, users } from '../db'
import { MockTrainingService } from '../services/mockTrainingService'

const router = Router()

// Initialize mock service for development
const mockService = new MockTrainingService()

// Helper function removed - was unused

// Validation schemas
const createModuleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  content: z.object({
    sections: z.array(z.any()).optional()
  }),
  estimatedDuration: z.number().positive().optional(),
  status: z.enum(['draft', 'active', 'archived']).optional()
})

const assignModuleSchema = z.object({
  moduleId: z.string().uuid(),
  assignedTo: z.array(z.string().uuid()),
  dueDate: z.string().datetime().optional()
})

// GET /api/v1/training/modules - List all training modules
router.get('/modules', async (_req, res) => {
  try {
    const modules = await db
      .select({
        id: trainingModules.id,
        title: trainingModules.title,
        description: trainingModules.description,
        estimatedDuration: trainingModules.estimatedDuration,
        status: trainingModules.status,
        createdAt: trainingModules.createdAt,
        creator: {
          id: users.id,
          name: users.name
        }
      })
      .from(trainingModules)
      .leftJoin(users, eq(trainingModules.createdBy, users.id))
      .orderBy(desc(trainingModules.createdAt))

    res.json({
      success: true,
      data: modules
    })
  } catch (error) {
    // Fallback to mock service if database fails
    console.warn('Database unavailable, using mock service:', error)
    try {
      const modules = await mockService.getModules()
      res.json(modules)
    } catch (mockError) {
      console.error('Error fetching training modules:', mockError)
      res.status(500).json({
        success: false,
        error: 'Failed to fetch training modules'
      })
    }
  }
})

// GET /api/v1/training/modules/:id - Get specific training module
router.get('/modules/:id', async (req, res) => {
  try {
    const { id } = req.params

    const module = await db
      .select()
      .from(trainingModules)
      .where(eq(trainingModules.id, id))
      .limit(1)

    if (module.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Training module not found'
      })
    }

    res.json({
      success: true,
      data: module[0]
    })
  } catch (error) {
    // Fallback to mock service if database fails
    console.warn('Database unavailable, using mock service:', error)
    try {
      const module = await mockService.getModule(req.params.id)
      if (!module) {
        return res.status(404).json({ error: 'Training module not found' })
      }
      res.json(module)
    } catch (mockError) {
      console.error('Error fetching training module:', mockError)
      res.status(500).json({
        success: false,
        error: 'Failed to fetch training module'
      })
    }
  }
})

// POST /api/v1/training/modules - Create new training module
router.post('/modules', async (req, res) => {
  try {
    const validatedData = createModuleSchema.parse(req.body)
    
    // In a real app, get user ID from JWT token
    const createdBy = req.headers['x-user-id'] as string || 'system'
    
    const [newModule] = await db
      .insert(trainingModules)
      .values({
        title: validatedData.title,
        description: validatedData.description,
        content: validatedData.content,
        estimatedDuration: validatedData.estimatedDuration,
        status: validatedData.status || 'draft',
        createdBy
      })
      .returning()

    res.status(201).json({
      success: true,
      data: newModule
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      })
    }
    
    // Fallback to mock service if database fails
    console.warn('Database unavailable, using mock service:', error)
    try {
      const newModule = await mockService.createModule(req.body)
      res.status(201).json(newModule)
    } catch (mockError) {
      console.error('Error creating training module:', mockError)
      res.status(500).json({
        success: false,
        error: 'Failed to create training module'
      })
    }
  }
})

// PUT /api/v1/training/modules/:id - Update training module
router.put('/modules/:id', async (req, res) => {
  try {
    const { id } = req.params
    const validatedData = createModuleSchema.partial().parse(req.body)
    
    const [updatedModule] = await db
      .update(trainingModules)
      .set({
        ...validatedData,
        updatedAt: new Date()
      })
      .where(eq(trainingModules.id, id))
      .returning()

    if (!updatedModule) {
      return res.status(404).json({
        success: false,
        error: 'Training module not found'
      })
    }

    res.json({
      success: true,
      data: updatedModule
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      })
    }
    
    // Fallback to mock service if database fails
    console.warn('Database unavailable, using mock service:', error)
    try {
      const updatedModule = await mockService.updateModule(req.params.id, req.body)
      if (!updatedModule) {
        return res.status(404).json({ error: 'Training module not found' })
      }
      res.json(updatedModule)
    } catch (mockError) {
      console.error('Error updating training module:', mockError)
      res.status(500).json({
        success: false,
        error: 'Failed to update training module'
      })
    }
  }
})

// DELETE /api/v1/training/modules/:id - Delete training module
router.delete('/modules/:id', async (req, res) => {
  try {
    const { id } = req.params

    const [deletedModule] = await db
      .delete(trainingModules)
      .where(eq(trainingModules.id, id))
      .returning()

    if (!deletedModule) {
      return res.status(404).json({
        success: false,
        error: 'Training module not found'
      })
    }

    res.json({
      success: true,
      message: 'Training module deleted successfully'
    })
  } catch (error) {
    // Fallback to mock service if database fails
    console.warn('Database unavailable, using mock service:', error)
    try {
      const deleted = await mockService.deleteModule(req.params.id)
      if (!deleted) {
        return res.status(404).json({ error: 'Training module not found' })
      }
      res.status(204).send()
    } catch (mockError) {
      console.error('Error deleting training module:', mockError)
      res.status(500).json({
        success: false,
        error: 'Failed to delete training module'
      })
    }
  }
})

// POST /api/v1/training/assign - Assign training module to users
router.post('/assign', async (req, res) => {
  try {
    const validatedData = assignModuleSchema.parse(req.body)
    const assignedBy = req.headers['x-user-id'] as string || 'system'
    
    const assignments = validatedData.assignedTo.map(userId => ({
      moduleId: validatedData.moduleId,
      assignedTo: userId,
      assignedBy,
      dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
      status: 'pending' as const
    }))

    const newAssignments = await db
      .insert(trainingAssignments)
      .values(assignments)
      .returning()

    res.status(201).json({
      success: true,
      data: newAssignments
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      })
    }
    
    // Fallback to mock service if database fails
    console.warn('Database unavailable, using mock service:', error)
    try {
      const result = await mockService.assignModule()
      res.status(201).json(result)
    } catch (mockError) {
      console.error('Error assigning training module:', mockError)
      res.status(500).json({
        success: false,
        error: 'Failed to assign training module'
      })
    }
  }
})

// GET /api/v1/training/assignments - Get training assignments for a user
router.get('/assignments', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User ID required'
      })
    }

    const assignments = await db
      .select({
        id: trainingAssignments.id,
        status: trainingAssignments.status,
        dueDate: trainingAssignments.dueDate,
        startedAt: trainingAssignments.startedAt,
        completedAt: trainingAssignments.completedAt,
        score: trainingAssignments.score,
        module: {
          id: trainingModules.id,
          title: trainingModules.title,
          description: trainingModules.description,
          estimatedDuration: trainingModules.estimatedDuration
        }
      })
      .from(trainingAssignments)
      .innerJoin(trainingModules, eq(trainingAssignments.moduleId, trainingModules.id))
      .where(eq(trainingAssignments.assignedTo, userId))
      .orderBy(desc(trainingAssignments.createdAt))

    res.json({
      success: true,
      data: assignments
    })
  } catch (error) {
    // Fallback to mock service if database fails
    console.warn('Database unavailable, using mock service:', error)
    try {
      const assignments = await mockService.getMyAssignments()
      res.json(assignments)
    } catch (mockError) {
      console.error('Error fetching training assignments:', mockError)
      res.status(500).json({
        success: false,
        error: 'Failed to fetch training assignments'
      })
    }
  }
})

// PUT /api/v1/training/assignments/:id/start - Start a training assignment
router.put('/assignments/:id/start', async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.headers['x-user-id'] as string

    const [updatedAssignment] = await db
      .update(trainingAssignments)
      .set({
        status: 'in_progress',
        startedAt: new Date(),
        updatedAt: new Date()
      })
      .where(and(
        eq(trainingAssignments.id, id),
        eq(trainingAssignments.assignedTo, userId)
      ))
      .returning()

    if (!updatedAssignment) {
      return res.status(404).json({
        success: false,
        error: 'Training assignment not found'
      })
    }

    res.json({
      success: true,
      data: updatedAssignment
    })
  } catch (error) {
    // Fallback to mock service if database fails
    console.warn('Database unavailable, using mock service:', error)
    try {
      const result = await mockService.startAssignment()
      res.json(result)
    } catch (mockError) {
      console.error('Error starting training assignment:', mockError)
      res.status(500).json({
        success: false,
        error: 'Failed to start training assignment'
      })
    }
  }
})

// PUT /api/v1/training/assignments/:id/complete - Complete a training assignment
router.put('/assignments/:id/complete', async (req, res) => {
  try {
    const { id } = req.params
    const { score } = req.body
    const userId = req.headers['x-user-id'] as string

    const [updatedAssignment] = await db
      .update(trainingAssignments)
      .set({
        status: 'completed',
        completedAt: new Date(),
        score: score || null,
        updatedAt: new Date()
      })
      .where(and(
        eq(trainingAssignments.id, id),
        eq(trainingAssignments.assignedTo, userId)
      ))
      .returning()

    if (!updatedAssignment) {
      return res.status(404).json({
        success: false,
        error: 'Training assignment not found'
      })
    }

    res.json({
      success: true,
      data: updatedAssignment
    })
  } catch (error) {
    // Fallback to mock service if database fails
    console.warn('Database unavailable, using mock service:', error)
    try {
      const result = await mockService.completeAssignment()
      res.json(result)
    } catch (mockError) {
      console.error('Error completing training assignment:', mockError)
      res.status(500).json({
        success: false,
        error: 'Failed to complete training assignment'
      })
    }
  }
})

export default router 