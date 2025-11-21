import '../styles/RangeGrid.css'

export default function RangeGrid({ ranges, currentHand, userAction }) {
  // Ordem das cartas (do mais alto para o mais baixo)
  const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
  
  // Gerar grid 13x13
  const generateGrid = () => {
    const grid = []
    
    for (let i = 0; i < ranks.length; i++) {
      const row = []
      for (let j = 0; j < ranks.length; j++) {
        const rank1 = ranks[i]
        const rank2 = ranks[j]
        
        let hand
        if (i === j) {
          // Diagonal = pares
          hand = `${rank1}${rank2}`
        } else if (i < j) {
          // Acima da diagonal = suited
          hand = `${rank1}${rank2}s`
        } else {
          // Abaixo da diagonal = offsuit
          hand = `${rank1}${rank2}o`
        }
        
        row.push(hand)
      }
      grid.push(row)
    }
    
    return grid
  }
  
  // Obter cor da célula baseado na ação
  const getCellColor = (hand) => {
    if (!ranges || ranges.length === 0) return 'default'
    
    const rangeEntry = ranges.find(r => r.hand === hand)
    if (!rangeEntry) return 'default'
    
    switch (rangeEntry.action) {
      case 'OPEN':
      case '3BET':
      case '4BET':
      case '5BET':
        return 'raise'
      case 'CALL':
        return 'call'
      case 'FOLD':
        return 'fold'
      default:
        return 'default'
    }
  }
  
  // Verificar se é a mão atual
  const isCurrentHand = (hand) => {
    if (!currentHand) return false
    return hand === currentHand
  }
  
  const grid = generateGrid()
  
  return (
    <div className="range-grid-container">
      <div className="range-grid">
        {grid.map((row, i) => (
          <div key={i} className="grid-row">
            {row.map((hand, j) => {
              const color = getCellColor(hand)
              const isCurrent = isCurrentHand(hand)
              
              return (
                <div
                  key={j}
                  className={`grid-cell ${color} ${isCurrent ? 'current' : ''} ${userAction ? 'answered' : ''}`}
                  title={hand}
                >
                  {hand}
                </div>
              )
            })}
          </div>
        ))}
      </div>
      
      <div className="range-legend">
        <div className="legend-item">
          <span className="legend-color raise"></span>
          <span>Raise/Open</span>
        </div>
        <div className="legend-item">
          <span className="legend-color call"></span>
          <span>Call</span>
        </div>
        <div className="legend-item">
          <span className="legend-color fold"></span>
          <span>Fold</span>
        </div>
      </div>
    </div>
  )
}
