# Frontend Design Brainstorm — RayDex

A working template for exploring the look, feel, and layout of the app
before writing UI code. Fill this out (or copy it per screen) during design
sessions. Scope is limited to what's actually in the build plan — scanning,
search, shared dex, teams, PWA — so brainstorming stays grounded.

---

## 1. Mood & Identity

- **Vibe in 3 words:** ___________________________
- **Reference apps/aesthetics** (what feels right?):
  - [ ] Pokédex-style (retro, chunky, playful)
  - [ ] Modern card-collection app (clean grid, minimal chrome)
  - [ ] TCG marketplace (dense info, price/rarity forward)
  - [ ] Other: ___________________________
- **Light mode, dark mode, or both?**
- **Any existing brand elements to reuse/avoid from the old practice project?**

---

## 2. Core Screens to Design

For each, note layout ideas, key elements, and open questions.

### 🔐 Auth (Login / Sign Up)
- Layout idea:
- Key elements: email/password fields, team invite entry point, error states
- Open questions:

### 🧩 Team Creation / Join Flow
- Layout idea:
- Key elements: invite link/code display, "who's on this team" list, empty
  state for solo (no teammates yet)
- Open questions:

### 🗂️ Main Dex / Collection View
- Layout idea (grid vs. list, card density):
- Filter/toggle treatment for **Mine / Teammates' / Combined**:
- Sort & search bar placement:
- Card tile content: image, name, set, quantity, owner badge
- Empty state (no cards yet):
- Open questions:

### 📷 Scan Flow
- Layout idea (full-screen camera vs. modal):
- Camera viewfinder treatment (guide frame for card alignment?):
- Loading/processing state while OCR runs:
- Match-confirmation UI (top candidates, confidence indicator, "not it?"
  fallback to manual search):
- Success state (card added, animate into collection?):
- Open questions:

### 🔍 Manual Search (Fallback)
- Layout idea:
- Result list/grid treatment:
- How does this connect back into the "add to collection" flow?
- Open questions:

### 📊 Card Detail View
- What shows when a user taps a single card? (larger image, full card
  metadata, quantity stepper, who owns which copies)
- Open questions:

### ⚙️ Settings / Team Management
- Manage team membership, leave team, account settings
- Open questions:

---

## 3. Cross-Device Considerations

- **Phone (primary scanning device):**
  - Thumb-reachable nav (bottom tab bar vs. top nav)?
  - Camera permission prompt handling
  - Install-to-home-screen prompt — when/how is it surfaced?
- **Desktop/laptop (browsing + webcam scanning):**
  - Does layout shift to multi-column grid, sidebar nav?
  - Webcam scan entry point — same flow as phone, different framing?
- **Shared components across breakpoints:**
  - Which components need distinct mobile/desktop variants vs. simple
    responsive resize?

---

## 4. Component Inventory (Draft)

List UI components anticipated from the build plan — flesh out as design
progresses.

| Component | Screens used in | Notes |
|---|---|---|
| `DexGrid` | Main dex | |
| `CardTile` | Main dex, search results | |
| `CardScanner` | Scan flow | |
| `MatchCandidateList` | Scan flow | |
| `CardSearch` | Manual search | |
| `CardDetailModal` / page | Card detail | |
| `TeamInvite` | Team join/create | |
| `OwnerFilterToggle` | Main dex | Mine / Teammates' / Combined |
| `AuthForm` | Login/signup | |
| `BottomNav` / `SidebarNav` | Global | Responsive variants |

---

## 5. Motion & Feedback (Framer Motion)

- Where do transitions matter most? (scan result reveal, card added
  confirmation, filter switching)
- Loading states: skeleton screens vs. spinners vs. playful
  Pokémon-themed loaders?
- Micro-interactions worth prototyping early:

---

## 6. Open Questions / Parking Lot

Use this space for anything raised during brainstorming that doesn't fit
elsewhere yet.

- [ ]
- [ ]
- [ ]

---

## 7. Next Steps

- [ ] Turn agreed layouts into wireframes (low-fidelity)
- [ ] Pick a color palette + type scale
- [ ] Prototype the scan flow first (highest-risk/most novel screen)
- [ ] Validate mobile camera UX on a real device before finalizing layout
