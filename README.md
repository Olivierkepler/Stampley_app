This is **Stampley App** — a [Next.js](https://nextjs.org) (App Router) application for participant check-ins, voice/chat support, and admin-managed study keys and users. It was bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## What's in this project

The following is an explicit inventory of what exists in the repo today (routes, APIs, data layer, and supporting code).

### Tech stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** PostgreSQL via **Prisma 7** (`@prisma/client`, `@prisma/adapter-pg`, `pg`); connection URL configured in `prisma.config.ts` (Prisma 7 style)
- **Auth:** Auth.js / **NextAuth v5** (`next-auth` beta) with credentials-style flows; JWT callbacks carry `id` and `role`
- **AI / voice:** OpenAI (`openai` package) for chat completions; **ElevenLabs** React SDK for voice; optional TTS/voice API routes
- **UI / state:** `framer-motion`, `lucide-react`, `recharts` (charts in check-in metrics), `three` + `@types/three` (3D/visual effects such as the iridescent orb), `zustand` for check-in client state

### Database models (`prisma/schema.prisma`)

- **User** — email (unique), hashed password, **Role** (`ADMIN` | `PARTICIPANT`), optional unique **studyId** (participant key), relations to reflections, check-in submissions, and password-reset tokens
- **PasswordResetToken** — hashed token, expiry, tied to user (password reset flow)
- **StudyKey** — invitable study keys (e.g. `AIDES-…`), `isUsed`, optional `createdBy`
- **Reflection** — text content per user
- **CheckInSubmission** — persisted check-in payload: domain, subscale, distress/mood/energy, reflection, coping action, context tags (JSON), safety flags, consecutive high-distress metadata, timestamps

Migrations live under `prisma/migrations/`; `prisma/seed.ts` seeds the database when you run seed commands.

### Authentication, middleware, and access rules

- **NextAuth route:** `app/api/auth/[...nextauth]/route.ts`
- **Config:** `lib/auth.config.ts` — custom sign-in page `/login`, `authorized` callback gates **dashboard**, **check-in**, and **admin** areas; admin access allows `Role.ADMIN` or an email allowlist (`canAccessAdminRoutes`)
- **Session helpers:** `lib/auth.ts` exports `auth` for use in Server Components, actions, and API routes
- **Middleware:** `middleware.ts` runs Auth.js middleware for `/dashboard/*`, `/admin/*`, `/check-in`, and `/check-in/*` (participants must be logged in for check-in and dashboard; admin area redirects unauthenticated users to `/admin/login` and non-admins to `/dashboard`)
- **Type extensions:** `types/next-auth.d.ts` augments session/user with `id` and `role`

Set **`AUTH_SECRET`** in `.env` for production (see comment in `lib/auth.config.ts`).

### Participant-facing routes (`app/`)

| Area | Path(s) | Purpose |
|------|---------|---------|
| **Home** | `/` | Default Next.js landing placeholder (`app/page.tsx`) |
| **Auth (route group `(auth)`)** | `/login`, `/register`, `/forgot-password`, `/reset-password` | Sign-in, registration with study key, forgot/reset password UI and forms |
| **Dashboard** | `/dashboard` | Logged-in user dashboard shell (`layout.tsx`, `page.tsx`, `navbar.tsx`) |
| **Check-in wizard** | `/check-in`, `/check-in/daily-metrics`, … | Full multi-step check-in under `app/(checkin)/check-in/` (see [Check-in flow structure](#check-in-flow-structure) below) |
| **Legacy redirect** | `/checkin` | Redirects to `/check-in` (`app/checkin/page.tsx`) |
| **Misc** | `/maincheck-in` | Minimal placeholder page (`app/maincheck-in/page.tsx`) |

### Admin routes

| Path | Purpose |
|------|---------|
| `/admin/login` | Admin sign-in shell and form |
| `/admin/keys` | Generate and manage **StudyKey** records (server actions) |
| `/admin/users` | User management UI (add user collapsible, delete user button) |

Shared admin UI: `components/admin/admin-nav-links.tsx`. Dashboard nav: `components/dashboard/user-dashboard-nav.tsx`.

### Check-in implementation (high level)

Beyond the directory tree in [Check-in flow structure](#check-in-flow-structure), the check-in feature includes:

- **Layout & navigation:** `layout.tsx`, `StepSidebar`, `CollapsibleSidebar`, `StepDock`, `PageTransition`
- **State:** `hooks/useCheckInStore.ts` (Zustand), `CheckInUserScope.tsx` for scoping user context where needed
- **Step UIs:** Domain cards, **BioMonitor**, **glucometer**, **DailyWellnessRadar** (recharts), step-specific pages under `daily-metrics/`, `contextual-factors/`, `clinical-narrative/`, `weekly-domain/`
- **Stampley support (step 5):** `stampley-support/page.tsx`, `StampleySupportPage.tsx`, `VoiceController.tsx`, `CheckInResults.tsx`, `conversationStorage.ts` (local conversation persistence)
- **Voice / visuals:** `StampleyVoiceAgent.tsx`, `StampleyVoiceContainer.tsx`, `VoicePulseCircle.tsx`, `IridescentOrb.tsx`, hooks `useElevenLabs.ts`, `useAudioAnalyser.ts`
- **Prompts:** `lib/stampley-prompt.ts` — system prompt building from **PatientState** (used by `/api/chat`)
- **Legacy step URLs:** `step1`–`step5` pages under `check-in/` may still exist for compatibility; canonical paths are the named routes above. **`next.config.ts`** redirects old paths (e.g. `/check-in/step1` → `/check-in/daily-metrics`, and root shorthands like `/daily-metrics` → `/check-in/daily-metrics`).

### API routes (`app/api/`)

| Route | Role |
|-------|------|
| `auth/[...nextauth]/route.ts` | NextAuth handlers |
| `chat/route.ts` | OpenAI chat completions using `buildSystemPrompt` / normalized **PatientState** |
| `check-in/submit/route.ts` | POST authenticated check-in payload → **CheckInSubmission** in Prisma |
| `tts/route.ts` | POST: text (+ optional `voiceId`) → **ElevenLabs** text-to-speech, returns audio (requires `ELEVENLABS_API_KEY`) |
| `voice/route.ts` | POST: text (+ optional `voiceId`) → **ElevenLabs** TTS, returns `audio/mpeg` (same family of integration as `tts`) |
| `get-signed-url/route.ts` | GET: server-side call to ElevenLabs **ConvAI** `get-signed-url` for `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` (requires API key + agent id) |

### Server actions (`actions/`)

- **`register.ts`** — `registerWithKey`: validates **StudyKey**, creates **User** (participant), marks key used (transaction)
- **`password-reset.ts`** — forgot/reset password flow (tokens, email)
- **`users.ts`** — user administration helpers used by admin UI
- **`admin.ts`** — `generateStudyKey`, `deleteStudyKey`, etc., with `revalidatePath` for admin pages

### Shared libraries (`lib/`)

- **`prisma.ts`** — Prisma client singleton (with adapter as configured for Prisma 7)
- **`auth.ts` / `auth.config.ts`** — NextAuth app wiring and route protection rules
- **`mail.ts`** — sending email (e.g. password reset)
- **`password-reset-token.ts`**, **`password-reset-copy.ts`** — token hashing/validation and email copy
- **`app-url.ts`** — absolute app URL helpers for links in emails
- **`utils.ts`** — `cn()` helper for merging class names

### Root `components/` and `app/components/`

- **`components/ui/PropertyHero.tsx`** — reusable marketing/hero-style UI
- **`app/components/`** — older or alternate step implementations (`step.tsx`, `step1.tsx`–`step4.tsx`, `Step5.tsx`, `StepSidebar.tsx`, `BioMonitor.tsx`, `glucometer.tsx`, `StampleyChat.tsx`) that parallel the newer `(checkin)/check-in` tree; useful for reference or migration

### Public assets (`public/`)

Images and branding (e.g. `stampleyLogo.png`, `logotext.png`, `doctor.jpg`, `michelle.png`, and other assets). The `public/images/Untitled` entry may be an incomplete or placeholder filename — verify before shipping.

### Configuration and tooling

- **`next.config.ts`** — redirects for check-in canonical URLs (see above)
- **`middleware.ts`** — auth matcher for dashboard, admin, check-in
- **`eslint`** — `eslint.config` / Next ESLint config
- **`package.json` scripts** — `dev`, `build`, `start`, `lint`, `postinstall` runs `prisma generate`

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Check-in flow structure

The check-in wizard lives under the `(checkin)` route group. URL segment is `/check-in` (the group name is not part of the URL). Directory layout:

```
app/(checkin)/check-in/
├── layout.tsx              # Check-in layout: sidebar + main + dock
├── page.tsx                # Entry: /check-in (landing, "Initiate Synthesis")
├── constants/
│   └── navigation.ts       # STEPS (ids, labels, paths)
├── types/
│   └── index.ts            # Shared types for check-in
├── components/
│   ├── navigation/
│   │   ├── PageTransition.tsx   # Wrapper for step transitions
│   │   └── StepDock.tsx        # Bottom nav: Prev / Proceed
│   ├── sidebar/
│   │   ├── CollapsibleSidebar.tsx  # Wrapper + collapse state + toggle
│   │   └── StepSidebar.tsx         # Step list (compact when collapsed)
│   └── ui/
│       └── DomainCard.tsx   # UI card component
├── daily-metrics/
│   └── page.tsx            # Step 1: Distress & Affect
├── contextual-factors/
│   └── page.tsx            # Step 2: Context Tags
├── clinical-narrative/
│   └── page.tsx            # Step 3: Open Reflection
├── weekly-domain/
│   └── page.tsx            # Step 4: Domain Focus
└── stampley-support/
    └── page.tsx            # Step 5: Stampley Synthesis
```

Step flow (routes):

| Step | Label | Path |
|------|--------|------|
| 1 | Distress & Affect | `/check-in/daily-metrics` |
| 2 | Context Tags | `/check-in/contextual-factors` |
| 3 | Open Reflection | `/check-in/clinical-narrative` |
| 4 | Domain Focus | `/check-in/weekly-domain` |
| 5 | Stampley Synthesis | `/check-in/stampley-support` |

- **`/check-in`** — Entry page; “Initiate Synthesis” links to step 1. Legacy `/check-in/step1`…`step5` and root paths like `/daily-metrics` redirect to these routes via `next.config.ts`.

### Dependencies for check-in

Install these packages to run the `(checkin)/check-in` flow:

| Package | Use |
|--------|-----|
| `framer-motion` | Step transitions, sidebar collapse animation, dock animations |
| `lucide-react` | Icons (Check, PanelLeft, PanelLeftClose, ChevronRight, ChevronLeft, CheckCircle2, etc.) |

```bash
npm install framer-motion lucide-react
# or
yarn add framer-motion lucide-react
# or
pnpm add framer-motion lucide-react
```

The rest (Next.js, React, Tailwind) comes with the project.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
