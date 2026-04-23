const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./src/routes/auth')

const app = express()
const PORT = process.env.PORT || 5000

// ---- MIDDLEWARE ----
app.use(cors())
app.use(express.json())

// ---- ROUTES ----
app.use('/api/auth', authRoutes)

const notesRoutes = require('./src/routes/notes')
app.use('/api/notes', notesRoutes)

// ---- HEALTH CHECK ----
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Auth API is running',
    version: '1.0.0'
  })
})

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  })
})

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({
    success: false,
    message: 'Something went wrong on the server'
  })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})