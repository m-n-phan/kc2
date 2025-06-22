import { beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import express from 'express'
import jwt from 'jsonwebtoken'

let app: express.Express

function authHeader(role = 'Manager') {
  const token = jwt.sign({ role }, 'testsecret', { subject: 'user1' })
  return `Bearer ${token}`
}

beforeAll(async () => {
  process.env.DATABASE_URL = ''
  process.env.JWT_SECRET = 'testsecret'
  const routes = (await import('../routes/checklistRuns')).default
  app = express()
  app.use(express.json())
  app.use('/api/v1/checklists', routes)
})

describe('Checklist run routes', () => {
  it('starts a checklist run', async () => {
    const res = await request(app)
      .post('/api/v1/checklists/123/start')
      .set('Authorization', authHeader())
    expect(res.status).toBe(200)
    expect(res.body.data.success).toBe(true)
  })

  it('completes a checklist run', async () => {
    const res = await request(app)
      .put('/api/v1/checklists/runs/321/complete')
      .set('Authorization', authHeader())
      .send({ notes: 'done' })
    expect(res.status).toBe(200)
    expect(res.body.data.success).toBe(true)
  })
})
