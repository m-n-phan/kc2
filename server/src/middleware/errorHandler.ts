import type { Request, Response, NextFunction } from 'express'

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  // eslint-disable-next-line no-console
  console.error('Error:', err)
  const status = (err as any)?.status ?? 500
  const message = status === 500 ? 'Internal Server Error' : err.message
  res.status(status).json({ success: false, error: message })
}
