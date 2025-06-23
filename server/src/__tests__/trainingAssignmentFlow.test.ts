import { beforeAll, describe, it, expect } from 'vitest'
import express from 'express'
import request from 'supertest'
import jwt from 'jsonwebtoken'

let app: express.Express
const userId = '00000000-0000-0000-0000-000000000999'
const token = jwt.sign({ role: 'Manager' }, 'testsecret', { subject: userId })

beforeAll(async () => {
  delete process.env.DATABASE_URL
  process.env.JWT_SECRET = 'testsecret'
  const routes = (await import('../routes/training')).default
  app = express()
  app.use(express.json())
  app.use('/api/v1/training', routes)
})

describe('training assignment flow', () => {
  it('creates module and completes assignment', async () => {
    const createRes = await request(app)
      .post('/api/v1/training/modules')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Mod', description: '', content: {}, estimatedDuration: 5 })
    expect(createRes.status).toBe(201)

    const assignRes = await request(app)
      .post('/api/v1/training/assign')
      .set('Authorization', `Bearer ${token}`)
      .send({ moduleId: '00000000-0000-0000-0000-000000000001', assignedTo: [userId] })
    expect(assignRes.status).toBe(201)

    const startRes = await request(app)
      .put('/api/v1/training/assignments/00000000-0000-0000-0000-000000000001/start')
      .set('Authorization', `Bearer ${token}`)
    expect(startRes.status).toBe(200)

    const completeRes = await request(app)
      .put('/api/v1/training/assignments/00000000-0000-0000-0000-000000000001/complete')
      .set('Authorization', `Bearer ${token}`)
      .send({ score: 100 })
    expect(completeRes.status).toBe(200)
  })
})
