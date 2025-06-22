import type { Request, Response, NextFunction } from 'express'

interface StatusError {
  status?: number
  message?: string
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  // eslint-disable-next-line no-console
  console.error('Error:', err)

  let status = 500
  let message = 'Internal Server Error'

  if (typeof err === 'object' && err !== null) {
    const e = err as StatusError
    if (typeof e.status === 'number') {
      status = e.status
    }
    if (typeof e.message === 'string' && status !== 500) {
      message = e.message
    }
  }

  res.status(status).json({ success: false, error: message })
}
