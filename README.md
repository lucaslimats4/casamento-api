# Wedding API

API para site de casamento desenvolvida com NestJS.

## Funcionalidades

- **Módulo de Convidados**: Gerenciamento de convidados individuais e em grupos/famílias
- **Busca de Convidados**: Endpoint para buscar convidados por nome
- **Confirmação de Presença**: Endpoint para confirmar presença de múltiplos convidados

## Instalação

```bash
npm install
```

## Executar a aplicação

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run start:prod
```

## Popular banco com dados de exemplo

```bash
npm run seed
```

## Endpoints

### GET /guests/search
Busca convidados por nome (opcional)

**Query Parameters:**
- `name` (opcional): Nome para buscar

**Resposta:**
```json
{
  "groups": [
    {
      "id": 1,
      "name": "Família Silva",
      "guests": [
        {
          "id": 1,
          "name": "João Silva",
          "confirmed": false,
          "groupId": 1
        }
      ]
    }
  ],
  "individualGuests": [
    {
      "id": 6,
      "name": "Roberto Oliveira",
      "confirmed": false
    }
  ]
}
```

### POST /guests/confirm
Confirma presença de convidados

**Body:**
```json
{
  "guestIds": [1, 2, 3]
}
```

**Resposta:**
```json
{
  "confirmed": [1, 2],
  "notFound": [3]
}
```

## Testar a API

Você pode testar a API usando curl ou acessar a documentação Swagger em http://localhost:3000/api

### Exemplos de uso:

**Buscar todos os convidados:**
```bash
curl -X GET "http://localhost:3000/guests/search"
```

**Buscar convidados por nome:**
```bash
curl -X GET "http://localhost:3000/guests/search?name=Silva"
```

**Confirmar presença de convidados:**
```bash
curl -X POST "http://localhost:3000/guests/confirm" \
  -H "Content-Type: application/json" \
  -d '{"guestIds": [1, 2, 3]}'
```

## Tecnologias

- NestJS
- TypeORM
- SQLite
- Swagger/OpenAPI
- Class Validator