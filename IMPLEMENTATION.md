# Implementation Guide

This document covers the architecture, dependencies, environment setup, and
build plan for RayDex. It's meant for contributors working on the codebase
— see `README.md` for the general project overview.

This is a from-scratch rebuild. No code is carried over from the earlier
practice project, only lessons learned from it.

---

## 🏗️ Architecture Overview

```
┌─────────────┐        ┌──────────────────┐        ┌───────────────┐
│  Phone / PC  │──scan─▶│  Next.js App      │◀─────▶│ MongoDB Atlas │
│   Browser    │        │  (App Router +    │        │ users/teams/  │
│  (PWA)       │◀──────│   API routes)      │        │ dexCards      │
└─────────────┘  view   └────────┬──────────┘        └───────────────┘
                                   │
                     ┌─────────────┼─────────────┐
                     ▼                            ▼
              ┌─────────────┐            ┌────────────────┐
              │  TCGdex API  │            │  Vercel Blob    │
              │ (card lookup)│            │ (card photos)   │
              └─────────────┘            └────────────────┘
```

**Scan flow:** capture image → Tesseract.js OCR extracts text client-side →
fuzzy match against TCGdex search results → user confirms candidate → card +
photo saved to MongoDB, scoped to the user's team.

**Collection scoping:** every card document is tagged with `userId` and
`teamId`. The dex UI filters to "Mine," "Teammates'," or "Combined."

**Why this stack:**
- **Better Auth** over Clerk/Auth.js — self-hosted in our own MongoDB (no
  external user database), free, and its organization primitive maps
  cleanly onto teams of any size.
- **TCGdex** over pokemontcg.io — free, no API key required, actively
  maintained, and multilingual.
- **Client-side OCR (Tesseract.js)** over a hosted vision model — keeps
  hosting cost at $0 and raw photos stay on-device until a match is
  confirmed. A hosted image-matching API (e.g. Ximilar) is a reasonable
  future upgrade if OCR accuracy proves insufficient.
- **PWA** over a native app — `getUserMedia()`/file-capture inputs work
  natively in mobile browsers, so a native app isn't required to scan cards
  on the go.

---

## 📦 Planned Dependencies

```bash
# Core
next@15 react react-dom typescript

# Auth
better-auth

# Database
mongodb

# Card data
@tcgdex/sdk

# Scanning
tesseract.js
react-webcam

# Storage
@vercel/blob

# UI / animation
framer-motion
tailwindcss

# PWA
next-pwa
```

