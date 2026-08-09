# 📇 RayDex

A digital dex for collectors. Scan your physical Pokémon cards with your
phone or webcam, auto-identify them, and build a shared collection you can
browse from any device — together with the people you collect with.

Built as a from-scratch redesign of an earlier proof of concept.

---

## ✨ Core Features

- **Shared collections** — create a team, invite collectors to join, and
  view a combined dex with per-owner attribution.
- **Camera-based scanning** — point your phone or laptop webcam at a card,
  and the app identifies it automatically.
- **Manual search fallback** — search by name or set when a scan doesn't
  produce a confident match.
- **Installable PWA** — add it to your phone's home screen and use it like a
  native app, no app store required.
- **Quantity tracking** — add or remove copies and track duplicates per
  owner.

---

## 🧱 Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) |
| Auth | Better Auth |
| Database | MongoDB Atlas |
| Card data source | TCGdex SDK |
| Image storage | Vercel Blob |
| OCR | Tesseract.js (client-side) |
| Animation | Framer Motion |
| Camera capture | `getUserMedia()` via `react-webcam` |
| PWA tooling | `next-pwa` |
| Hosting | Vercel |

For architecture details, environment setup, dependencies, and the full
build plan, see [`IMPLEMENTATION.md`](./IMPLEMENTATION.md).

---

## 🚀 Getting Started

```bash
git clone <this-repo>
cd RayDex
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000

See [`IMPLEMENTATION.md`](./IMPLEMENTATION.md) for the full environment
variable reference and setup details.

---

## 📄 License

TBD.
