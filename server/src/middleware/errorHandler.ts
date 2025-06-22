import type { Request, Response, NextFunction } from 'express'

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  // eslint-disable-next-line no-console
  console.error('Error:', err)
  const status = (err as any)?.status ?? 500
  const message = status === 500 ? 'Internal Server Error' : err.message

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
