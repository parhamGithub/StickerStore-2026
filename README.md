# Sticker Store

A full-stack e-commerce storefront for buying and collecting vinyl stickers. Browse stickers by category, save favorites, manage a profile, and place orders.

## Tech Stack

**Frontend (Next.js)**
- [Next.js 16](https://nextjs.org) (App Router) with React 19
- TypeScript (strict mode)
- Tailwind CSS v4 (CSS-based config, no `tailwind.config.*`)
- [shadcn/ui](https://ui.shadcn.com) components (Base UI under the hood) + `lucide-react` icons
- [Redux Toolkit](https://redux-toolkit.js.org) + RTK Query for state and data fetching
- `framer-motion` for animations, `react-hot-toast` for notifications

**Backend (Express + Bun)**
- [Bun](https://bun.sh) runtime (`bun:sqlite`, `Bun.password`)
- Express server with CORS and JSON body parsing
- JWT authentication (`jsonwebtoken`)
- [Zod](https://zod.dev) for request validation

**Database**
- [Bun SQLite](https://bun.sh/docs/api/sqlite) — a local file DB at `backend/data/store.db`, auto-created and seeded on first run. No external database service required.

## Project Structure

```
.
├── src/                 # Next.js frontend (App Router)
│   ├── app/             # Routes: home, cart, profile, signin, signup
│   ├── components/      # UI components + shadcn/ui primitives
│   └── lib/             # Redux store, RTK Query API slice, theme, cart slice
├── backend/             # Express + Bun API
│   └── src/
│       ├── index.ts     # Server entrypoint
│       ├── db.ts        # SQLite setup, schema, seed data
│       ├── middleware/   # JWT auth middleware
│       ├── routes/       # products, categories, orders, auth, likes, profile, upload, dev
│       └── validation.ts # Zod schemas
├── render.yaml          # Render deploy config (backend)
└── next.config.ts       # Rewrites /api/* and /avatars/* to the backend
```

## Getting Started

### Prerequisites
- [Bun](https://bun.sh) (>= 1.3) installed
- Node is only needed if you prefer running the frontend via `npm`/`yarn`/`pnpm`, but `bun` is the intended package manager.

### 1. Install dependencies

```bash
# Frontend
bun install

# Backend
cd backend && bun install && cd ..
```

### 2. Configure environment

Copy `.env.example` to `.env` (in the project root) and adjust if needed:

```bash
cp .env.example .env
```

- `PORT` — backend port (default `4000`)
- `JWT_SECRET` — secret used to sign auth tokens
- `API_URL` — public backend URL used by `next.config.ts` rewrites. Defaults to `http://localhost:4000` in development; set this to your deployed backend URL in production.

### 3. Run the dev servers

Run both the frontend and backend together:

```bash
bun run dev:all
```

Or run them separately:

```bash
bun run backend   # Express API on http://localhost:4000
bun run dev       # Next.js on http://localhost:3000
```

The backend database is created and seeded automatically on first startup (`backend/data/store.db`).

Open [http://localhost:3000](http://localhost:3000) to view the store.

## Available Scripts

| Command            | Description                                              |
| ------------------ | -------------------------------------------------------- |
| `bun run dev`      | Start the Next.js dev server                             |
| `bun run backend`  | Start the Express API (`bun --watch`)                    |
| `bun run dev:all`  | Start backend and frontend together                      |
| `bun run build`    | Build the Next.js app                                    |
| `bun run build:all`| Build the Next.js app and compile the backend            |
| `bun run start`    | Start the production Next.js server                      |
| `bun run start:all`| Start the backend and frontend in production mode        |
| `bun run lint`     | Run ESLint                                               |

Backend-only scripts (run with `bun --cwd backend <script>`): `dev`, `seed`, `build`, `start`.

## API

Base path: `/api` (proxied to the backend via Next.js rewrites).

| Method | Endpoint                  | Auth | Description                              |
| ------ | ------------------------- | ---- | ---------------------------------------- |
| GET    | `/products`               | No   | List products (query: `category`, `q`)   |
| GET    | `/products/:id`           | No   | Get a single product                     |
| GET    | `/categories`             | No   | List categories                          |
| POST   | `/auth/signup`            | No   | Create account, returns JWT              |
| POST   | `/auth/signin`            | No   | Log in, returns JWT                       |
| GET    | `/orders`                 | No   | List all orders                          |
| POST   | `/orders`                 | Yes  | Place an order                           |
| GET    | `/likes`                  | Yes  | List liked product IDs                   |
| POST   | `/likes`                  | Yes  | Toggle a like (body: `{ productId }`)    |
| GET    | `/profile`                | Yes  | Get profile, stats, orders, liked IDs    |
| PUT    | `/profile`                | Yes  | Update profile fields                    |
| DELETE | `/profile`                | Yes  | Delete account                           |
| POST   | `/upload`                 | Yes  | Upload avatar image (max 5MB)            |
| GET    | `/dev/users`              | No   | List registered users (dev helper)       |

Authenticated requests must include an `Authorization: Bearer <token>` header.

## Deployment

- **Frontend**: deploy the Next.js app to [Vercel](https://vercel.com) (or any Node host). Set `API_URL` to your backend's public URL.
- **Backend**: a [`render.yaml`](./render.yaml) is included for deploying the Express API to [Render](https://render.com) as a Docker web service. It builds from `backend/Dockerfile`, expects `PORT` (default `10000`) and a generated `JWT_SECRET`, and health-checks `/api/products`.

## Notes

- The SQLite database file (`backend/data/`) is local and not committed. It is created and seeded on first backend start.
- Avatars uploaded via `/upload` are stored in `backend/public/avatars/` and served at `/avatars/*`.
