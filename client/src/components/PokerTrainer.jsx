import { useState, useEffect } from 'react'
import '../styles/PokerTrainer.css'

const POSITIONS = ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB']
const ACTIONS = ['Fold', 'Call', 'Raise']

// Mãos de poker em ordem de força
const ALL_HANDS = [
  'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22',
  'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
  'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s', 'K3s', 'K2s',
  'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s', 'Q6s', 'Q5s', 'Q4s', 'Q3s', 'Q2s',
  'JTs', 'J9s', 'J8s', 'J7s', 'J6s', 'J5s', 'J4s', 'J3s', 'J2s',
  'T9s', 'T8s', 'T7s', 'T6s', 'T5s', 'T4s', 'T3s', 'T2s',
  '98s', '97s', '96s', '95s', '94s', '93s', '92s',
  '87s', '86s', '85s', '84s', '83s', '82s',
  '76s', '75s', '74s', '73s', '72s',
  '65s', '64s', '63s', '62s',
  '54s', '53s', '52s',
  '43s', '42s',
  '32s',
  'AKo', 'AQo', 'AJo', 'ATo', 'A9o', 'A8o', 'A7o', 'A6o', 'A5o', 'A4o', 'A3o', 'A2o',
  'KQo', 'KJo', 'KTo', 'K9o', 'K8o', 'K7o', 'K6o', 'K5o', 'K4o', 'K3o', 'K2o',
  'QJo', 'QTo', 'Q9o', 'Q8o', 'Q7o', 'Q6o', 'Q5o', 'Q4o', 'Q3o', 'Q2o',
  'JTo', 'J9o', 'J8o', 'J7o', 'J6o', 'J5o', 'J4o', 'J3o', 'J2o',
  'T9o', 'T8o', 'T7o', 'T6o', 'T5o', 'T4o', 'T3o', 'T2o',
  '98o', '97o', '96o', '95o', '94o', '93o', '92o',
  '87o', '86o', '85o', '84o', '83o', '82o',
  '76o', '75o', '74o', '73o', '72o',
  '65o', '64o', '63o', '62o',
  '54o', '53o', '52o',
  '43o', '42o',
  '32o'
]

export default function PokerTrainer() {
  const [position, setPosition] = useState('UTG')
  const [currentHand, setCurrentHand] = useState(null)
  const [userAnswer, setUserAnswer] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [stats, setStats] = useState({ correct: 0, total: 0, score: 0 })
  const [ranges, setRanges] = useState({})
  const [loading, setLoading] = useState(true)

  // Carregar ranges do servidor
  useEffect(() => {
    fetch('/poker_ranges.json')
      .then(res => res.json())
      .then(data => {
        setRanges(data)
        setLoading(false)
        generateNewHand(data, position)
      })
      .catch(err => {
        console.error('Erro ao carregar ranges:', err)
        setLoading(false)
      })
  }, [])

  const generateNewHand = (rangesData, pos) => {
    const randomHand = ALL_HANDS[Math.floor(Math.random() * ALL_HANDS.length)]
    setCurrentHand(randomHand)
    setUserAnswer(null)
    setFeedback(null)
  }

  const getCorrectAction = (hand, pos) => {
    if (!ranges[pos] || !ranges[pos].hands[hand]) {
      return 'Raise' // Default
    }
    
    const frequency = ranges[pos].hands[hand]
    if (frequency >= 80) return 'Raise'
    if (frequency >= 40) return 'Call'
    return 'Fold'
  }

  const handleAnswer = (action) => {
    const correctAction = getCorrectAction(currentHand, position)
    const isCorrect = action === correctAction
    
    setUserAnswer(action)
    setFeedback({
      correct: isCorrect,
      userAction: action,
      correctAction: correctAction,
      hand: currentHand,
      position: position
    })

    setStats(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
      score: ((prev.correct + (isCorrect ? 1 : 0)) / (prev.total + 1) * 100).toFixed(1)
    }))
  }

  const handleNextHand = () => {
    generateNewHand(ranges, position)
  }

  const handlePositionChange = (newPos) => {
    setPosition(newPos)
    generateNewHand(ranges, newPos)
    setStats({ correct: 0, total: 0, score: 0 })
  }

  if (loading) {
    return <div className="trainer-container"><p>Carregando ranges...</p></div>
  }

  return (
    <div className="trainer-container">
      <header className="trainer-header">
        <h1>🎰 PokerTrainer Pro</h1>
        <p>Treine sua estratégia pré-flop em cash games 6-max</p>
      </header>

      <div className="trainer-content">
        {/* Seletor de Posição */}
        <div className="position-selector">
          <h3>Selecione a Posição:</h3>
          <div className="position-buttons">
            {POSITIONS.map(pos => (
              <button
                key={pos}
                className={`position-btn ${position === pos ? 'active' : ''}`}
                onClick={() => handlePositionChange(pos)}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>

        {/* Área Principal do Trainer */}
        <div className="trainer-main">
          {currentHand && (
            <>
              <div className="hand-display">
                <h2>Sua Mão:</h2>
                <div className="hand-card">
                  <span className="hand-text">{currentHand}</span>
                </div>
              </div>

              <div className="action-buttons">
                <h3>Qual é a ação correta?</h3>
                <div className="buttons-grid">
                  {ACTIONS.map(action => (
                    <button
                      key={action}
                      className={`action-btn action-${action.toLowerCase()} ${userAnswer === action ? 'selected' : ''}`}
                      onClick={() => handleAnswer(action)}
                      disabled={userAnswer !== null}
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>

              {feedback && (
                <div className={`feedback ${feedback.correct ? 'correct' : 'incorrect'}`}>
                  <h4>{feedback.correct ? '✓ Correto!' : '✗ Incorreto'}</h4>
                  <p>Sua resposta: <strong>{feedback.userAction}</strong></p>
                  <p>Resposta correta: <strong>{feedback.correctAction}</strong></p>
                  <p>Mão: <strong>{feedback.hand}</strong> em <strong>{feedback.position}</strong></p>
                  <button className="next-btn" onClick={handleNextHand}>
                    Próxima Mão →
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Estatísticas */}
        <div className="stats-panel">
          <h3>Estatísticas</h3>
          <div className="stat-item">
            <span>Corretas:</span>
            <strong>{stats.correct}/{stats.total}</strong>
          </div>
          <div className="stat-item">
            <span>Taxa de Acerto:</span>
            <strong>{stats.score}%</strong>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${stats.score}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
