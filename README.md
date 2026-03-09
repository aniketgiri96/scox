# SEOX Platform

SEOX is a multi-tenant SaaS platform for SEO + GEO audits, built with Next.js App Router, Supabase, Stripe, and Anthropic.

## Quick start

1. Copy `.env.example` to `.env.local` and fill values.
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev`
4. Apply Supabase migration in `supabase/migrations/`

## Main routes

- Landing: `/`
- Login: `/login`
- Signup: `/signup`
- Dashboard: `/dashboard`
- New audit: `/audit`
- Audit details: `/audit/[id]`
- History: `/history`
- Patterns: `/patterns`
- Settings: `/settings`

## API routes

- `POST /api/crawl`
- `POST /api/research`
- `POST /api/competitor`
- `POST /api/audit`
- `POST /api/report`
- `POST /api/webhooks/stripe`
