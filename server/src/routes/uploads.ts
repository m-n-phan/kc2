import { Router } from 'express'
import { S3Client } from '@aws-sdk/client-s3'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'

const router = Router()

const s3 = new S3Client({
  region: process.env.S3_REGION || 'us-east-1',
  endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || 'minio',
    secretAccessKey: process.env.S3_SECRET_KEY || 'minio123'
  },
  forcePathStyle: true
})

const bucket = process.env.S3_BUCKET || 'uploads'

router.post('/presign', async (req, res, next) => {
  try {
    const { key } = req.body as { key?: string }
    if (!key) {
      return res.status(400).json({ success: false, error: 'key required' })
    }

    const post = await createPresignedPost(s3, {
      Bucket: bucket,
      Key: key,
      Conditions: [
        ['starts-with', '$Content-Type', 'image/jpeg'],
        ['content-length-range', 0, 25 * 1024 * 1024]
      ],
      Expires: 3600
    })

    res.json({ success: true, data: post })
  } catch (err) {
    next(err)
  }
})

export default router
