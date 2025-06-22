import { describe, it, expect, vi } from "vitest"
import request from 'supertest'
import express from 'express'

// Use the mock training service by ensuring DATABASE_URL is unset before loading the routes
const originalDbUrl = process.env.DATABASE_URL
delete process.env.DATABASE_URL

import { describe, it, expect, beforeAll } from "vitest"
import request from 'supertest'
import express from 'express'

let app: express.Express

beforeAll(async () => {
  // force mock service by clearing DATABASE_URL before importing routes
  process.env.DATABASE_URL = ''
  const trainingRoutes = (await import('../routes/training')).default
  app = express()
  app.use(express.json())
  app.use('/api/v1/training', trainingRoutes)
})

describe('Training routes', () => {
  it('GET /api/v1/training/modules returns modules from mock service', async () => {
    vi.resetModules()
    const { default: trainingRoutes } = await import('../routes/training')

    const app = express()
    app.use(express.json())
    app.use('/api/v1/training', trainingRoutes)

    const res = await request(app).get('/api/v1/training/modules')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.data.length).toBeGreaterThan(0)
    expect(res.body.data[0]).toHaveProperty('id')
    expect(res.body.data[0]).toHaveProperty('title')
  })

  it('POST, PUT and DELETE /modules work with mock service', async () => {
    const createRes = await request(app)
      .post('/api/v1/training/modules')
      .set('x-user-id', '1')
      .send({
        title: 'Test Module',
        description: 'desc',
        content: { sections: [] },
        estimatedDuration: 5
      })
    expect(createRes.status).toBe(201)
    const id = createRes.body.data.id
    expect(id).toBeDefined()

    const updateRes = await request(app)
      .put(`/api/v1/training/modules/${id}`)
      .send({ title: 'Updated Module' })
    expect(updateRes.status).toBe(200)
    expect(updateRes.body.data.title).toBe('Updated Module')

    const deleteRes = await request(app)
      .delete(`/api/v1/training/modules/${id}`)
    expect(deleteRes.status).toBe(200)
    expect(deleteRes.body.success).toBe(true)
  })

  it('Assignment endpoints return success responses', async () => {
    const assignRes = await request(app)
      .post('/api/v1/training/assign')
      .set('x-user-id', '1')
      .send({
        moduleId: '00000000-0000-0000-0000-000000000001',
        assignedTo: ['00000000-0000-0000-0000-000000000002']
      })
    expect(assignRes.status).toBe(201)
    expect(assignRes.body.data.success).toBe(true)

    const listRes = await request(app)
      .get('/api/v1/training/assignments')
      .set('x-user-id', '1')
    expect(listRes.status).toBe(200)
    expect(Array.isArray(listRes.body.data)).toBe(true)

    const startRes = await request(app)
      .put('/api/v1/training/assignments/00000000-0000-0000-0000-000000000003/start')
      .set('x-user-id', '1')
    expect(startRes.status).toBe(200)
    expect(startRes.body.data.success).toBe(true)

    const completeRes = await request(app)
      .put('/api/v1/training/assignments/00000000-0000-0000-0000-000000000003/complete')
      .set('x-user-id', '1')
      .send({ score: 100 })
    expect(completeRes.status).toBe(200)
    expect(completeRes.body.data.success).toBe(true)
  })
})

if (originalDbUrl) {
  process.env.DATABASE_URL = originalDbUrl
}
