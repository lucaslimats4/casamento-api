# Rotas Administrativas - Wedding API

## Autenticação Necessária

Todas as rotas abaixo requerem autenticação JWT. Primeiro faça login:

```bash
POST /auth/login
{
  "password": "casamento123"
}
```

Use o token retornado no header: `Authorization: Bearer SEU_TOKEN`

## Rotas CRUD para Presentes

### 📊 Estatísticas
```
GET /gifts/admin/stats
```
Retorna estatísticas gerais dos presentes.

### 📋 Listar Presentes (Admin)
```
GET /gifts/admin
GET /gifts/admin?sortByPrice=asc
GET /gifts/admin?sortByPrice=desc
GET /gifts/admin?purchased=true
GET /gifts/admin?purchased=false
```
Lista presentes com filtros opcionais.

### ➕ Criar Presente
```
POST /gifts/admin
Content-Type: application/json

{
  "title": "Nome do presente",
  "description": "Descrição detalhada",
  "price": 299.99,
  "image": "https://example.com/image.jpg" // opcional
}
```

### 🔍 Buscar Presente por ID
```
GET /gifts/admin/:id
```
Retorna um presente específico.

### ✏️ Atualizar Presente
```
PUT /gifts/admin/:id
Content-Type: application/json

{
  "title": "Novo título", // opcional
  "description": "Nova descrição", // opcional
  "price": 349.99, // opcional
  "image": "https://example.com/new-image.jpg", // opcional
  "purchased": true // opcional
}
```
Atualiza campos específicos do presente.

### 🗑️ Deletar Presente
```
DELETE /gifts/admin/:id
```
Remove o presente permanentemente.

## Exemplos de Uso

### Workflow Completo

1. **Login**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password": "casamento123"}'
```

2. **Criar Presente**
```bash
curl -X POST http://localhost:3000/gifts/admin \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Jogo de Panelas Antiaderente",
    "description": "Conjunto com 5 panelas de alta qualidade",
    "price": 299.99,
    "image": "https://example.com/panelas.jpg"
  }'
```

3. **Listar Presentes**
```bash
curl -X GET http://localhost:3000/gifts/admin \
  -H "Authorization: Bearer SEU_TOKEN"
```

4. **Atualizar Preço**
```bash
curl -X PUT http://localhost:3000/gifts/admin/1 \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"price": 349.99}'
```

5. **Marcar como Comprado**
```bash
curl -X PUT http://localhost:3000/gifts/admin/1 \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"purchased": true}'
```

6. **Ver Estatísticas**
```bash
curl -X GET http://localhost:3000/gifts/admin/stats \
  -H "Authorization: Bearer SEU_TOKEN"
```

7. **Deletar Presente**
```bash
curl -X DELETE http://localhost:3000/gifts/admin/1 \
  -H "Authorization: Bearer SEU_TOKEN"
```

## Códigos de Resposta

- **200** - Sucesso
- **201** - Criado com sucesso
- **400** - Dados inválidos
- **401** - Token inválido ou não fornecido
- **404** - Presente não encontrado
- **500** - Erro interno do servidor

## Validações

### CreateGiftDto
- `title`: obrigatório, string não vazia
- `description`: obrigatório, string não vazia
- `price`: obrigatório, número positivo com até 2 casas decimais
- `image`: opcional, deve ser uma URL válida

### UpdateGiftDto
- Todos os campos são opcionais
- `purchased`: boolean para marcar como comprado/disponível
- Mesmas validações dos campos obrigatórios quando fornecidos

## Testando no Swagger

1. Acesse `http://localhost:3000/api`
2. Faça login em `/auth/login`
3. Clique em "Authorize" e cole o token
4. Teste as rotas administrativas na seção "gifts"

## Arquivo de Teste

Use o arquivo `test-admin-gifts.http` para testar todas as rotas com o VS Code REST Client.