# 🎯 Referências de Interface - Apps de Treino de Poker

## PokerSnowie - Análise de Interface

### 📊 Características Principais Observadas:

#### 1. **Mesa de Poker Visual**
- Mesa oval verde (similar ao que queremos)
- Posições claramente marcadas
- Cartas grandes e visíveis
- Stack sizes mostrados

#### 2. **Sistema de Feedback**
- Barras coloridas mostrando frequências de ações:
  - **Amarelo/Laranja** = Fold
  - **Verde** = Call
  - **Azul** = Raise
- Percentuais exibidos ao lado de cada ação
- Recomendação clara da ação (ex: "CALL 60% or RAISE 6.25 POT")
- Botão "Got it" para confirmar e avançar

#### 3. **Modos de Treino**
- **Preflop** - Treino de ranges pré-flop
- **Cash Game** - Situações de cash game
- **Custom** - Cenários customizados

#### 4. **Interface Limpa**
- Fundo escuro (não distrai)
- Elementos bem espaçados
- Informações claras e objetivas
- Navegação simples

---

## GTO Wizard - Características

### 📊 Funcionalidades Conhecidas:
- Trainer interativo com quiz diário
- Soluções GTO completas
- Range viewer
- Hand history review
- Coaching integrado

---

## 🎯 O Que Devemos Implementar no PokerTrainer Pro

### Fase 1: PRÉ-FLOP (MVP Atual)
✅ **Já Temos:**
- Banco de dados com 956 mãos
- Ranges do Excel processados
- Backend com SQLite

🎯 **Precisamos Adicionar:**
1. **Mesa Visual**
   - Mesa oval verde (como PokerSnowie)
   - 6 posições marcadas (UTG, HJ, CO, BTN, SB, BB)
   - Cartas grandes e visíveis

2. **Sistema de Feedback Visual**
   - Barras coloridas com frequências (PIO Solver colors):
     - 🔴 Vermelho = Fold
     - 🟢 Verde = Call  
     - 🔵 Azul = Raise
   - Mostrar percentuais corretos após resposta
   - Feedback imediato (correto/incorreto)

3. **Fluxo de Treino**
   - Apresentar situação (posição + ação do vilão)
   - Mostrar cartas do herói
   - Usuário escolhe ação
   - Mostrar feedback com frequências corretas
   - Botão "Próxima Mão"

### Fase 2: PÓS-FLOP (Próxima Etapa)

🎯 **Com Base na Blueprint VDC:**
1. **Apresentar Board (Flop/Turn/River)**
   - Mostrar cartas comunitárias
   - Mostrar ação do vilão
   - Mostrar pot size

2. **Decisões Pós-Flop**
   - Check / Bet (com sizes) / Raise / Fold
   - Considerar perfil do vilão (Reg vs Fish)
   - Mostrar exploits aplicáveis

3. **Feedback Baseado em Blueprint**
   - Comparar com estratégia correta da blueprint
   - Explicar o exploit (ex: "Overfold neste spot")
   - Mostrar ajustes vs Regs e Fishes

---

## 📐 Wireframe/Layout Proposto

```
┌─────────────────────────────────────────────┐
│           POKERTRAINER PRO                  │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │                                       │ │
│  │         MESA OVAL VERDE               │ │
│  │                                       │ │
│  │    UTG    HJ    CO    BTN    SB  BB  │ │
│  │                                       │ │
│  │         [A♠] [J♠]                     │ │
│  │      (Cartas do Herói)                │ │
│  │                                       │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  Situação: BTN abriu, você está no CO      │
│                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐    │
│  │  FOLD   │  │  CALL   │  │  RAISE  │    │
│  │   🔴    │  │   🟢    │  │   🔵    │    │
│  └─────────┘  └─────────┘  └─────────┘    │
│                                             │
│  [Após resposta]                            │
│  ━━━━━━━ 15%  Fold                         │
│  ████████████ 60%  Call ✅ (Você acertou!) │
│  ████ 25%  Raise                           │
│                                             │
│  [Próxima Mão]                              │
└─────────────────────────────────────────────┘
```

---

## 🎨 Paleta de Cores (PIO Solver)

- **Fold:** `#e74c3c` (Vermelho)
- **Call:** `#2ecc71` (Verde)
- **Raise:** `#3498db` (Azul)
- **Background:** `#2c3e50` (Cinza escuro)
- **Mesa:** `#27ae60` (Verde poker)
- **Texto:** `#ecf0f1` (Branco suave)

---

## 📝 Próximos Passos

1. ✅ Criar componente de mesa visual
2. ✅ Implementar display de cartas grandes
3. ✅ Integrar banco de dados com frontend
4. ✅ Criar sistema de feedback visual com barras
5. ✅ Implementar lógica de validação de respostas
6. ✅ Adicionar contador de acertos/erros
7. ✅ Deploy no Vercel

---

**Data:** 09/11/2025  
**Referências:** PokerSnowie, GTO Wizard, PIO Solver
