import { useState, useEffect } from 'react'
import '../styles/PokerTrainer.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function PokerTrainer() {
  const [currentHand, setCurrentHand] = useState(null)
  const [scenario, setScenario] = useState('RFI')
  const [position, setPosition] = useState('CO')
  const [aggressor, setAggressor] = useState(null)
  const [userAction, setUserAction] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [stats, setStats] = useState({ correct: 0, total: 0 })
  const [loading, setLoading] = useState(false)
  const [scenarios, setScenarios] = useState([])

  // Carregar cenários disponíveis
  useEffect(() => {
    fetch(`${API_URL}/api/scenarios`)
      .then(res => res.json())
      .then(data => setScenarios(data))
      .catch(err => console.error('Erro ao carregar cenários:', err))
  }, [])

  // Carregar nova mão
  const loadNewHand = async () => {
    setLoading(true)
    setUserAction(null)
    setFeedback(null)

    try {
      const params = new URLSearchParams({
        cenario: scenario,
        posicao_ativa: position
      })
      
      if (aggressor) {
        params.append('posicao_agressora', aggressor)
      }

      const response = await fetch(`${API_URL}/api/training/random-hand?${params}`)
      const data = await response.json()
      
      setCurrentHand(data)
    } catch (error) {
      console.error('Erro ao carregar mão:', error)
    } finally {
      setLoading(false)
    }
  }

  // Verificar ação do usuário
  const checkAction = async (action) => {
    if (!currentHand || userAction) return

    setUserAction(action)

    try {
      const response = await fetch(`${API_URL}/api/training/check-action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hand: currentHand.hand,
          cenario: scenario,
          posicao_ativa: position,
          posicao_agressora: aggressor,
          user_action: action
        })
      })

      const result = await response.json()
      setFeedback(result)

      // Atualizar estatísticas
      setStats(prev => ({
        correct: prev.correct + (result.correct ? 1 : 0),
        total: prev.total + 1
      }))
    } catch (error) {
      console.error('Erro ao verificar ação:', error)
    }
  }

  // Carregar primeira mão ao montar
  useEffect(() => {
    loadNewHand()
  }, [scenario, position, aggressor])

  // Renderizar cartas
  const renderCard = (rank, suit) => {
    const suitSymbols = { h: '♥', d: '♦', s: '♠', c: '♣' }
    const suitColors = { 
      h: '#e74c3c',  // Copas = Vermelho
      d: '#3498db',  // Ouros = Azul
      s: '#2c3e50',  // Espadas = Preto
      c: '#27ae60'   // Paus = Verde
    }
    
    return (
      <div className="poker-card" style={{ color: suitColors[suit] }}>
        <div className="card-corner top">
          <div className="card-rank">{rank}</div>
          <div className="card-suit">{suitSymbols[suit]}</div>
        </div>
        <div className="card-center">
          <div className="card-suit-large">{suitSymbols[suit]}</div>
        </div>
        <div className="card-corner bottom">
          <div className="card-rank">{rank}</div>
          <div className="card-suit">{suitSymbols[suit]}</div>
        </div>
      </div>
    )
  }

  // Parsear mão para cartas
  const parseHand = (hand) => {
    if (!hand) return []
    
    // Exemplos: AKs, 72o, QQ
    const ranks = hand.replace(/[so]/g, '').split('')
    const suited = hand.includes('s')
    const pair = ranks[0] === ranks[1]
    
    if (pair) {
      return [
        { rank: ranks[0], suit: 'h' },
        { rank: ranks[1], suit: 's' }
      ]
    }
    
    return [
      { rank: ranks[0], suit: suited ? 's' : 'h' },
      { rank: ranks[1], suit: suited ? 's' : 'd' }
    ]
  }

  const cards = currentHand ? parseHand(currentHand.hand) : []
  const accuracy = stats.total > 0 ? ((stats.correct / stats.total) * 100).toFixed(1) : 0

  return (
    <div className="poker-trainer">
      {/* Header */}
      <header className="trainer-header">
        <div className="header-left">
          <h1 className="logo">♠️ PokerTrainer Pro</h1>
          <p className="subtitle">Cash Game 6-Max Training • 100bb Deep</p>
        </div>
        <div className="header-right">
          <div className="stat-box">
            <span className="stat-label">Mãos</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-box success">
            <span className="stat-label">Acertos</span>
            <span className="stat-value">{stats.correct}</span>
          </div>
          <div className="stat-box warning">
            <span className="stat-label">Precisão</span>
            <span className="stat-value">{accuracy}%</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="trainer-content">
        {/* Sidebar */}
        <aside className="trainer-sidebar">
          <div className="sidebar-section">
            <h3>Cenário</h3>
            <select 
              value={scenario} 
              onChange={(e) => setScenario(e.target.value)}
              className="select-input"
            >
              <option value="RFI">RFI (Open Raise)</option>
              <option value="BB">BB Defense</option>
              <option value="3B">Facing 3-Bet</option>
              <option value="4B">Facing 4-Bet</option>
            </select>
          </div>

          <div className="sidebar-section">
            <h3>Sua Posição</h3>
            <div className="position-grid">
              {['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'].map(pos => (
                <button
                  key={pos}
                  className={`position-btn ${position === pos ? 'active' : ''}`}
                  onClick={() => setPosition(pos)}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          {scenario !== 'RFI' && (
            <div className="sidebar-section">
              <h3>Agressor</h3>
              <div className="position-grid">
                {['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'].map(pos => (
                  <button
                    key={pos}
                    className={`position-btn ${aggressor === pos ? 'active' : ''}`}
                    onClick={() => setAggressor(pos)}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="sidebar-section">
            <h3>Estatísticas</h3>
            <div className="stats-detail">
              <div className="stat-row">
                <span>Total:</span>
                <span>{stats.total}</span>
              </div>
              <div className="stat-row">
                <span>Corretas:</span>
                <span className="text-success">{stats.correct}</span>
              </div>
              <div className="stat-row">
                <span>Erradas:</span>
                <span className="text-error">{stats.total - stats.correct}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Area */}
        <main className="trainer-main">
          {/* Poker Table */}
          <div className="poker-table-container">
            <div className="poker-table">

              {/* Positions */}
              <div className="table-position utg">
                <div className={`position-marker ${position === 'UTG' ? 'active' : ''} ${aggressor === 'UTG' ? 'aggressor' : ''}`}>
                  UTG
                  <span className="stack">100bb</span>
                </div>
              </div>
              <div className="table-position hj">
                <div className={`position-marker ${position === 'HJ' ? 'active' : ''} ${aggressor === 'HJ' ? 'aggressor' : ''}`}>
                  HJ
                  <span className="stack">100bb</span>
                </div>
              </div>
              <div className="table-position co">
                <div className={`position-marker ${position === 'CO' ? 'active' : ''} ${aggressor === 'CO' ? 'aggressor' : ''}`}>
                  CO
                  <span className="stack">100bb</span>
                </div>
              </div>
              <div className="table-position btn">
                <div className={`position-marker ${position === 'BTN' ? 'active' : ''} ${aggressor === 'BTN' ? 'aggressor' : ''}`}>
                  BTN
                  <span className="stack">100bb</span>
                </div>
              </div>
              <div className="table-position sb">
                <div className={`position-marker ${position === 'SB' ? 'active' : ''} ${aggressor === 'SB' ? 'aggressor' : ''}`}>
                  SB
                  <span className="stack">100bb</span>
                </div>
              </div>
              <div className="table-position bb">
                <div className={`position-marker ${position === 'BB' ? 'active' : ''} ${aggressor === 'BB' ? 'aggressor' : ''}`}>
                  BB
                  <span className="stack">100bb</span>
                </div>
              </div>

              {/* Cards */}
              <div className="hero-cards">
                {loading ? (
                  <div className="loading">Carregando...</div>
                ) : cards.length > 0 ? (
                  <>
                    {renderCard(cards[0].rank, cards[0].suit)}
                    {renderCard(cards[1].rank, cards[1].suit)}
                  </>
                ) : null}
              </div>
            </div>
          </div>

          {/* Situation */}
          <div className="situation-box">
            {currentHand && (
              <p className="situation-text">
                {scenario === 'RFI' && `Todos foldaram para você no ${position}. Ação em você.`}
                {scenario === 'BB' && aggressor && `${aggressor} abriu para 2.5bb. Ação em você no ${position}.`}
                {scenario === '3B' && aggressor && `Você abriu, ${aggressor} fez 3-BET. Ação em você.`}
                {scenario === '4B' && aggressor && `Você 3-betou, ${aggressor} fez 4-BET. Ação em você.`}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              className="action-btn fold"
              onClick={() => checkAction('FOLD')}
              disabled={!currentHand || userAction}
            >
              FOLD
            </button>
            {scenario === 'BB' && (
              <button
                className="action-btn call"
                onClick={() => checkAction('CALL')}
                disabled={!currentHand || userAction}
              >
                CALL
              </button>
            )}
            <button
              className="action-btn raise"
              onClick={() => checkAction('3BET')}
              disabled={!currentHand || userAction}
            >
              {scenario === 'RFI' ? 'RAISE 2.5bb' : '3-BET'}
            </button>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`feedback-box ${feedback.correct ? 'correct' : 'incorrect'}`}>
              <div className="feedback-header">
                {feedback.correct ? '✅ Correto!' : '❌ Incorreto!'}
              </div>
              <div className="feedback-body">
                <p>
                  {currentHand.hand} no {scenario} {position}
                  {aggressor && ` vs ${aggressor}`}
                </p>
                <p className="feedback-action">
                  Ação correta: <strong>{feedback.correct_action}</strong>
                </p>
                {!feedback.correct && (
                  <p className="feedback-user">
                    Você escolheu: <strong>{feedback.user_action}</strong>
                  </p>
                )}
              </div>
              <button className="next-hand-btn" onClick={loadNewHand}>
                Próxima Mão →
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
