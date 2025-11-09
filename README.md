# PokerTrainer Pro - Cash Game Training Platform

Um SaaS para treinamento de poker pré-flop em cash games 6-max com interface inspirada no PIO Solver.

## 🎯 Funcionalidades

- ✅ Trainer interativo pré-flop
- ✅ 6 posições (UTG, HJ, CO, BTN, SB, BB)
- ✅ Feedback instantâneo
- ✅ Estatísticas em tempo real
- ✅ Interface com paleta PIO Solver (Vermelho, Verde, Azul)

## 🚀 Deploy no Vercel (Recomendado)

### Opção 1: Deploy com um clique

1. Clique aqui: [Deploy no Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fseu-usuario%2Fpoker_trainer_pro)

### Opção 2: Deploy via CLI

```bash
# 1. Instale o Vercel CLI
npm install -g vercel

# 2. Na pasta do projeto
cd poker_trainer_pro
vercel

# 3. Siga as instruções
```

### Opção 3: Conectar GitHub

1. Push seu código para GitHub
2. Vá para [vercel.com](https://vercel.com)
3. Clique em "New Project"
4. Selecione seu repositório
5. Clique em "Deploy"

## 📁 Estrutura do Projeto

```
poker_trainer_pro/
├── client/              # Frontend React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   └── PokerTrainer.jsx
│   │   ├── styles/
│   │   │   └── PokerTrainer.css
│   │   └── App.jsx
│   ├── public/
│   │   └── poker_ranges.json
│   └── package.json
├── server/              # Backend Express (futuro)
│   ├── server.js
│   └── poker_ranges.json
├── vercel.json          # Configuração Vercel
└── package.json
```

## 🛠️ Desenvolvimento Local

```bash
# Instalar dependências
cd client
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📊 Próximos Passos (Fase 2+)

- [ ] Integrar dados reais do Excel
- [ ] Adicionar autenticação de usuários
- [ ] Implementar sistema de assinatura
- [ ] Análise pós-flop
- [ ] Perfis de vilões customizáveis
- [ ] Dashboard com histórico de treino

## 📝 Licença

MIT
