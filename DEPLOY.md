# Deploy na Vercel - Wedding API

## Configuração das Variáveis de Ambiente

No painel da Vercel, configure as seguintes variáveis de ambiente:

### Mercado Pago
```
MERCADO_PAGO_ACCESS_TOKEN=seu_token_do_mercado_pago
```

### Frontend
```
FRONTEND_URL=https://seu-dominio-frontend.vercel.app
```

### Database (Aiven PostgreSQL)
```
DB_TYPE=postgres
DB_HOST=seu-host-aiven.aivencloud.com
DB_PORT=10594
DB_USERNAME=avnadmin
DB_PASSWORD=sua-senha-aiven
DB_DATABASE=defaultdb
DB_SSL=true
```

## Passos para Deploy

1. **Conectar repositório à Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Faça login com sua conta GitHub
   - Clique em "New Project"
   - Selecione o repositório `casamento-api`

2. **Configurar o projeto:**
   - Framework Preset: Other
   - Root Directory: `casamento-api` (se estiver em monorepo)
   - Build Command: `npm run vercel-build`
   - Output Directory: deixe vazio
   - Install Command: `npm install`

3. **Adicionar variáveis de ambiente:**
   - Vá para Settings > Environment Variables
   - Adicione todas as variáveis listadas acima

4. **Deploy:**
   - Clique em "Deploy"
   - Aguarde o build e deploy

## Estrutura do Projeto

- `api/index.ts` - Entry point para Vercel serverless
- `vercel.json` - Configuração da Vercel
- `.vercelignore` - Arquivos ignorados no deploy

## URLs após Deploy

- API: `https://seu-projeto.vercel.app`
- Swagger: `https://seu-projeto.vercel.app/api`

## Testando a API

Após o deploy, teste os endpoints:

```bash
# Buscar convidados
curl https://seu-projeto.vercel.app/guests/search

# Buscar presentes
curl https://seu-projeto.vercel.app/gifts
```