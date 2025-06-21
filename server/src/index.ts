import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import trainingRoutes from './routes/training'

const app = express()
const PORT = process.env.PORT || 3001

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'KitchenCoach 2.0 API',
    version: '1.0.0'
  })
})

// API routes
app.use('/api/v1/training', trainingRoutes)

app.get('/api/v1/status', (_req, res) => {
  res.json({
    message: 'KitchenCoach 2.0 API is running',
    endpoints: {
      health: '/health',
      training: '/api/v1/training/*',
      api: '/api/v1/*'
    }
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  })
})

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // eslint-disable-next-line no-console
  console.error('Error:', err.message)
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  })
})

// Start server
const server = app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 KitchenCoach 2.0 Server running on port ${PORT}`)
  // eslint-disable-next-line no-console
  console.log(`📋 Health check: http://localhost:${PORT}/health`)
  // eslint-disable-next-line no-console
  console.log(`🔗 API base: http://localhost:${PORT}/api/v1`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  // eslint-disable-next-line no-console
  console.log('SIGTERM received, shutting down gracefully')
  server.close(() => {
    // eslint-disable-next-line no-console
    console.log('Server closed')
    process.exit(0)
  })
})

export default app 