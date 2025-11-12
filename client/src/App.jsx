import { useState } from 'react'
import './App.css'
import Login from './components/Login'
import PokerTrainer from './components/PokerTrainer'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  return (
    <div className="app">
      {isAuthenticated ? (
        <PokerTrainer />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  )
}

export default App
