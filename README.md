# Agora SaaS (Next.js + MongoDB + Stripe)

Production-oriented SaaS baseline for legal users in LATAM + USA with ES/EN i18n, subscriptions, billing lifecycle, admin operations, and semi-automatic access provisioning.

## Architecture summary

- **Frontend**: Next.js App Router + TypeScript strict.
- **Backend**: Next.js Route Handlers (`app/api/**`) with domain services in `server/**`.
- **Database**: MongoDB + Mongoose models with indexes for performance and lifecycle queries.
- **Auth**: Email/password with bcrypt + signed httpOnly cookie sessions.
- **Billing**: Stripe checkout, cancellation, portal links, webhooks.
- **Emails**: Resend adapter (`lib/email.ts`) with provider abstraction for SendGrid swap.
- **Scheduler**: cron-compatible endpoint (`/api/scheduler/reminders`) for reminders/suspension + analytics snapshots.
- **Deployment**: Vercel-compatible (`vercel.json`, no serverful assumptions).

## Feature coverage

- Landing (hero/benefits/pricing/faq), terms, privacy.
- ES/EN language switcher component.
- Signup/login/logout + forgot/reset/change password.
- Stripe checkout + webhook sync + cancel + billing portal.
- User dashboard pages (overview, billing, access, security).
- Admin pages/APIs (users, credentials, notes, analytics).
- Provisioning workflow: draft -> admin approve/send -> suspension.
- Payment failure reminders day 1..4 and auto-suspend on day 5.

## Local setup

1. Install dependencies
   ```bash
   npm install
   ```
2. Copy env
   ```bash
   cp .env.example .env.local
   ```
3. Set env values in `.env.local`.
4. Run app
   ```bash
   npm run dev
   ```

## Commands

- `npm run dev` — local development
- `npm run lint` — linting
- `npm run typecheck` — TypeScript strict checks
- `npm test` — unit/integration tests (Vitest)
- `npm run build` — production build validation

## Stripe setup

1. Create products/plans in Stripe:
   - Basic monthly 32 USD
   - Pro monthly 64 USD
   - Basic annual with 20% discount (307.2 USD)
   - Pro annual with 20% discount (614.4 USD)
2. Store generated price IDs in:
   - `STRIPE_PRICE_BASIC_MONTHLY`
   - `STRIPE_PRICE_BASIC_ANNUAL`
   - `STRIPE_PRICE_PRO_MONTHLY`
   - `STRIPE_PRICE_PRO_ANNUAL`
3. Configure webhook endpoint:
   - URL: `https://your-domain/api/stripe/webhook`
   - Events:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`
     - `invoice.paid`
4. Put webhook signing secret into `STRIPE_WEBHOOK_SECRET`.

### Stripe local webhook testing

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
stripe trigger checkout.session.completed
```

## Resend setup

1. Create API key in Resend dashboard.
2. Set `RESEND_API_KEY` and verified sender in `RESEND_FROM_EMAIL`.
3. If switching provider, implement new adapter with `EmailProvider` interface in `lib/email.ts`.

## Scheduled jobs setup

- Endpoint: `POST /api/scheduler/reminders`
- Auth: `Authorization: Bearer $AUTH_SECRET`
- Suggested schedule: once daily.
- Vercel cron example is included in `vercel.json`.

## Deployment (Vercel)

1. Import repo in Vercel.
2. Configure all env vars from `.env.example`.
3. Ensure webhook endpoint and cron are configured.
4. Deploy from `dev`; promote to `production` after quality gates.

## Branch/release workflow

- Feature branches -> PR -> `dev`.
- CI must pass: lint, typecheck, test, build.
- `dev` validated -> promote/merge to `production`.

## PR quality gates

- CI workflow in `.github/workflows/ci.yml` enforces install, lint, typecheck, test, build.
- Required reviews + passing checks recommended in repo settings.

## Troubleshooting

- **Env validation error at startup**: ensure all required vars are present.
- **Stripe webhook signature errors**: verify `STRIPE_WEBHOOK_SECRET` and raw body forwarding.
- **No emails sent**: validate Resend API key and sender domain.
- **Scheduler 401**: include bearer token with `AUTH_SECRET`.
