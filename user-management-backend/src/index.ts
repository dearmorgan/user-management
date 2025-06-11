import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/api', authRoutes)
app.use('/api/users', userRoutes)

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`)
})
