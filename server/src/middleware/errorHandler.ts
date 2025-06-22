import type { Request, Response, NextFunction } from 'express'

interface ApiError {
  code?: number
  status?: number
  message?: string
  field?: string
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  // eslint-disable-next-line no-console
  console.error('Error:', err)

  const e = (typeof err === 'object' && err !== null) ? (err as ApiError) : {}
  const code = typeof e.code === 'number' ? e.code : typeof e.status === 'number' ? e.status : 500
  const message = typeof e.message === 'string' ? e.message : 'Internal Server Error'

  const body: { error: { code: number; message: string; field?: string } } = {
    error: { code, message }
  }

  if (typeof e.field === 'string') {
    body.error.field = e.field
  }

  res.status(code).json(body)
}
