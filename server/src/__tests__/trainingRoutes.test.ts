import { describe, it, expect, vi } from "vitest"
import request from 'supertest'
import express from 'express'

// Use the mock training service by ensuring DATABASE_URL is unset before loading the routes
const originalDbUrl = process.env.DATABASE_URL
delete process.env.DATABASE_URL

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
})

if (originalDbUrl) {
  process.env.DATABASE_URL = originalDbUrl
}
