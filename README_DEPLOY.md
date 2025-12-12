# 📦 Resumo do Projeto FinançasPro

## ✅ Status Atual

- ✅ **Front-end**: Deployado na Vercel → https://finpro-three.vercel.app/
- ⏳ **Back-end**: Pronto para deploy no Render

## 🎯 Objetivo

Coletar e exibir no dashboard todos os dados de:
- ✅ Cadastro de usuários
- ✅ Login de usuários  
- ✅ Checkout de pagamento

## 📁 Estrutura do Projeto

```
Finpro/
├── server/
│   ├── server.py          # Back-end Python (pronto para Render)
│   └── dashboard.html     # Dashboard para visualizar dados
├── js/
│   ├── config.js          # Configuração da API (atualizado)
│   ├── form-handler.js    # Handler de cadastro
│   ├── login.js           # Handler de login
│   └── pagamento.js       # Handler de pagamento
├── render.yaml            # Configuração do Render (opcional)
├── DEPLOY_RENDER.md       # Guia completo de deploy
└── .gitignore            # Arquivos ignorados pelo Git
```

## 🚀 Próximos Passos

### 1. Fazer Deploy no Render

Siga o guia completo em `DEPLOY_RENDER.md` ou:

1. Acesse https://render.com e crie uma conta
2. Clique em **"New +"** → **"Web Service"**
3. Conecte seu repositório Git
4. Configure:
   - **Start Command**: `python server/server.py`
   - **Build Command**: (deixe vazio)
5. Aguarde o deploy e anote a URL (ex: `https://finpro-backend.onrender.com`)

### 2. Atualizar Front-end

Após obter a URL do Render:

1. Edite `Finpro/js/config.js`
2. Substitua `'https://seu-backend.onrender.com'` pela URL real do Render
3. Faça commit e push
4. O Vercel fará redeploy automaticamente

### 3. Testar

1. Acesse o site na Vercel
2. Faça um cadastro de teste
3. Faça login
4. Complete um pagamento
5. Acesse o dashboard: `https://sua-url-render.onrender.com/dashboard.html`

## 🔧 Como Funciona

### Back-end (server.py)

- **Porta**: Usa `PORT` do ambiente (Render define automaticamente)
- **Endpoints**:
  - `POST /api/register` - Cadastro
  - `POST /api/login` - Login
  - `POST /api/pagamento` - Pagamento
  - `GET /api/data` - Todos os dados
  - `GET /api/users` - Usuários
  - `GET /api/stats` - Estatísticas
  - `GET /dashboard.html` - Dashboard visual

### Front-end

- Detecta automaticamente se está em produção ou desenvolvimento
- Em produção, usa a URL do Render configurada em `config.js`
- Em desenvolvimento, usa `http://localhost:3000`

## 📊 Dashboard

O dashboard exibe:
- Estatísticas gerais (usuários, registros, pagamentos, logins)
- Tabelas detalhadas de cada tipo de dado
- Opção de limpar todos os dados

Acesse: `https://sua-url-render.onrender.com/dashboard.html`

## ⚠️ Importante

- **Free Tier do Render**: Serviços gratuitos "dormem" após 15 min de inatividade
- **Primeiro acesso**: Pode demorar ~30 segundos para "acordar"
- **Dados**: Salvos em arquivos (`data.txt` e `users.txt`) - podem ser perdidos se o serviço for recriado

## 🐛 Problemas Comuns

**Erro de CORS**: Verifique se a URL no `config.js` está correta

**Serviço não responde**: Verifique os logs no dashboard do Render

**Dados não aparecem**: Verifique se o front-end está apontando para a URL correta do Render

