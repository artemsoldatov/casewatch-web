# CaseWatch: reviewer console (web)

Next.js 16 frontend for the CaseWatch AML/KYC case queue. Server Components read the Laravel API with the analyst's session token, and analysts triage alerts, drill into the evidence, and record dispositions from there. Backend lives in the sibling api package.

The alert queue and case pages render on the server through the App Router and fetch through a typed API client, so there's no client-side data store to keep in sync. The risk breakdown streams in one card per factor and then a verdict, through a route handler emitting NDJSON; the provider behind it is offline and deterministic (see src/app/api/assessment/[id]/route.ts), and swapping in a real LLM doesn't touch the client at all.

Login and disposition run as Server Actions, so the session token lives in an httpOnly cookie and never touches client JS. Analysts can assign a case; clearing and escalating are lead-only, gated in the UI and enforced again by the API with a 403 if someone tries around it. A middleware guard keeps unauthenticated users on /login.

## Running it

Point it at a running API (api/ on http://127.0.0.1:8000):

```bash
pnpm install
cp .env.example .env      # API_URL=http://127.0.0.1:8000/api
pnpm dev                  # http://localhost:53200
```

Sign in with the seeded demo users (password: password): lead@casewatch.test can clear and escalate, analyst@casewatch.test cannot.

## Quality gates

```bash
pnpm lint         # eslint (next core-web-vitals + typescript)
pnpm type-check   # tsc --noEmit
pnpm test         # vitest (unit + component)
pnpm test:e2e     # playwright, runs against a fixture API, no backend needed
pnpm build        # production build
```

The e2e suite starts a small fixture API (e2e/mock-api.mjs) whose responses mirror the real endpoints, so it runs offline and deterministically in CI.
