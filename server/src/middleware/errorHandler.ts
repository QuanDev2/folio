import type { Request, Response, NextFunction } from 'express'

// A normal Error, optionally carrying an HTTP status (e.g. 404).
export interface HttpError extends Error {
  status?: number
}

// The error lane. FOUR args (err first) is how Express recognizes it.
// Registered LAST in app.ts so any next(err) upstream falls through to here.
export function errorHandler(
  err: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(err)
  res
    .status(err.status ?? 500)
    .json({ error: err.message || 'Internal Server Error' })
}
