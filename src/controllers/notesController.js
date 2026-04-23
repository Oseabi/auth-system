const pool = require('../config/db')

// ---- GET ALL NOTES ----
const getNotes = async (req, res) => {
  try {

    const result = await pool.query(
      `SELECT id, title, content, created_at, updated_at
       FROM notes
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    )

    res.status(200).json({
      success: true,
      count: result.rows.length,
      notes: result.rows
    })

  } catch (error) {
    console.error('GetNotes error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    })
  }
}

// ---- CREATE NOTE ----
const createNote = async (req, res) => {
  try {

    const { title, content } = req.body

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a title'
      })
    }

    const result = await pool.query(
      `INSERT INTO notes (user_id, title, content)
       VALUES ($1, $2, $3)
       RETURNING id, title, content, created_at, updated_at`,
      [req.user.id, title, content || '']
    )

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      note: result.rows[0]
    })

  } catch (error) {
    console.error('CreateNote error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    })
  }
}

// ---- UPDATE NOTE ----
const updateNote = async (req, res) => {
  try {

    const { id } = req.params
    const { title, content } = req.body

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a title'
      })
    }

    // Make sure this note belongs to the logged in user
    const existing = await pool.query(
      'SELECT id FROM notes WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    )

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      })
    }

    const result = await pool.query(
      `UPDATE notes
       SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 AND user_id = $4
       RETURNING id, title, content, created_at, updated_at`,
      [title, content || '', id, req.user.id]
    )

    res.status(200).json({
      success: true,
      message: 'Note updated successfully',
      note: result.rows[0]
    })

  } catch (error) {
    console.error('UpdateNote error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    })
  }
}

// ---- DELETE NOTE ----
const deleteNote = async (req, res) => {
  try {

    const { id } = req.params

    // Make sure this note belongs to the logged in user
    const existing = await pool.query(
      'SELECT id FROM notes WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    )

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      })
    }

    await pool.query(
      'DELETE FROM notes WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    )

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully'
    })

  } catch (error) {
    console.error('DeleteNote error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    })
  }
}

module.exports = { getNotes, createNote, updateNote, deleteNote }