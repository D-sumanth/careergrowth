# Career Growth Studio

Production-oriented full-stack Next.js application for a UK-based career consultant serving mostly Indian students and recent graduates in the UK.

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS 4
- PostgreSQL + Prisma ORM
- Custom JWT cookie auth with role-based access
- Stripe Checkout integration structure
- Transactional email abstraction with console, Resend, and SMTP paths
- Secure local upload adapter with room for S3-style replacement

## Roles

- Visitor / public user
- Registered student / client
- Consultant / coach
- Admin

## Included product areas

- Marketing site with homepage, about, services, workshops, pricing, testimonials, contact, resources, and policy pages
- Auth pages for sign in, sign up, forgot password, and reset password
- Student dashboard shell for bookings, reviews, documents, and settings
- Protected admin console shell for users, bookings, services, workshops, content, inquiries, reviews, payments, and settings
- API routes for auth, contact, newsletter, availability, bookings, resume reviews, Stripe checkout, Stripe webhook, uploads, and admin content feeds
- Prisma schema covering users, profiles, services, packages, bookings, workshops, inquiries, reviews, payments, invoices, testimonials, blog posts, FAQs, newsletter subscribers, notifications, settings, and audit logs
- Demo seed and mock-safe runtime fallbacks so the app can render locally before a live database is connected

## Local setup

1. Copy `.env.example` to `.env`.
2. Set `AUTH_SECRET` to a long random string.
3. For mock-first local development, leave `ENABLE_MOCK_MODE="true"`.
4. For PostgreSQL-backed development, set `DATABASE_URL` and switch `ENABLE_MOCK_MODE="false"`.
5. Install dependencies:

```bash
npm install
```

6. Generate Prisma client and run migrations when using PostgreSQL:

```bash
npm run prisma:generate
npm run prisma:migrate
```

7. Seed demo data:

```bash
npm run db:seed
```

8. Start the app:

```bash
npm run dev
```

## Demo accounts in mock mode

- Student: `student@example.com`
- Consultant: `coach@careergrowthstudio.co.uk`
- Admin: `admin@careergrowthstudio.co.uk`
- Password for all: `Password123!`

## Architecture notes

- `src/app`: App Router pages, route handlers, SEO routes, and protected areas
- `src/components`: UI primitives, layout, forms, and dashboard shell
- `src/lib/auth`: password hashing, JWT sessions, and user auth helpers
- `src/lib/validation`: Zod schemas for public and auth flows
- `src/lib/payments`: Stripe client and checkout session builder
- `src/lib/email`: transactional email provider abstraction
- `src/lib/storage`: upload restrictions and local file persistence
- `src/lib/data`: realistic content used by the public site and mock responses
- `prisma/schema.prisma`: primary relational data model
- `prisma/seed.ts`: demo seed content and users

## Booking and payment flow

1. User chooses a service or workshop.
2. Frontend requests availability from `/api/bookings/availability`.
3. Frontend creates a pending booking with `/api/bookings`.
4. Frontend creates a Stripe Checkout Session with `/api/stripe/checkout`.
5. User completes payment in Stripe Checkout.
6. Stripe webhook endpoint confirms payment and updates booking or workshop registration state.
7. Confirmation email, reminders, and add-to-calendar hooks run from the post-payment flow.

The sample code includes the structure and safe defaults for these steps. The final production wiring should add transactional DB writes, webhook signature verification, and atomic payment-state synchronization.

## Deployment

### Vercel

1. Create a PostgreSQL database.
2. Set all production environment variables in Vercel.
3. Run `npm run prisma:generate` during build.
4. Run migrations in CI or a release step with `npm run prisma:migrate`.
5. Configure the Stripe webhook endpoint to point at `/api/stripe/webhook`.
6. Switch `EMAIL_PROVIDER` from `console` to `resend` or `smtp`.
7. Replace the local upload adapter with cloud object storage for production.

### Production hardening checklist

- Move uploads to S3, R2, or another private object store
- Add CSRF tokens for mutation-heavy server action patterns if you expand beyond JSON APIs
- Persist reset tokens and email verification tokens in PostgreSQL
- Verify Stripe webhook signatures before changing payment state
- Add a real audit log writer for admin mutations
- Expand admin CRUD forms against Prisma-backed route handlers
- Connect calendar and meeting creation hooks to Google Calendar or Microsoft Graph
- Add structured logging and error monitoring

## Notes

- The app is intentionally runnable with mock mode enabled so the UI and flows can be explored before external systems are fully configured.
- Prisma validation may require downloading platform binaries on a fresh machine. If that step is blocked by your environment, rerun it in a network-enabled shell.
