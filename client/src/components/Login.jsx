import { useState } from 'react'
import '../styles/Login.css'

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Credenciais fixas
    if (username === 'metagame' && password === 'mtg123') {
      setError('')
      onLogin()
    } else {
      setError('Usuário ou senha incorretos')
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>♠️ PokerTrainer Pro</h1>
          <p>Metagame Training Platform</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Usuário</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
              autoComplete="username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              autoComplete="current-password"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="login-btn">
            Entrar
          </button>
        </form>
        
        <div className="login-footer">
          <p>Cash Game 6-Max Training • 100bb Deep</p>
        </div>
      </div>
    </div>
  )
}

export default Login
