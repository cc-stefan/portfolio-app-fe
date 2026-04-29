## Portfolio Frontend

Next.js 16 frontend for the `portfolio-app-be` backend. The UI is server-rendered and pulls published project data from the backend API instead of keeping a separate frontend content source.

### Local setup

1. Install dependencies:

```bash
pnpm dev
```

2. Create the frontend env file:

```bash
cp .env.example .env.local
```

Default backend URL:

```bash
PORTFOLIO_API_BASE_URL=http://localhost:3001/api
```

3. Start the backend from the sibling repo:

```bash
pnpm start:dev
```

4. Start the frontend:

```bash
pnpm dev
```

Open `http://localhost:3000`.

### Implemented routes

- `/` renders the portfolio homepage from `GET /api/projects`
- `/projects/[slug]` renders a project detail page from `GET /api/projects/:slug`

### Notes

- If the backend is offline, the frontend renders a graceful empty/error state instead of crashing.
- The current UI is wired to the public backend endpoints. Admin/auth flows can be added on top of the same API later.
