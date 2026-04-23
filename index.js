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

// ---- HEALTH CHECK ----
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Auth API is running',
    version: '1.0.0'
  })
})

// ---- 404 HANDLER ----
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  })
})

// ---- ERROR HANDLER ----
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({
    success: false,
    message: 'Something went wrong on the server'
  })
})

// ---- START SERVER ----
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})