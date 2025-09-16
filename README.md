# Buyer Lead Intake (Next.js + Prisma + Postgres)

## Setup

1) Requirements
- Node 18+
- Postgres (Supabase works)

2) Environment variables
Create `.env` with:
```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB
APP_URL=http://localhost:3000
# Optional for real emails (Resend)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM="Esahayak <no-reply@yourdomain.com>"
```

3) Install
```bash
npm install
```

4) Database (Prisma)
- Generate client and run migrations
```bash
npx prisma generate
npx prisma migrate deploy
```
- If developing locally without prior migrations:
```bash
npx prisma migrate dev
```

5) Run locally
```bash
npm run dev
```
App: `http://localhost:3000`

6) Auth (Magic Link)
- In development (without RESEND_API_KEY): the link is logged to the console.
- Dev helper to login without email after submitting the form: a “Click here to login” link appears.
- Production: set `RESEND_API_KEY` and `EMAIL_FROM` to send real emails via Resend.


## Design Notes

- Validation
  - Zod schemas live in `src/lib/validation/schemas.ts`.
  - API validation via `withValidation` middleware (parses body/URL params, coerces numbers, returns 400 with details).

- Authentication
  - Magic link flow in `src/app/api/auth/signin/route.ts` and `src/app/api/auth/verify/route.ts`.
  - Sessions stored in DB; JWT stored as secure cookie `session-token`.
  - Auth guard via `withAuth` (extracts userId from cookie) on protected routes.

- Authorization / Ownership
  - Service + repository enforce owner scoping.
  - Reads/writes check `ownerId` in `BuyerRepository` (e.g., `findById`, `findMany`, `getHistory`, `update`, `delete`).

- Architecture
  - App Router (Next.js), SSR for list/detail pages; client components for forms, search, filters.
  - Repository pattern under `src/lib/db/repositories/*`.
  - Service layer in `src/services/*` encapsulates business logic and history tracking.
  - Middleware in `src/lib/validation/middleware.ts` (auth, validation, rate limiting, compose).

- UI
  - Tailwind CSS with high-contrast defaults (inputs are `bg-white text-gray-900`).
  - Forms: React Hook Form + Zod. Client-side UX improvements (debounced search/filters, URL sync, no scroll on replace).
  - History refetch: quick-status emits an event, history listens and refetches.


## What’s Done vs Skipped

Done
- Buyers CRUD with ownership checks and audit history (`buyer_history`).
- SSR list with filters, debounced search, URL state, sorting, pagination.
- Create/Edit forms with validation and clean UI components.
- CSV import/export with validation.
- Magic link auth (custom) with dev fallback and Resend integration for real emails.
- Rate limiting middleware for sensitive endpoints.
- Error boundary wrapper and consistent API error handling.

Nice-to-haves implemented
- Quick status actions with live history refresh.
- Tag input (chips) on buyers.

Pending / Skipped (and why)
- Comprehensive tests (unit/e2e): skipped for time.
- Advanced accessibility pass: basic semantics in place; deeper audit pending.
- Full-text search across all fields via DB index: current approach uses `contains` filters; FT index can be added later.
- Deployment config/guide: app is Vercel-ready; provide environment vars and database URL there.


## Common Commands

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Build
npm run build
```

## Notable Paths
- Pages: `src/app/buyers/*`
- API: `src/app/api/*`
- Services: `src/services/*`
- Repositories: `src/lib/db/repositories/*`
- Validation: `src/lib/validation/*`
- Auth helpers: `src/lib/auth.ts`
- Email: `src/lib/email.ts`
