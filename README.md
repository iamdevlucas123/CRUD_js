# CRUD de Usu�rios (Node.js + Express + MySQL)

API RESTful em Node.js/Express para gerenciar usuários com MySQL. Suporta execução local ou via Docker Compose.

## Tecnologias
- Node.js 18+ / Express
- MySQL 8 (driver `mysql2/promise`)
- Docker + Docker Compose (opcional)
- Dotenv para variáveis de ambiente

## Estrutura
```
src/
  config/db.js          # Pool MySQL
  server.js             # Bootstrap do Express
  routes/users_routes.js# Rotas CRUD de usuários
docker-compose.yml      # Orquestração Node + MySQL
.env                    # Variaveis de ambiente (exemplo incluído)
package.json
```

## Vari�veis de ambiente
`.env` de exemplo:
```
PORT=3001
MYSQL_HOST=localhost
MYSQL_USER=app
MYSQL_PASSWORD=app_password
MYSQL_ROOT_PASSWORD=root_password
MYSQL_DATABASE=CRUD_db
MYSQL_PORT=3306
MYSQL_CONN_LIMIT=10
```
> No Compose, `MYSQL_HOST`  sobrescrito para `db` (nome do serviço do MySQL).

## Como rodar

### Local (sem Docker)
1. Tenha um MySQL acessível com os valores do `.env`.
2. Instale dependências:
   ```sh
   npm install
   ```
3. Suba a API:
   ```sh
   npm start
   ```
4. API disponível em `http://localhost:${PORT}` (padrão `3001`).

### Docker Compose
1. Ajuste a porta se quiser alinhar com o `.env` (opcional): no `docker-compose.yml`, troque `ports: "${PORT:-3000}:3000"` para `ports: "${PORT:-3001}:3001"` e garanta `PORT=3001` no `.env`.
2. Suba os serviços:
   ```sh
   docker-compose up -d
   ```
3. Serviços:
   - API: `http://localhost:${PORT:-3000}`
   - MySQL: `localhost:${MYSQL_PORT:-3306}`

## Endpoints
Base: `/users`

- `POST /users` - cria usuário  
  Body JSON: `{ "name":"Fulano","lastname":"Silva","email":"fulano@email.com" }`
- `GET /users` - lista todos
- `GET /users/:id` - busca por id
- `PUT /users/:id` - atualiza (mesmo body do POST)
- `DELETE /users/:id` - remove

C�digos de status: `201` criado, `400` requisição inválida, `404` não encontrado, `500` erro interno.

### Exemplos (curl)
```sh
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Fulano","lastname":"Silva","email":"fulano@email.com"}'

curl http://localhost:3001/users
curl http://localhost:3001/users/1
curl -X PUT http://localhost:3001/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Novo","lastname":"Nome","email":"novo@email.com"}'

curl -X DELETE http://localhost:3001/users/1
```

## Scripts npm
- `npm start` - inicia a API (`node src/server.js`)
- `npm test` - placeholder (sem testes configurados)

## Notas e boas pr�ticas
- Produção: use senhas fortes e limite de conex�es (`MYSQL_CONN_LIMIT`), habilite CORS/helmet/rate-limit.
- DB: adicione restrição `UNIQUE` em `user_email` para evitar duplicatas.
- Validação: considere schema validation (Joi/Zod/Yup) e middleware global de erros.
- Migrations/seed: use uma ferramenta (ex.: `knex` ou `sequelize-cli`) para versionar schema e popular dados iniciais.
- Observabilidade: adicione logs estruturados (pino/winston) e endpoint `/health` para liveness/readiness.
- Docs: gerar OpenAPI/Swagger ajuda no consumo da API.
