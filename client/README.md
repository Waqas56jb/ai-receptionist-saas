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

## Changing the brand

Everything brand-related lives in one file: [`src/config/brand.js`](src/config/brand.js) —
company name, social links, contact email and the copyright year. The placeholder name is
**Recepta**; replace it once the client provides the final name.

The logo mark is inline SVG in [`src/components/ui/Logo.jsx`](src/components/ui/Logo.jsx).
Swap that SVG (and `public/favicon.svg`) for the client's logo.

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
