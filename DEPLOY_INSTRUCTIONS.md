# 🚀 Instruções de Deploy - PokerTrainer Pro

## Passo 1: Criar uma conta no GitHub (se não tiver)

1. Vá para [github.com](https://github.com)
2. Clique em "Sign up"
3. Preencha os dados e confirme o email

## Passo 2: Criar um repositório no GitHub

1. Vá para [github.com/new](https://github.com/new)
2. Nome do repositório: `poker_trainer_pro`
3. Descrição: "PokerTrainer Pro - Cash Game Training Platform"
4. Selecione "Public"
5. Clique em "Create repository"

## Passo 3: Upload do código para GitHub

```bash
# No terminal, na pasta poker_trainer_pro:

git remote add origin https://github.com/SEU_USUARIO/poker_trainer_pro.git
git branch -M main
git push -u origin main
```

Substitua `SEU_USUARIO` pelo seu usuário do GitHub.

## Passo 4: Deploy no Vercel

### Opção A: Deploy automático (Recomendado)

1. Vá para [vercel.com](https://vercel.com)
2. Clique em "Sign up" (ou "Sign in" se já tiver conta)
3. Selecione "Continue with GitHub"
4. Autorize o Vercel
5. Clique em "New Project"
6. Selecione o repositório `poker_trainer_pro`
7. Clique em "Import"
8. Na aba "Build and Output Settings":
   - Build Command: `cd client && npm install && npm run build`
   - Output Directory: `client/dist`
9. Clique em "Deploy"

### Opção B: Deploy via CLI

```bash
# 1. Instale o Vercel CLI
npm install -g vercel

# 2. Na pasta do projeto
cd poker_trainer_pro

# 3. Execute o deploy
vercel

# 4. Siga as instruções na tela
```

## ✅ Pronto!

Após o deploy, você terá um link permanente como:
```
https://poker-trainer-pro.vercel.app
```

Este link estará **sempre disponível** e você pode compartilhá-lo com qualquer pessoa!

---

## 📝 Próximas atualizações

Sempre que você fizer mudanças no código e fazer `git push`, o Vercel vai fazer deploy automaticamente!

```bash
git add .
git commit -m "Descrição das mudanças"
git push
```

---

## 🆘 Problemas?

Se tiver dúvidas:
1. Verifique se o código está no GitHub
2. Verifique se o Vercel está conectado ao GitHub
3. Verifique os logs de build no Vercel (aba "Deployments")

