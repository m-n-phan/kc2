import { describe, it, expect, beforeAll, vi } from 'vitest'

import express from 'express'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import { beforeAll, describe, expect, it } from 'vitest'

const JWT_SECRET = 'testsecret'

import { describe, it, expect, vi, beforeAll } from "vitest"
import request from 'supertest'
import express from 'express'

// Use the mock training service by ensuring DATABASE_URL is unset before loading the routes
const originalDbUrl = process.env.DATABASE_URL
delete process.env.DATABASE_URL

let app: express.Express
let tokenManager: string
let tokenStaff: string

beforeAll(async () => {
  process.env.JWT_SECRET = JWT_SECRET
  process.env.DATABASE_URL = ''
  const trainingRoutes = (await import('../routes/training')).default
  app = express()
  app.use(express.json())
  app.use('/api/v1/training', trainingRoutes)
  tokenManager = jwt.sign({ role: 'Manager' }, JWT_SECRET, { subject: '1' })
  tokenStaff = jwt.sign({ role: 'Staff' }, JWT_SECRET, { subject: '2' })
})

describe('training route permissions', () => {
  it('allows authorized access', async () => {
    const res = await request(app)
      .get('/api/v1/training/modules')
      .set('Authorization', `Bearer ${tokenManager}`)
    expect(res.status).toBe(200)
  })

  it('blocks users lacking permission', async () => {
    const res = await request(app)
      .post('/api/v1/training/modules')
      .set('Authorization', `Bearer ${tokenStaff}`)
      .send({ title: 't', description: '', content: {}, estimatedDuration: 1 })
    expect(res.status).toBe(403)
  })
})

