const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Banco de dados (usando o novo banco completo)
const dbPath = path.join(__dirname, 'poker_ranges.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco:', err);
  } else {
    console.log('✅ Banco de dados conectado:', dbPath);
    
    // Verificar quantos registros temos
    db.get('SELECT COUNT(*) as count FROM ranges', (err, row) => {
      if (err) console.error('Erro ao contar registros:', err);
      else console.log(`📊 Total de registros no banco: ${row.count}`);
    });
  }
});

// ============================================================================
// ROTAS DA API
// ============================================================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'PokerTrainer Pro API rodando!',
    timestamp: new Date().toISOString()
  });
});

// Obter mão aleatória para treino
app.get('/api/training/random-hand', (req, res) => {
  const { cenario, posicao_ativa, posicao_agressora } = req.query;
  
  let query = 'SELECT * FROM ranges WHERE 1=1';
  const params = [];
  
  if (cenario) {
    query += ' AND cenario = ?';
    params.push(cenario);
  }
  
  if (posicao_ativa) {
    query += ' AND posicao_ativa = ?';
    params.push(posicao_ativa);
  }
  
  if (posicao_agressora) {
    query += ' AND posicao_agressora = ?';
    params.push(posicao_agressora);
  }
  
  query += ' ORDER BY RANDOM() LIMIT 1';
  
  db.get(query, params, (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!row) {
      res.status(404).json({ error: 'Nenhuma mão encontrada com esses critérios' });
    } else {
      res.json(row);
    }
  });
});

// Verificar ação correta para uma mão
app.post('/api/training/check-action', (req, res) => {
  const { hand, cenario, posicao_ativa, posicao_agressora, user_action } = req.body;
  
  if (!hand || !cenario || !user_action) {
    return res.status(400).json({ 
      error: 'Parâmetros obrigatórios: hand, cenario, user_action' 
    });
  }
  
  let query = 'SELECT action FROM ranges WHERE hand = ? AND cenario = ?';
  const params = [hand, cenario];
  
  if (posicao_ativa) {
    query += ' AND posicao_ativa = ?';
    params.push(posicao_ativa);
  }
  
  if (posicao_agressora) {
    query += ' AND posicao_agressora = ?';
    params.push(posicao_agressora);
  }
  
  query += ' LIMIT 1';
  
  db.get(query, params, (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!row) {
      res.status(404).json({ error: 'Mão não encontrada' });
    } else {
      const correct_action = row.action;
      const is_correct = user_action.toUpperCase() === correct_action.toUpperCase();
      
      res.json({
        correct: is_correct,
        correct_action: correct_action,
        user_action: user_action
      });
    }
  });
});

// Obter estatísticas de um cenário
app.get('/api/stats/scenario', (req, res) => {
  const { cenario } = req.query;
  
  if (!cenario) {
    return res.status(400).json({ error: 'Parâmetro obrigatório: cenario' });
  }
  
  const query = `
    SELECT 
      action,
      COUNT(*) as count,
      ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM ranges WHERE cenario = ?), 1) as percentage
    FROM ranges 
    WHERE cenario = ?
    GROUP BY action
    ORDER BY count DESC
  `;
  
  db.all(query, [cenario, cenario], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({
        cenario: cenario,
        distribution: rows
      });
    }
  });
});

// Listar todos os cenários disponíveis
app.get('/api/scenarios', (req, res) => {
  const query = `
    SELECT DISTINCT 
      cenario,
      COUNT(*) as total_hands
    FROM ranges
    GROUP BY cenario
    ORDER BY cenario
  `;
  
  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Listar posições disponíveis
app.get('/api/positions', (req, res) => {
  const query = `
    SELECT DISTINCT posicao_ativa as position
    FROM ranges
    WHERE posicao_ativa IS NOT NULL
    ORDER BY posicao_ativa
  `;
  
  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Buscar range completo para um cenário específico
app.get('/api/range', (req, res) => {
  const { cenario, posicao_ativa, posicao_agressora } = req.query;
  
  if (!cenario) {
    return res.status(400).json({ error: 'Parâmetro obrigatório: cenario' });
  }
  
  let query = 'SELECT hand, action, color FROM ranges WHERE cenario = ?';
  const params = [cenario];
  
  if (posicao_ativa) {
    query += ' AND posicao_ativa = ?';
    params.push(posicao_ativa);
  }
  
  if (posicao_agressora) {
    query += ' AND posicao_agressora = ?';
    params.push(posicao_agressora);
  }
  
  query += ' ORDER BY hand';
  
  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({
        cenario,
        posicao_ativa,
        posicao_agressora,
        total_hands: rows.length,
        hands: rows
      });
    }
  });
});

// ============================================================================
// INICIAR SERVIDOR
// ============================================================================

app.listen(PORT, () => {
  console.log(`🚀 PokerTrainer Pro API rodando em http://localhost:${PORT}`);
  console.log(`📊 Endpoints disponíveis:`);
  console.log(`   GET  /api/health`);
  console.log(`   GET  /api/training/random-hand`);
  console.log(`   POST /api/training/check-action`);
  console.log(`   GET  /api/stats/scenario`);
  console.log(`   GET  /api/scenarios`);
  console.log(`   GET  /api/positions`);
  console.log(`   GET  /api/range`);
});

module.exports = { app, db };
