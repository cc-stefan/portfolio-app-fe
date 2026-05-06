# Portfolio Frontend

Next.js 16 frontend for the portfolio app. The current frontend is a server-rendered portfolio and admin interface that consumes the sibling backend API rather than keeping a duplicate content source.

## Current features

- SSR portfolio homepage and project detail pages
- locale-aware routing with `next-intl`
- English and Romanian UI support
- public project pages backed by locale-aware API reads
- admin authentication against the backend JWT API
- admin dashboard
- admin project management
- admin inquiry management
- theme switching

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- `next-intl`
- `next-themes`
- shadcn/ui primitives

## Locale model

Supported UI locales today:

- `en`
- `ro`

Route behavior:

- English is the default locale and uses unprefixed routes like `/` and `/projects/[slug]`
- Romanian uses prefixed routes like `/ro` and `/ro/projects/[slug]`

Project content is not translated in the frontend at runtime. The frontend requests already-localized project content from the backend with a `locale` query parameter and renders the returned translation, including fallback metadata such as `contentLocale`.

## Local setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Create the local env file

```bash
cp .env.example .env.local
```

Current local env example:

```env
PORTFOLIO_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

The app also accepts `NEXT_PUBLIC_PORTFOLIO_API_BASE_URL` if you want the backend URL exposed explicitly to the browser-side runtime.

### 3. Start the backend from the sibling repo

From `portfolio-app-be`:

```bash
pnpm db:up
pnpm prisma:generate
pnpm exec prisma migrate deploy
docker exec -i portfolio-postgres psql -U postgres -d portfolio_app -v ON_ERROR_STOP=1 < scripts/seed.sql
pnpm start:dev
```

Default backend API URL:

- `http://localhost:3001/api`

### 4. Start the frontend

```bash
pnpm dev
```

Open:

- `http://localhost:3000`

## Scripts

```bash
pnpm dev
pnpm lint
pnpm build
pnpm start
```

## Route surface

### Public portfolio

- `/`
- `/projects/[slug]`
- `/ro`
- `/ro/projects/[slug]`

### Admin

- `/admin/login`
- `/admin`
- `/admin/projects`
- `/admin/projects/new`
- `/admin/projects/[id]`
- `/admin/inquiries`
- `/admin/inquiries/[id]`

Romanian-prefixed admin routes also exist, for example:

- `/ro/admin/login`
- `/ro/admin/projects`

## Data flow

### Public pages

The portfolio pages fetch from the backend:

- `GET /api/health`
- `GET /api/projects?locale=<locale>`
- `GET /api/projects/:slug?locale=<locale>`

The frontend expects public project responses to include:

- localized `title`
- localized `summary`
- localized `description`
- `contentLocale`
- `availableLocales`

### Admin pages

The admin UI uses the backend auth and admin APIs:

- login, refresh, logout, and `me`
- admin dashboard
- admin project CRUD
- admin project image upload/remove
- admin inquiry CRUD-style workflow

For project editing, the admin UI manages one form with locale tabs rather than separate duplicated forms per language. The payload shape matches the backend `translations[]` contract.

## Project localization in the UI

Admin project editing supports:

- shared project metadata such as `slug`, links, technologies, and publish flags
- locale-specific `title`, `summary`, and `description`
- manual language switching between `en` and `ro`

The frontend does not keep a second translation source for projects. It edits and renders what the backend stores.

## Middleware and navigation

- locale routing is handled by `next-intl`
- the project root `proxy.ts` wires locale middleware
- localized links are generated with helper functions in `src/features/portfolio/i18n/routing.ts`

## Seeded local admin access

If you seeded the backend with `scripts/seed.sql`, you can log in with:

- `admin@example.com`
- `Admin123!`

## Notes

- The public portfolio is SSR-first and does not depend on client-side data hydration for core content.
- When the backend is unavailable, the public pages render graceful degraded states instead of crashing.
- The current development setup works end to end against the sibling backend repo.
- There is still a known Next 16 fallback-route prerender issue during `pnpm build` on framework error/not-found pages. `pnpm lint` passes and development mode works normally.
