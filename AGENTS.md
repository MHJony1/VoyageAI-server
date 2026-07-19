# AGENTS.md

## Project

VoyageAI — Express 5 + TypeScript backend for an AI travel planning platform. MongoDB (Mongoose 9), deployed to Vercel.

## Commands

```bash
npm run dev           # ts-node-dev, hot reload, port 5000
npm run build         # tsc → dist/
npm run start         # node dist/server.js
npm run lint          # eslint src --ext .ts
npm run format        # prettier --write "src/**/*.ts"
npm run seed:admin    # ts-node src/scripts/seedAdmin.ts
```

No test suite exists. No typecheck script — `npm run build` is the typecheck (tsc with `strict: true`).

Verification order: `npm run lint && npm run build`

## Architecture

```
src/
  server.ts          # Entry: connects DB, starts Express on config.port
  app.ts             # Express app setup, middleware, mounts /api/v1
  config/            # environment.ts (dotenv), database.ts (mongoose connect)
  routes/index.ts    # Single router aggregating all module routes under /api/v1
  modules/           # Feature modules (auth, ai, trip, destination, review, user, admin, dashboard)
  models/            # Mongoose schemas + interfaces (*.model.ts, *.interface.ts)
  middlewares/        # authenticate, validate, errorHandler, notFound
  utils/             # catchAsync, logger, password, response, token
  helpers/           # Utility helpers
  services/          # Shared services
  scripts/           # seedAdmin.ts
```

### Module convention

Each module follows: `*.route.ts` → `*.controller.ts` → `*.service.ts` + `*.validation.ts` (Zod) + `*.interface.ts`.

Routes use `validate({ body: schema })` middleware and `authenticate` for protected endpoints.

### Key details

- All routes under `/api/v1` (see `app.ts:26`)
- Auth via JWT in cookies + Google OAuth
- AI features use `@google/generative-ai` (Gemini)
- Zod v4 for validation (not v3 — API differs)
- Express 5 (not 4) — async error handling differs from v4
- Two ESLint configs exist: `eslint.config.js` (flat config) and `.eslintrc.json` (legacy). `npm run lint` uses the flat config via eslint 10.
- `.env` required: `PORT`, `NODE_ENV`, `JWT_SECRET`, `DATABASE_URL`, `GEMINI_API_KEY` (warns but doesn't crash if missing)
- Vercel deploy builds from `dist/server.js`

## Style

- Prettier: single quotes, semicolons, trailing commas (es5), 100 char width
- Unused vars: warn (prefixed `_` OK)
- `no-console`: off (custom logger used in most places)
