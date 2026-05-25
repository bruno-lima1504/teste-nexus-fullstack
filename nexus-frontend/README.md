# Nexus Frontend

Interface web para autenticação e consulta de exames. Construída com Next.js 15 (App Router) e consome a API do backend via proxy interno.

## Stack

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui**
- **TanStack React Query** — data fetching e cache
- **react-hook-form** + **Zod** — formulários e validação
- **JWT** armazenado no `localStorage` para autenticação

## Pré-requisitos

- Node.js 18.18+ (recomendado 20+)
- npm
- Backend rodando em **http://localhost:3000** (ver [README do backend](../nexus-backend-typescripty/README.md))

## Inicialização

```bash
cd nexus-frontend
npm install
npm run dev
```

Acesse **http://localhost:3001** no navegador.

### Fluxo da aplicação

1. Cadastro em `/sign-up`
2. Login em `/sign-in`
3. Dashboard com listagem de exames em `/`
4. Detalhe de um exame em `/exam/:id`

## Integração com o backend

O frontend não chama a API diretamente. As requisições passam por um proxy configurado em [`next.config.ts`](./next.config.ts):

```
Browser  →  fetch("/api/auth/sign-in")
        →  Next.js rewrite (porta 3001)
        →  http://localhost:3000/auth/sign-in  (backend NestJS)
```

O cliente HTTP centralizado está em [`lib/api.ts`](./lib/api.ts):

- Prefixa paths com `/api`
- Envia `Authorization: Bearer <token>` quando autenticado
- Token JWT armazenado no `localStorage` (chave `nexus_token`)

### Endpoints consumidos

| Funcionalidade | Método | Path (via proxy) |
|----------------|--------|------------------|
| Login | `POST` | `/api/auth/sign-in` |
| Cadastro | `POST` | `/api/user/register` |
| Perfil | `GET` | `/api/auth/profile` |
| Listagem de exames | `GET` | `/api/exam/base-geral` |
| Detalhe do exame | `GET` | `/api/exam/base-geral/:id` |

## Scripts

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento na **porta 3001** |
| `npm run build` | Gera o build de produção |
| `npm start` | Inicia o servidor de produção (porta **3000** por padrão) |
| `npm run lint` | Executa o ESLint |

## Portas

| Ambiente | Porta | Observação |
|----------|-------|------------|
| Desenvolvimento (`npm run dev`) | **3001** | Evita conflito com o backend na porta 3000 |
| Produção (`npm start`) | **3000** | Pode conflitar com o backend se ambos rodarem localmente |

Certifique-se de que o backend esteja ativo em `http://localhost:3000` antes de usar o frontend em desenvolvimento.

## Variáveis de ambiente

Atualmente **não há arquivo `.env`** no projeto. A URL do backend está definida diretamente no [`next.config.ts`](./next.config.ts):

```typescript
destination: "http://localhost:3000/:path*"
```

Para apontar o frontend a outro ambiente (staging, produção), será necessário alterar esse rewrite ou introduzir uma variável de ambiente no `next.config.ts`.

## Estrutura de rotas

```
app/
├── (auth)/
│   ├── sign-in/     # Login
│   └── sign-up/     # Cadastro
└── (dashboard)/
    ├── /            # Listagem de exames
    └── exam/[id]/   # Detalhe do exame
```

O layout do dashboard inclui proteção de rota client-side via `useAuthGuard()` — usuários não autenticados são redirecionados para `/sign-in`.
