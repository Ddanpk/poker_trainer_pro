const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Banco de dados
const dbPath = path.join(__dirname, '../server/poker_ranges.db');
let db = null;

function getDb() {
  if (!db) {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) console.error('Erro ao conectar ao banco:', err);
    });
  }
  return db;
}

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  const db = getDb();

  try {
    // Health check
    if (pathname === '/api/health') {
      return res.json({
        status: 'OK',
        message: 'PokerTrainer Pro API rodando!',
        timestamp: new Date().toISOString()
      });
    }

    // Random hand
    if (pathname === '/api/training/random-hand' && req.method === 'GET') {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const cenario = url.searchParams.get('cenario');
      const posicao_ativa = url.searchParams.get('posicao_ativa');
      const posicao_agressora = url.searchParams.get('posicao_agressora');

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

      return new Promise((resolve) => {
        db.get(query, params, (err, row) => {
          if (err) {
            res.status(500).json({ error: err.message });
          } else if (!row) {
            res.status(404).json({ error: 'Nenhuma mão encontrada' });
          } else {
            res.json(row);
          }
          resolve();
        });
      });
    }

    // All ranges (para visualização do grid)
    if (pathname === '/api/training/all-ranges' && req.method === 'GET') {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const cenario = url.searchParams.get('cenario');
      const posicao_ativa = url.searchParams.get('posicao_ativa');
      const posicao_agressora = url.searchParams.get('posicao_agressora');

      let query = 'SELECT hand, action FROM ranges WHERE 1=1';
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

      return new Promise((resolve) => {
        db.all(query, params, (err, rows) => {
          if (err) {
            res.status(500).json({ error: err.message });
          } else {
            res.json(rows);
          }
          resolve();
        });
      });
    }

    // Check action
    if (pathname === '/api/training/check-action' && req.method === 'POST') {
      const body = await getBody(req);
      const { hand, cenario, posicao_ativa, posicao_agressora, user_action } = body;

      if (!hand || !cenario || !user_action) {
        return res.status(400).json({ error: 'Parâmetros obrigatórios: hand, cenario, user_action' });
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

      return new Promise((resolve) => {
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
          resolve();
        });
      });
    }

    // Scenarios
    if (pathname === '/api/scenarios' && req.method === 'GET') {
      const query = `
        SELECT DISTINCT cenario, COUNT(*) as total_hands
        FROM ranges
        GROUP BY cenario
        ORDER BY cenario
      `;

      return new Promise((resolve) => {
        db.all(query, (err, rows) => {
          if (err) {
            res.status(500).json({ error: err.message });
          } else {
            res.json(rows);
          }
          resolve();
        });
      });
    }

    // Default 404
    res.status(404).json({ error: 'Endpoint não encontrado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper para ler body do POST
function getBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      resolve(JSON.parse(body));
    });
  });
}
