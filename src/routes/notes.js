const express = require('express')
const router = express.Router()
const { getNotes, createNote, updateNote, deleteNote } = require('../controllers/notesController')
const { protect } = require('../middleware/auth')

// All notes routes are protected
router.use(protect)

router.get('/', getNotes)
router.post('/', createNote)
router.put('/:id', updateNote)
router.delete('/:id', deleteNote)

module.exports = router