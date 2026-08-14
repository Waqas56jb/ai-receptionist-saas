# Client — AI Receptionist SaaS

Two applications in one Vite build:

1. **Public marketing site** at `/`
2. **Business user portal** at `/app/*` — 30 screens, mock data, no backend yet

The Super Admin portal (`/admin/*`) is a later milestone and is **not** in this codebase.

## Stack

- React 18 + Vite (JavaScript, no TypeScript)
- React Router 6
- Tailwind CSS 3
- Framer Motion (reveals, drawers, modals, toasts)
- Recharts (dashboard and analytics charts)
- Lucide React (every icon)

## Commands

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # serve the production build
```

## Signing in

Authentication is mocked. `/login` is pre-filled and **any** credentials sign you in —
no password is checked and no token is stored, only a session flag in `localStorage`.
`/signup` creates an account and sends you through the five-step onboarding flow.

## Portal architecture

```
src/
  pages/            one file per screen (auth/, onboarding/, app/)
  components/
    landing/        marketing sections
    layout/         AppLayout, AppSidebar, AppHeader, MobileSidebar, PageHeader, AuthLayout
    ui/             Button, Card, Field, Select, Toggle, Tabs, Modal, Dropdown, DataTable,
                    Badge, Skeleton, EmptyState/ErrorState, ProgressBar, StatCard,
                    SecureCredentialInput, Avatar, PasswordStrength
    ai/             AIStatusCard, SourceSelector, ConfigModeDiagram, ChannelConfigCard,
                    MessagingAgentPage, AITestChat
    business/       BusinessHoursEditor, CrudList
    charts/         themed Recharts wrappers
    comms/          TranscriptViewer
  services/         API-ready layer — every screen calls these, never mock data directly
  data/mock/        the demo dataset (business, ai, communication, crm, insights, platform)
  context/          AuthContext, ToastContext
  hooks/            useAsync (loading/error/retry), useDebounced, useMediaQuery, useOnClickOutside
  config/           brand.js, navigation.js
```

### Swapping in the real backend

Every screen talks to `src/services/*`. Those services call `request()` in
[`src/services/mockClient.js`](src/services/mockClient.js), which simply resolves mock data after a
short delay. Replace that one file with a `fetch`/`axios` wrapper and point each service method at
its endpoint — **no page component needs to change**.

### Security note on credentials

Twilio and Meta secrets are never stored in this app. `SecureCredentialInput` sends the raw value
to the service call and immediately drops it from component state; afterwards only the masked
preview returned by the API is displayed (`sk_••••••••••8F21`). Nothing is written to
`localStorage`, environment variables or the bundle. The portal also surfaces Twilio's own advice
to prefer scoped API keys over the Account SID + Auth Token in production.

### Performance

The portal is lazy-loaded route by route, so a visitor on the marketing page never downloads the
dashboard, Recharts or the mock dataset.

## Brand

Company: **DEVMARK SOLUTION** — *Du Concept à la Réalité*.

Everything brand-related lives in one file: [`src/config/brand.js`](src/config/brand.js) —
name, tagline, logo paths, social links, contact email and the copyright year.

### Logo files in `public/`

| File | What it is | Used by |
|---|---|---|
| `logo.png` | **Original supplied artwork**, untouched (wordmark on a black plate) | reference only |
| `logo-mark.png` | Same wordmark with the black plate keyed out to transparency and the strapline removed | navbar, footer |
| `logo-icon.png` | 512×512 tile — the paper-plane symbol on brand black | favicon, app icon |
| `logo-icon-192.png` | 192×192 version of the same tile | PWA manifest |
| `logo-plane.png` | Transparent paper-plane symbol on its own | spare, for future use |

The derived files were generated from `logo.png` by keying out the pure-black backdrop
(alpha = brightest channel, then un-premultiplied so edges stay clean). The strapline is
dropped from `logo-mark.png` because it is white text and would vanish on light backgrounds —
it is rendered as live text in the footer instead. If the client supplies a vector/transparent
logo later, replace `logo-mark.png` and `logo-icon.png` and nothing else needs to change.

## Where the content lives

Repeated card content — problems, channels, industries, pricing plans, security items,
footer links, nav links — is data, not markup: [`src/data/landing.js`](src/data/landing.js).
Edit copy there and every section updates.

## Section order

`Navbar → Hero → TrustBar → Problem → Solution → KnowledgeBase → Channels → HowItWorks →
Industries → Multilingual → Availability → ProductPreview → Security → Pricing → FinalCTA → Footer`

Assembled in [`src/App.jsx`](src/App.jsx); one component per section in `src/components/`.

## Notes

- Industry photos are hot-linked from Unsplash. `src/components/ui/Img.jsx` falls back to a
  navy gradient if an image fails to load. Swap in the client's own photography when available.
- Pricing shows "Coming Soon" / "Talk to Sales" — no prices are invented.
- Dashboard and conversation UIs are **static mockups** with sample data, clearly labelled as such.
- `og:image` points at `public/og-cover.svg`. Replace with a 1200×630 PNG before launch —
  some social platforms do not render SVG previews.
- All animations respect `prefers-reduced-motion`.
