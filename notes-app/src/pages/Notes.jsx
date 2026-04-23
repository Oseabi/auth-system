import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api'

export default function Notes() {

  const { user, logout } = useAuth()
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Fetch notes when component loads
  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const res = await api.get('/notes')
      setNotes(res.data.notes)
    } catch (error) {
      console.error('Error fetching notes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    setError('')

    try {
      const res = await api.post('/notes', { title, content })
      setNotes([res.data.note, ...notes])
      setTitle('')
      setContent('')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create note')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this note?')) return
    try {
      await api.delete(`/notes/${id}`)
      setNotes(notes.filter(note => note.id !== id))
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="notes-container">

      {/* HEADER */}
      <header className="notes-header">
        <div className="notes-header-left">
          <h1>My <span>Notes</span></h1>
          <p>Welcome back, {user?.name}</p>
        </div>
        <button className="logout-btn" onClick={logout}>
          Sign out
        </button>
      </header>

      {/* CREATE NOTE FORM */}
      <div className="create-note-card">
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              placeholder="Write your note here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
            />
          </div>
          {error && <div className="error-msg">{error}</div>}
          <button type="submit" disabled={saving}>
            {saving ? 'Saving...' : '+ Add Note'}
          </button>
        </form>
      </div>

      {/* NOTES LIST */}
      {loading ? (
        <div className="loading-state">Loading your notes...</div>
      ) : notes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"></div>
          <p>No notes yet. Create your first one above.</p>
        </div>
      ) : (
        <div className="notes-grid">
          {notes.map((note) => (
            <div key={note.id} className="note-card">
              <div className="note-top">
                <h3 className="note-title">{note.title}</h3>
                <button
                  className="note-delete"
                  onClick={() => handleDelete(note.id)}
                >
                  ✕
                </button>
              </div>
              {note.content && (
                <p className="note-content">{note.content}</p>
              )}
              <div className="note-date">{formatDate(note.created_at)}</div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}