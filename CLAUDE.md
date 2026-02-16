# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint
npx prisma db push   # Sync schema to SQLite (no migrations, dev only)
npx prisma generate  # Regenerate Prisma client after schema changes
npx prisma studio    # Browse DB in browser
```

No test framework is configured.

## Architecture

**Charity golf tournament platform** (Next.js 16, React 19, TypeScript) with registration, payments, live auction, and admin dashboard.

### Key Technical Decisions

- **Prisma v6** with SQLite (`dev.db`). Do NOT upgrade to Prisma v7 (breaking changes with `datasourceUrl`, `prisma.config.ts`).
- **NextAuth v5 beta** (`next-auth@5.0.0-beta.30`) with JWT-only strategy and Credentials provider. No Prisma adapter — `@auth/prisma-adapter` is installed but not used due to type conflicts.
- **Square SDK** for payment processing. CSP headers in `next.config.ts` whitelist Square CDN/iframe domains.
- **Zod v4** — import from `"zod/v4"`, use `z.email()` not `z.string().email()`.
- **Tailwind CSS v4** (CSS-first config via `@tailwindcss/postcss`). Custom theme colors defined as CSS variables in `globals.css` and mapped with `@theme inline`.

### Auth Flow

- `src/auth.ts` — NextAuth config (Credentials provider, JWT callbacks adding `id` and `role` to token/session)
- `src/types/next-auth.d.ts` — Module augmentation extending `Session`, `User`, `JWT` with `role` field
- `src/middleware.ts` — Protects `/admin/*` (requires admin role) and `/auction/*`, `/portal/*` (requires sign-in)

### Route Structure

| Route | Purpose |
|---|---|
| `/` | Static landing page (Hero, About, EventDetails, Challenges, WhatsIncluded, RegisterCTA, Charities, Venue, Contact sections) |
| `/auth/signin`, `/auth/signup` | Auth pages with server actions in `src/app/auth/actions.ts` |
| `/register/golfer` | Golfer registration with Square payment (individual $125 / team $500) — requires event access code |
| `/register/sponsor` | Sponsor registration by tier (platinum $5k to hole $250) — requires event access code |
| `/portal` | Player portal — view registrations, manage teams |
| `/portal/team/[registrationId]` | Captain team management — roster, join requests, captain transfer |
| `/portal/teams` | Browse open teams and request to join |
| `/auction` | Live auction listing, `/auction/[itemId]` for detail with real-time bidding |
| `/admin` | Dashboard with sidebar layout, sub-pages: registrations, sponsors, auction, users |

### Server Actions Pattern

Server actions live as `actions.ts` co-located with their route. They use Zod for validation, Prisma for DB, and return `{ data?, error? }` objects (not throwing).

- `src/app/register/golfer/actions.ts` — Golfer registration + Square payment + access code validation + auto-captain assignment
- `src/app/register/sponsor/actions.ts` — Sponsor registration + Square payment + access code validation
- `src/app/portal/actions.ts` — Player portal: registration lookup, team management, join requests, captain transfer
- `src/app/auction/actions.ts` — Bid placement (with `$transaction` for atomicity), item queries
- `src/app/admin/actions.ts` — Auction CRUD, user role management, dashboard stats (all guarded by `requireAdmin()`)

### Real-Time Auction

`src/lib/sse-manager.ts` — Singleton SSE manager (global-cached like Prisma/Square clients). Supports `broadcast()` to all connections and `notifyUser()` for outbid notifications. API endpoint at `/api/auction/events`.

### Shared Libs (`src/lib/`)

- `prisma.ts` — Singleton PrismaClient (global-cached for dev HMR)
- `square.ts` — Singleton SquareClient + `PRICES` constant + `formatCents()` helper
- `sponsor-tiers.ts` — `SPONSOR_TIERS` array with pricing/benefits, `getTierById()`
- `access-code.ts` — Validates event access code against `EVENT_ACCESS_CODE` env var (case-insensitive)
- `sse-manager.ts` — Real-time event broadcasting

### Monetary Values

All monetary amounts stored and transmitted in **cents** (integers). Use `formatCents()` from `src/lib/square.ts` for display.

### Environment Variables

- `DATABASE_URL` — SQLite connection string (e.g., `file:./dev.db`)
- `SQUARE_ACCESS_TOKEN` — Square API token (sandbox in dev, production in prod)
- `SQUARE_APPLICATION_ID` — Square app ID (used client-side in payment forms)
- `SQUARE_LOCATION_ID` — Square location ID
- `AUTH_SECRET` — NextAuth secret

### Access Codes

Event access code is stored in the `SiteSetting` table (key `EVENT_ACCESS_CODE`), managed via `/admin/settings`. Team captains also get auto-generated `TEAM-XXXX` invite codes stored on `GolferRegistration.inviteCode`. Both code types are validated in `src/lib/access-code.ts`.
