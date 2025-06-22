import { describe, it, expect, beforeEach, vi } from 'vitest'
import request from 'supertest'
import express from 'express'

vi.mock('@aws-sdk/s3-presigned-post', () => ({
  createPresignedPost: vi.fn()
}))

let app: express.Express

beforeEach(async () => {
  vi.resetModules()
  const { default: uploadsRoutes } = await import('../routes/uploads')
  app = express()
  app.use(express.json())
  app.use('/api/v1/uploads', uploadsRoutes)
})

describe('Uploads routes', () => {
  it('returns a presigned post', async () => {
    const { createPresignedPost } = await import('@aws-sdk/s3-presigned-post')
    ;(
      createPresignedPost as unknown as {
        mockResolvedValue: (value: unknown) => void
      }
    ).mockResolvedValue({
      url: 'http://localhost:9000/uploads',
      fields: { key: 'test.jpg' }
    })

    const res = await request(app)
      .post('/api/v1/uploads/presign')
      .send({ key: 'test.jpg' })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.url).toBeDefined()
    expect(createPresignedPost).toHaveBeenCalled()
  })

  it('requires a key', async () => {
    const res = await request(app)
      .post('/api/v1/uploads/presign')
      .send({})

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
  })
})
