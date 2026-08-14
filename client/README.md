# Client — AI Receptionist SaaS (Landing Page)

Public marketing site for the AI receptionist platform. **Milestone 1 scope: landing page only** —
no backend, auth, dashboard, Stripe, Twilio or AI integration lives here yet.

## Stack

- React 18 + Vite (JavaScript, no TypeScript)
- Tailwind CSS 3
- Framer Motion (scroll reveals, hero animation)
- Lucide React (all icons)

## Commands

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # serve the production build
```

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
