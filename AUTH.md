# Sistema de Autenticação - Wedding API

## Visão Geral

A API possui um sistema de autenticação simples baseado em JWT (JSON Web Token) para proteger rotas administrativas.

## Como Funcionar

### 1. Login

**Endpoint:** `POST /auth/login`

**Body:**
```json
{
  "password": "casamento123"
}
```

**Resposta de Sucesso:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 86400,
  "token_type": "Bearer"
}
```

### 2. Usando o Token

Para acessar rotas protegidas, inclua o token no header `Authorization`:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Rotas Protegidas Disponíveis

### Estatísticas
- `GET /gifts/admin/stats` - Estatísticas dos presentes

### Gerenciamento de Presentes (CRUD)
- `GET /gifts/admin` - Listar todos os presentes (com filtros)
- `POST /gifts/admin` - Criar novo presente
- `GET /gifts/admin/:id` - Buscar presente por ID
- `PUT /gifts/admin/:id` - Atualizar presente
- `DELETE /gifts/admin/:id` - Deletar presente

### Exemplos de Uso

#### Criar Presente
```bash
POST /gifts/admin
Authorization: Bearer seu-token-aqui
Content-Type: application/json

{
  "title": "Jogo de Panelas",
  "description": "Conjunto com 5 panelas antiaderentes",
  "price": 299.99,
  "image": "https://example.com/panelas.jpg"
}
```

#### Atualizar Presente
```bash
PUT /gifts/admin/1
Authorization: Bearer seu-token-aqui
Content-Type: application/json

{
  "title": "Jogo de Panelas Premium",
  "price": 349.99,
  "purchased": true
}
```

#### Listar Presentes com Filtros
```bash
# Todos os presentes
GET /gifts/admin

# Ordenados por preço (crescente)
GET /gifts/admin?sortByPrice=asc

# Apenas presentes comprados
GET /gifts/admin?purchased=true

# Apenas presentes disponíveis
GET /gifts/admin?purchased=false
```

### 3. Exemplo de Rota Protegida

**Endpoint:** `GET /gifts/admin/stats`

**Headers:**
```
Authorization: Bearer seu-token-aqui
```

**Resposta:**
```json
{
  "total": 50,
  "purchased": 15,
  "available": 35,
  "totalValue": 12500.00,
  "purchasedValue": 3750.00
}
```

## Configuração

### Variáveis de Ambiente

```env
# Senha de administrador (padrão: admin123)
ADMIN_PASSWORD=casamento123

# Chave secreta para assinar os JWTs (padrão: wedding-secret-key)
JWT_SECRET=wedding-super-secret-jwt-key-2026
```

### Configuração na Vercel

No painel da Vercel, adicione as variáveis de ambiente:

1. `ADMIN_PASSWORD` - Senha para fazer login
2. `JWT_SECRET` - Chave secreta para os tokens JWT

## Testando no Swagger

1. Acesse `/api` (documentação Swagger)
2. Faça login em `/auth/login` com a senha
3. Copie o `access_token` da resposta
4. Clique no botão "Authorize" no topo da página
5. Cole o token no campo (sem "Bearer ")
6. Agora você pode testar rotas protegidas

## Exemplo com cURL

```bash
# 1. Fazer login
curl -X POST https://sua-api.vercel.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password": "casamento123"}'

# 2. Criar presente (substitua SEU_TOKEN pelo token recebido)
curl -X POST https://sua-api.vercel.app/gifts/admin \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Jogo de Panelas",
    "description": "Conjunto antiaderente",
    "price": 299.99
  }'

# 3. Listar presentes
curl -X GET https://sua-api.vercel.app/gifts/admin \
  -H "Authorization: Bearer SEU_TOKEN"

# 4. Atualizar presente
curl -X PUT https://sua-api.vercel.app/gifts/admin/1 \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"purchased": true}'

# 5. Deletar presente
curl -X DELETE https://sua-api.vercel.app/gifts/admin/1 \
  -H "Authorization: Bearer SEU_TOKEN"
```

## Segurança

- Tokens expiram em 24 horas
- Use HTTPS em produção
- Mantenha a `JWT_SECRET` segura
- Não compartilhe tokens
- Para produção, considere usar hash para a senha

## Adicionando Novas Rotas Protegidas

Para proteger uma rota, adicione o decorator `@UseGuards(JwtAuthGuard)`:

```typescript
import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Get('admin/exemplo')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiOperation({ summary: 'Rota protegida de exemplo' })
async exemploProtegido() {
  return { message: 'Acesso autorizado!' };
}
```