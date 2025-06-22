import { beforeAll, describe, expect, it, vi } from 'vitest'
import express from 'express'
import request from 'supertest'
import jwt from 'jsonwebtoken'

process.env.JWT_SECRET = 'testsecret'

type Tokens = { accessToken: string; refreshToken: string }

vi.mock('../services/dbAuthService', () => {
  return {
    DbAuthService: class {
      async login(email: string, password: string): Promise<Tokens | null> {
        if (email === 'user@example.com' && password === 'password') {
          return { accessToken: 'access', refreshToken: 'refresh' }
        }
        return null
      }
      async refresh(token: string): Promise<Tokens | null> {
        if (token === 'refresh') {
          return { accessToken: 'access2', refreshToken: 'refresh2' }
        }
        return null
      }
    }
  }
})

vi.mock('../services/dbChecklistService', () => {
  return {
    DbChecklistService: class {
      private items = [
        { id: '1', title: 'A', frequency: 'daily', isActive: true, createdAt: 'now', updatedAt: 'now' }
      ]
      async getChecklists() { return this.items }
      async getChecklist(id: string) { return this.items.find(i => i.id === id) || null }
      async createChecklist(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: any
      ) {
        const item = { ...data, id: '2', createdAt: 'now', updatedAt: 'now' }
        this.items.push(item)
        return item
      }
      async updateChecklist(
        id: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: any
      ) {
        const item = this.items.find(i => i.id === id)
        if (!item) return null
        Object.assign(item, data)
        item.updatedAt = 'now'
        return item
      }
      async deleteChecklist(id: string) {
        const idx = this.items.findIndex(i => i.id === id)
        if (idx === -1) return false
        this.items.splice(idx, 1)
        return true
      }
    }
  }
})

let authApp: express.Express
let checklistApp: express.Express

beforeAll(async () => {
  const authRoutes = (await import('../routes/auth')).default
  authApp = express()
  authApp.use(express.json())
  authApp.use('/auth', authRoutes)

  const checklistRoutes = (await import('../routes/checklists')).default
  checklistApp = express()
  checklistApp.use(express.json())
  checklistApp.use('/api/v1/checklists', checklistRoutes)
})

describe('Auth routes', () => {
  it('login returns tokens', async () => {
    const res = await request(authApp)
      .post('/auth/login')
      .send({ email: 'user@example.com', password: 'password' })
    expect(res.status).toBe(200)
    expect(res.body.data.accessToken).toBe('access')
  })

  it('login with bad credentials', async () => {
    const res = await request(authApp)
      .post('/auth/login')
      .send({ email: 'user@example.com', password: 'wrong' })
    expect(res.status).toBe(401)
  })

  it('refresh returns new tokens', async () => {
    const res = await request(authApp)
      .post('/auth/refresh')
      .send({ refreshToken: 'refresh' })
    expect(res.status).toBe(200)
    expect(res.body.data.accessToken).toBe('access2')
  })

  it('refresh with invalid token', async () => {
    const res = await request(authApp).post('/auth/refresh').send({ refreshToken: 'bad' })
    expect(res.status).toBe(401)
  })
})

describe('Checklist routes', () => {
  const managerToken = jwt.sign({ role: 'Manager' }, 'testsecret', { subject: '1' })

  it('lists checklists', async () => {
    const res = await request(checklistApp)
      .get('/api/v1/checklists')
      .set('Authorization', `Bearer ${managerToken}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  it('creates, updates and deletes a checklist', async () => {
    const createRes = await request(checklistApp)
      .post('/api/v1/checklists')
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ title: 'B', frequency: 'daily' })
    expect(createRes.status).toBe(201)
    const id = createRes.body.data.id

    const updateRes = await request(checklistApp)
      .put(`/api/v1/checklists/${id}`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ title: 'C' })
    expect(updateRes.status).toBe(200)
    expect(updateRes.body.data.title).toBe('C')

    const deleteRes = await request(checklistApp)
      .delete(`/api/v1/checklists/${id}`)
      .set('Authorization', `Bearer ${managerToken}`)
    expect(deleteRes.status).toBe(200)
  })
})
