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

// Banco de dados
const dbPath = path.join(__dirname, 'poker_trainer.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Erro ao conectar ao banco:', err);
  else console.log('✓ Banco de dados conectado');
});

// Criar tabelas
db.serialize(() => {
  // Tabela de posições
  db.run(`
    CREATE TABLE IF NOT EXISTS positions (
      id INTEGER PRIMARY KEY,
      name TEXT UNIQUE,
      abbreviation TEXT
    )
  `);

  // Tabela de mãos
  db.run(`
    CREATE TABLE IF NOT EXISTS hands (
      id INTEGER PRIMARY KEY,
      name TEXT UNIQUE,
      rank INTEGER
    )
  `);

  // Tabela de ranges (estratégia)
  db.run(`
    CREATE TABLE IF NOT EXISTS ranges (
      id INTEGER PRIMARY KEY,
      position_id INTEGER,
      hand_id INTEGER,
      action TEXT,
      frequency REAL,
      FOREIGN KEY(position_id) REFERENCES positions(id),
      FOREIGN KEY(hand_id) REFERENCES hands(id)
    )
  `);

  // Tabela de usuários
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT UNIQUE,
      email TEXT UNIQUE,
      password TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de sessões de treino
  db.run(`
    CREATE TABLE IF NOT EXISTS training_sessions (
      id INTEGER PRIMARY KEY,
      user_id INTEGER,
      position TEXT,
      total_hands INTEGER,
      correct_hands INTEGER,
      score REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);
});

// Rotas básicas
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor rodando!' });
});

app.get('/api/positions', (req, res) => {
  db.all('SELECT * FROM positions', (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

module.exports = db;
