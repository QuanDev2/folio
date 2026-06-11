import express from 'express'
import postsRouter from './routes/posts'
import usersRouter from './routes/users'
import { errorHandler } from './middleware/errorHandler'

const app = express()

// 1. Station: parse JSON bodies for everyone (fills req.body).
app.use(express.json())

// 2. A trivial health check — handy for "is the server up?" and later for load-balancer checks.
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// 3. Resource desks: hand off by path prefix.
app.use('/posts', postsRouter)
app.use('/users', usersRouter)

// 4. Error lane — registered LAST so any next(err) upstream lands here.
app.use(errorHandler)

export default app
