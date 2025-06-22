import { describe, it, expect } from "vitest"
import request from 'supertest'
import express from 'express'

// set invalid database url before importing routes so db connection fails
process.env.DATABASE_URL = 'postgresql://invalidHost:5432/invalidDb'

import trainingRoutes from '../routes/training'

const app = express()
app.use(express.json())
app.use('/api/v1/training', trainingRoutes)

describe('Training routes', () => {
  it('GET /api/v1/training/modules returns modules from mock service', async () => {
    const res = await request(app).get('/api/v1/training/modules')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.data.length).toBeGreaterThan(0)
    expect(res.body.data[0]).toHaveProperty('id')
    expect(res.body.data[0]).toHaveProperty('title')
  })
})
