import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Notes from './pages/Notes'

function AppContent() {

  const { user, loading } = useAuth()
  const [showRegister, setShowRegister] = useState(false)

  if (loading) {
    return <div className="loading-screen">Loading...</div>
  }

  if (user) {
    return <Notes />
  }

  if (showRegister) {
    return <Register onSwitch={() => setShowRegister(false)} />
  }

  return <Login onSwitch={() => setShowRegister(true)} />

}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}