*(Exact versions to be pinned in `package.json` once the project is
scaffolded — check each package's latest stable release at setup time.)*

---

## 🔐 Environment Variables

```env
# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority
MONGODB_DB=raydex

# Better Auth
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000

# Vercel Blob
BLOB_READ_WRITE_TOKEN=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🔁 CI/CD Pipeline

Continuous integration runs via **GitHub Actions**; continuous deployment
is handled by **Vercel's native Git integration**. This is also the layer
where we practice CI/CD hands-on before adding real feature code.

**CI (GitHub Actions)** — runs on every push and pull request:
- Install dependencies (`npm ci`)
- Lint (`eslint`)
- Type-check (`tsc --noEmit`)
- Run tests (once a test suite exists — see Phase 5)
- Build check (`next build`) to catch build-breaking errors before merge

Example workflow, `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit
      - run: npm run build
```

**CD (Vercel)**:
- Every push to a feature branch / open PR → Vercel builds a **preview
  deployment** with its own URL, so scanning/camera behavior can be tested
  on a real phone before merging.
- Merge to `main` → Vercel auto-deploys to **production**.
- Environment variables are configured once in the Vercel dashboard
  (Production, Preview, and Development scopes) so preview deployments have
  working MongoDB/Blob credentials.

**Branch protection:** require the CI workflow to pass before a PR can be
merged into `main`, so `main` always stays in a deployable state.

**Where this fits in the build plan:** set up in **Phase 0**, right after
the project is scaffolded and the Vercel project is linked — before any
feature work starts, so every subsequent phase is covered by automated
checks and gets a live preview URL per PR.

---

## 📁 Planned Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (dex)/
│   │   ├── page.tsx          # main collection view
│   │   └── scan/
│   │       └── page.tsx      # camera scan flow
│   ├── api/
│   │   ├── auth/[...all]/    # Better Auth handler
│   │   └── dex/
│   │       └── route.ts
│   └── layout.tsx
├── lib/
│   ├── mongodb.ts
│   ├── auth.ts                # Better Auth config
│   ├── tcgdex.ts               # TCGdex client wrapper
│   └── dex-types.ts
├── components/
│   ├── CardScanner.tsx
│   ├── CardSearch.tsx
│   ├── DexGrid.tsx
│   └── TeamInvite.tsx
└── public/
    ├── manifest.json
    └── icons/
```

---

## 🗺️ Build Plan

### Phase 0 — Project Setup
1. Scaffold a new Next.js (App Router, TypeScript, Tailwind) project.
2. Set up a MongoDB Atlas cluster and database.
3. Set up a Vercel project and link the repo for auto-deploys.
4. Add the CI/CD pipeline (`.github/workflows/ci.yml` + Vercel preview
   deployments, branch protection on `main`) — see **CI/CD Pipeline** above.
5. Add `.env.example` with all required variables.

### Phase 1 — Data Model & Auth
6. Design core MongoDB collections:
   - `users` (managed by Better Auth)
   - `teams` (shared collector group; invite code/link)
   - `dexCards` — `{ userId, teamId, cardId, quantity, imageUrl, source, addedAt }`
7. Install and configure Better Auth with the MongoDB adapter.
8. Build sign-up / login pages.
9. Build "create or join team" flow (invite link or code).

### Phase 2 — Core Dex CRUD (text-based, no scanning yet)
10. Integrate the TCGdex SDK for manual card search.
11. Build `/api/dex` routes (GET/POST/PATCH/DELETE), scoped by `teamId`
    instead of global.
12. Build the dex UI: search a card manually → add to collection → view
    combined list with "Mine / Teammates' / Combined" filters.
13. Add Framer Motion transitions for loading and result states.

### Phase 3 — Scanning
14. Build a camera capture component (`react-webcam` + `getUserMedia`),
    tested on both phone and desktop browsers.
15. Integrate Tesseract.js for client-side OCR on the captured frame.
16. Fuzzy-match OCR text output against TCGdex search results.
17. Build the confirm/correct UI: show top match candidates, let the user
    confirm or fall back to manual search.
18. On confirm, upload the card photo to Vercel Blob and save the card
    document.

### Phase 4 — PWA & Cross-Device Polish
19. Add `manifest.json`, icons, and a service worker (`next-pwa`) for
    install-to-home-screen support.
20. Verify camera permissions and OCR accuracy on real phone hardware
    (iOS Safari + Android Chrome) and a laptop webcam.
21. Add offline app-shell caching (collection view works without a live
    scan connection).

### Phase 5 — Refinement
22. Tune OCR confidence thresholds; add manual override everywhere
    confidence is low.
23. Add duplicate/quantity management (increment existing card vs. add new).
24. Add basic collection stats (total cards, per-owner breakdown, missing
    sets).
25. Add a test suite (unit tests for match/scoring logic, at minimum) and
    wire it into the CI workflow's test step.
26. Polish empty states, loading states, and error handling.
27. Deploy the final build to Vercel and invite collaborators.

---

## 📌 Non-Goals (v1)

- No public marketplace or discovery features — invite-only teams.
- No pricing/valuation tracking (may be a later addition via a pricing API).
- No native mobile app — the PWA covers on-the-go scanning.
- No AI-model-based visual card matching (CLIP/YOLO) — OCR + text match is
  sufficient at this scale and keeps hosting costs at $0.
