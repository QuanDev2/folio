import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler'

// Mounted at /users in app.ts.
const router = Router()

// GET /users/:username/posts → a single user's published posts (portfolio feed)
router.get(
  '/:username/posts',
  asyncHandler(async (req, res) => {
    res.json({
      data: [],
      message: 'user portfolio stub',
      username: req.params.username,
    })
  }),
)

export default router
