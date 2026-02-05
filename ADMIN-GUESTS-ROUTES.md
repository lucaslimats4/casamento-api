# Rotas Administrativas de Convidados - Wedding API

## Autenticação Necessária

Todas as rotas abaixo requerem autenticação JWT. Primeiro faça login:

```bash
POST /auth/login
{
  "password": "casamento123"
}
```

Use o token retornado no header: `Authorization: Bearer SEU_TOKEN`

## Rotas CRUD para Grupos de Convidados

### 📊 Estatísticas
```
GET /guests/admin/stats
```
Retorna estatísticas gerais dos convidados e grupos.

### 📋 Listar Grupos
```
GET /guests/admin/groups
```
Lista todos os grupos de convidados com seus membros.

### ➕ Criar Grupo
```
POST /guests/admin/groups
Content-Type: application/json

{
  "name": "Família Silva"
}
```

### 🔍 Buscar Grupo por ID
```
GET /guests/admin/groups/:id
```
Retorna um grupo específico com todos os seus convidados.

### ✏️ Atualizar Grupo
```
PUT /guests/admin/groups/:id
Content-Type: application/json

{
  "name": "Família Silva Santos"
}
```

### 🗑️ Deletar Grupo
```
DELETE /guests/admin/groups/:id
```
Remove o grupo e desassocia os convidados (eles ficam sem grupo).

## Rotas CRUD para Convidados

### 📋 Listar Convidados
```
GET /guests/admin
GET /guests/admin?confirmed=true
GET /guests/admin?confirmed=false
GET /guests/admin?groupId=1
```
Lista convidados com filtros opcionais.

### ➕ Criar Convidado
```
POST /guests/admin
Content-Type: application/json

{
  "name": "João Silva",
  "isChild": false,
  "groupId": 1  // opcional
}
```

### 🔍 Buscar Convidado por ID
```
GET /guests/admin/:id
```
Retorna um convidado específico.

### ✏️ Atualizar Convidado
```
PUT /guests/admin/:id
Content-Type: application/json

{
  "name": "João Silva Santos",  // opcional
  "isChild": false,             // opcional
  "confirmed": true,            // opcional
  "groupId": 2                  // opcional
}
```

### 🗑️ Deletar Convidado
```
DELETE /guests/admin/:id
```
Remove o convidado permanentemente.

## Exemplos de Uso

### Workflow Completo

1. **Login**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password": "casamento123"}'
```

2. **Criar Grupo**
```bash
curl -X POST http://localhost:3000/guests/admin/groups \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Família Silva"}'
```

3. **Criar Convidados no Grupo**
```bash
curl -X POST http://localhost:3000/guests/admin \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "isChild": false,
    "groupId": 1
  }'

curl -X POST http://localhost:3000/guests/admin \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Silva",
    "isChild": false,
    "groupId": 1
  }'
```

4. **Listar Convidados**
```bash
curl -X GET http://localhost:3000/guests/admin \
  -H "Authorization: Bearer SEU_TOKEN"
```

5. **Confirmar Convidado**
```bash
curl -X PUT http://localhost:3000/guests/admin/1 \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"confirmed": true}'
```

6. **Ver Estatísticas**
```bash
curl -X GET http://localhost:3000/guests/admin/stats \
  -H "Authorization: Bearer SEU_TOKEN"
```

## Códigos de Resposta

- **200** - Sucesso
- **201** - Criado com sucesso
- **400** - Dados inválidos
- **401** - Token inválido ou não fornecido
- **404** - Recurso não encontrado
- **500** - Erro interno do servidor

## Validações

### CreateGuestGroupDto
- `name`: obrigatório, string não vazia

### CreateGuestDto
- `name`: obrigatório, string não vazia
- `isChild`: opcional, boolean (padrão: false)
- `groupId`: opcional, número (deve existir)

### UpdateGuestDto
- Todos os campos são opcionais
- `confirmed`: boolean para marcar confirmação
- Mesmas validações dos campos obrigatórios quando fornecidos

## Estrutura de Resposta

### GuestResponseDto
```json
{
  "id": 1,
  "name": "João Silva",
  "confirmed": true,
  "isChild": false,
  "groupId": 1,
  "groupName": "Família Silva"
}
```

### GuestGroupResponseDto
```json
{
  "id": 1,
  "name": "Família Silva",
  "guests": [
    {
      "id": 1,
      "name": "João Silva",
      "confirmed": true,
      "isChild": false,
      "groupId": 1
    }
  ]
}
```

### Estatísticas
```json
{
  "totalGuests": 50,
  "confirmedGuests": 30,
  "pendingGuests": 20,
  "totalGroups": 15,
  "adultsCount": 40,
  "childrenCount": 10
}
```

## Testando no Swagger

1. Acesse `http://localhost:3000/api`
2. Faça login em `/auth/login`
3. Clique em "Authorize" e cole o token
4. Teste as rotas administrativas na seção "guests"

## Arquivo de Teste

Use o arquivo `test-admin-guests.http` para testar todas as rotas com o VS Code REST Client.