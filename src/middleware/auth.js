const jwt = require('jsonwebtoken')
require('dotenv').config()

const protect = (req, res, next) => {

  try {

    // Get token from header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please log in.'
      })
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.split(' ')[1]

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Attach user data to the request
    req.user = decoded

    // Move to the next function
    next()

  } catch (error) {

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please log in again.'
      })
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid token. Please log in again.'
    })

  }

}

module.exports = { protect }