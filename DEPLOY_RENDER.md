# 🚀 Guia de Deploy no Render

Este guia explica como fazer o deploy do back-end da FinançasPro no Render.

## 📋 Pré-requisitos

1. Conta no [Render](https://render.com) (gratuita)
2. Código do projeto em um repositório Git (GitHub, GitLab ou Bitbucket)

## 🔧 Passo a Passo

### 1. Preparar o Repositório

Certifique-se de que todos os arquivos estão commitados e enviados para o seu repositório Git.

### 2. Criar Novo Serviço no Render

1. Acesse [Render Dashboard](https://dashboard.render.com)
2. Clique em **"New +"** → **"Web Service"**
3. Conecte seu repositório Git (GitHub/GitLab/Bitbucket)
4. Selecione o repositório do projeto

### 3. Configurar o Serviço

Preencha os seguintes campos:

- **Name**: `finpro-backend` (ou qualquer nome que preferir)
- **Region**: Escolha a região mais próxima (ex: `Oregon (US West)`)
- **Branch**: `main` ou `master` (depende da sua branch principal)
- **Root Directory**: Deixe vazio ou coloque `Finpro` se o código estiver em uma subpasta
- **Runtime**: `Python 3`
- **Build Command**: Deixe vazio (não precisa de build)
- **Start Command**: `python server/server.py`
- **Instance Type**: `Free` (para começar)

### 4. Variáveis de Ambiente (Opcional)

O Render define automaticamente a variável `PORT`, que o `server.py` já usa.

Se quiser adicionar outras variáveis:
- Vá em **Environment** → **Add Environment Variable**

### 5. Deploy

1. Clique em **"Create Web Service"**
2. O Render começará a fazer o deploy automaticamente
3. Aguarde alguns minutos até o deploy completar
4. Anote a URL gerada (ex: `https://finpro-backend.onrender.com`)

### 6. Atualizar o Front-end (Vercel)

Após obter a URL do Render, você precisa atualizar o `config.js` no front-end:

1. No seu projeto local, edite `Finpro/js/config.js`
2. Adicione a URL do Render:

```javascript
const API_CONFIG = {
    BASE_URL: (function() {
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            // Substitua pela URL do seu serviço Render
            return 'https://finpro-backend.onrender.com';
        }
        return 'http://localhost:3000';
    })()
};
```

3. Faça commit e push das alterações
4. O Vercel fará o redeploy automaticamente

## 📁 Estrutura de Arquivos no Render

O Render precisa acessar o `server.py`. A estrutura deve ser:

```
Finpro/
├── server/
│   ├── server.py
│   └── dashboard.html
├── js/
│   ├── config.js
│   └── ...
└── requirements.txt (pode estar vazio)
```

## 🔍 Verificando o Deploy

1. Acesse a URL do Render (ex: `https://finpro-backend.onrender.com/api/stats`)
2. Deve retornar um JSON com estatísticas
3. Acesse o dashboard: `https://finpro-backend.onrender.com/dashboard.html`

## ⚠️ Importante

- **Free Tier**: O Render suspende serviços gratuitos após 15 minutos de inatividade. O primeiro acesso após suspensão pode demorar ~30 segundos para "acordar".
- **Persistência**: Os arquivos `data.txt` e `users.txt` são salvos no sistema de arquivos do Render, mas podem ser perdidos se o serviço for recriado. Para produção, considere usar um banco de dados.
- **CORS**: O servidor já está configurado para aceitar requisições de qualquer origem (`Access-Control-Allow-Origin: *`).

## 🐛 Troubleshooting

### Erro: "Module not found"
- Verifique se o `requirements.txt` está presente (pode estar vazio)

### Erro: "Port already in use"
- O Render define automaticamente a variável `PORT`, não precisa configurar manualmente

### Erro de CORS no front-end
- Verifique se a URL no `config.js` está correta
- O servidor já tem CORS habilitado, mas verifique os logs do Render

### Serviço não responde
- Verifique os logs no dashboard do Render
- Certifique-se de que o `Start Command` está correto: `python server/server.py`

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs no dashboard do Render
2. Teste localmente primeiro: `python server/server.py`
3. Verifique se a URL do Render está acessível no navegador

