# Nexus Backend

API REST construída com NestJS 11 e TypeScript. O backend gerencia autenticação de usuários e consulta de exames, utilizando dois bancos PostgreSQL independentes.

## Visão geral

| Módulo | Variáveis de ambiente | Finalidade |
|--------|----------------------|------------|
| **Identity** | `DATABASE_*` | Usuários, autenticação JWT e migrations locais |
| **Exam** | `EXAM_DATABASE_*` | Leitura read-only da tabela `central_teste.base_geral` em banco externo |

## Pré-requisitos

- Node.js 18+ (recomendado 20+)
- [Yarn](https://yarnpkg.com/)
- Docker e Docker Compose (para o Postgres local do módulo identity)
- Acesso ao banco PostgreSQL real de exames (`central_teste`)

## Inicialização do projeto

```bash
cd nexus-backend-typescripty
yarn install
cp .env.default .env
```

Edite o arquivo `.env` conforme descrito nas seções abaixo — especialmente as credenciais `EXAM_DATABASE_*` e o `JWT_SECRET`.

Em seguida, suba o banco local, rode as migrations e inicie a aplicação:

```bash
yarn services:up:database
yarn services:wait:database
yarn identity:db:migrate
yarn start:dev
```

A API estará disponível em **http://localhost:3000**.

## Configuração de variáveis de ambiente

O arquivo `.env` é criado a partir de [`.env.default`](./.env.default). Copie o template e preencha os valores reais antes de iniciar a aplicação.

### Variáveis gerais

| Variável | Default | Descrição |
|----------|---------|-----------|
| `NODE_ENV` | `development` | Ambiente de execução (`development`, `test` ou `production`) |
| `PORT` | `3000` | Porta HTTP da API |

### Banco identity (`DATABASE_*`)

Usado pelo módulo de autenticação e usuários. Em desenvolvimento, os valores padrão já estão alinhados com o Postgres provisionado pelo Docker Compose local.

| Variável | Default | Descrição |
|----------|---------|-----------|
| `DATABASE_HOST` | `localhost` | Host do Postgres identity |
| `DATABASE_PORT` | `5432` | Porta do Postgres identity |
| `DATABASE_USERNAME` | `postgres` | Usuário do banco identity |
| `DATABASE_PASSWORD` | `postgres` | Senha do banco identity |
| `DATABASE_NAME` | `postgres` | Nome do banco identity |
| `DATABASE_SCHEMA` | `public` | Schema do banco identity |
| `DATABASE_URL` | *(gerada)* | URL completa de conexão |

### Banco de exames (`EXAM_DATABASE_*`)

Usado pelo módulo exam para consulta read-only. **Os placeholders do `.env.default` não funcionam em desenvolvimento** — substitua pelas credenciais reais do banco de exames.

| Variável | Placeholder no `.env.default` | O que preencher |
|----------|-------------------------------|-----------------|
| `EXAM_DATABASE_HOST` | `localhost` | Host do servidor PostgreSQL real (ex.: RDS, IP interno) |
| `EXAM_DATABASE_PORT` | `5432` | Porta do banco |
| `EXAM_DATABASE_USERNAME` | `postgres` | Usuário com permissão de leitura |
| `EXAM_DATABASE_PASSWORD` | `your-exam-database-password` | Senha real do banco |
| `EXAM_DATABASE_NAME` | `central_teste` | Nome do banco (manter se igual ao ambiente) |
| `EXAM_DATABASE_SCHEMA` | `central_teste` | Schema onde existe a tabela `base_geral` |

#### Pontos importantes sobre o banco de exames

- O Docker Compose local ([`infra/compose.yml`](./infra/compose.yml)) **só provisiona** o Postgres do módulo identity. Ele **não** cria o banco nem o schema `central_teste`.
- O módulo exam é **read-only** e não possui migrations. A tabela `base_geral` deve já existir no banco externo.
- Em `development`, a conexão exam usa SSL com `rejectUnauthorized: false` (comum em bancos gerenciados como RDS).
- Solicite as credenciais reais à equipe responsável pelo banco de exames antes de iniciar o desenvolvimento.

#### Exemplo de `.env` com credenciais preenchidas

```env
EXAM_DATABASE_HOST=meu-servidor.exemplo.com
EXAM_DATABASE_PORT=5432
EXAM_DATABASE_USERNAME=leitor_exames
EXAM_DATABASE_PASSWORD=senha-segura-aqui
EXAM_DATABASE_NAME=central_teste
EXAM_DATABASE_SCHEMA=central_teste
```

### Autenticação e rate limiting

| Variável | Default | Descrição |
|----------|---------|-----------|
| `JWT_SECRET` | `your-jwt-secret-key` | Secret para assinatura dos tokens JWT — **troque por um valor seguro** |
| `THROTTLER_TTL` | `60000` | Janela de rate limit em milissegundos |
| `THROTTLER_LIMIT` | `100` | Limite global de requisições por janela |
| `THROTTLER_SIGN_IN_LIMIT` | `5` | Limite de requisições em `/auth/sign-in` |
| `THROTTLER_REGISTER_LIMIT` | `3` | Limite de requisições em `/user/register` |

## Scripts úteis

| Script | Descrição |
|--------|-----------|
| `yarn start:dev` | Inicia a API em modo desenvolvimento com hot reload |
| `yarn build` | Compila o projeto para `dist/` |
| `yarn start:prod` | Inicia a API a partir do build compilado |
| `yarn lint` | Executa o ESLint |
| `yarn test` | Roda testes unitários |
| `yarn test:e2e` | Roda testes end-to-end |
| `yarn test:e2e:setup` | Sobe o banco, roda migrations e executa os testes e2e |
| `yarn identity:db:migrate` | Executa migrations do módulo identity |
| `yarn db:migrate:all` | Executa todas as migrations (atualmente só identity) |
| `yarn services:up:database` | Sobe o Postgres local via Docker Compose |
| `yarn services:wait:database` | Aguarda o Postgres local ficar pronto |
| `yarn services:down:database` | Para o Postgres local |

## Endpoints principais

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| `POST` | `/user/register` | Registro de usuário | Não |
| `POST` | `/auth/sign-in` | Login (retorna JWT) | Não |
| `GET` | `/auth/profile` | Perfil do usuário autenticado | Sim |
| `GET` | `/exam/base-geral` | Listagem paginada de exames | Sim |
| `GET` | `/exam/base-geral/:id` | Detalhe de um exame por ID | Sim |

## Testes

Para rodar os testes e2e com setup completo (banco + migrations):

```bash
yarn test:e2e:setup
```

Os testes exigem os arquivos `.env` e `.env.test`. Copie o `.env.default` para ambos e ajuste os valores de teste conforme necessário.
