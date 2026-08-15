# Admin — Super Admin + Sub-Admin Control Centre

Private administration console for the AI receptionist platform. Separate app from the
customer-facing site, served under `/admin`.

- Public website + business portal → [`../client`](../client)
- This app → the platform owner's control plane

## Stack

- React 18 + Vite (JavaScript, no TypeScript)
- React Router 6 (`basename="/admin"`)
- Tailwind CSS 3
- Framer Motion (drawer, modals, toasts)
- Recharts (analytics)
- Lucide React (every icon)

## Commands

```bash
npm install
npm run dev      # http://localhost:5174
npm run build    # production build → dist/
npm run preview  # serve that build at http://localhost:4173
```

## Deployment

The default build targets **its own host root** — a Vercel project domain, `admin.example.com`, or
any server where this app is the site. [`vercel.json`](vercel.json) sets the build command, the SPA
rewrite that keeps deep links working on refresh, and `X-Robots-Tag: noindex` so the console never
gets indexed.

On Vercel, create a separate project with **Root Directory = `admin`**; the config here does the
rest.

### Hosting it under a path instead

If the console has to live at `example.com/admin/` rather than its own domain:

```bash
npm run build:subpath     # sets base=/admin/
npm run preview:subpath   # preview it the same way
```

The router basename follows `import.meta.env.BASE_URL`, so routes become `/admin/dashboard`
automatically — the same source builds both, nothing to edit. That host then needs
`/admin/* → /admin/index.html` as its fallback.

**Asset URLs are baked in at build time**, so the build and the hosting path have to agree. A
subpath build served at a root (or the reverse) 404s on `assets/*.css`, `assets/*.js` and the logo.

## Signing in

Authentication is mocked — no password is checked and no token is stored, only a session marker
in `localStorage`.

**Signing in with a different admin's email adopts that admin's role**, which is the quickest way
to see RBAC working:

| Email | Role | What they see |
|---|---|---|
| `saqib@devmark.example.com` | Super Admin | Everything |
| `helene@devmark.example.com` | Operations Admin | Businesses, users, conversations, support |
| `tomas@devmark.example.com` | Billing Admin | Subscriptions, plans, payments, invoices |
| `amara@devmark.example.com` | Support Admin | Tickets, businesses, users |
| `jonas@devmark.example.com` | Analytics Admin | Reporting only |

## RBAC

[`src/config/permissions.js`](src/config/permissions.js) holds the catalogue: **9 groups,
45 permissions**, five role presets plus Custom Admin.

- `useAuth().can('businesses.suspend')` gates buttons and menu items.
- `RequirePermission` gates whole routes — a role without the permission gets an explanation, not a
  blank screen or a crash.
- Sidebar groups whose items the role cannot reach are removed entirely.
- The backend will enforce the same permission strings; the UI only decides what to show.

## Architecture

```
src/
  pages/          one folder per area (auth, dashboard, businesses, users, admins,
                  revenue, ai, comms, analytics, support, security, system, account)
  components/
    layout/       AdminLayout (collapsible sidebar + drawer), AdminHeader, AdminSidebar, PageHeader
    ui/           Button, Card, Field, Badge, Modal + ConfirmDialog, DataTable, FilterBar,
                  Skeleton, States (empty/error/no-permission), Misc (Tabs, Dropdown, Toggle,
                  Avatar, StatCard, ProgressBar, MaskedCredential)
    charts/       themed Recharts wrappers
    security/     PermissionMatrix
  services/       API-ready layer — pages never touch mock data directly
  data/mock/      the demo dataset (admins, businesses, users, revenue, comms, platform)
  hooks/          useAsync, useTable (filter/sort/paginate/select), useDebounced, useOnClickOutside
  context/        AuthContext (session + can()), ToastContext
  config/         permissions.js, navigation.js
```

### Connecting the backend

Every screen calls `src/services/*`, and every service goes through `request()` in
[`src/services/mockClient.js`](src/services/mockClient.js), which resolves mock data after a short
delay. Replace that one file with a real `fetch` wrapper and point each service method at its
endpoint — **no page component changes**.

### Tables

`useTable` + `DataTable` give every list the same behaviour: search, dropdown filters with
removable chips, sortable headers, pagination, bulk selection with confirmation, CSV export, and a
stacked-card layout below `md` so nothing overflows on a phone.

## Security by design

- **No credential is ever shown in full.** Twilio, Meta, Stripe and AI provider secrets appear only
  as masked previews (`AC••••••••7C41`) via `MaskedCredential`. Nothing is hard-coded and nothing is
  written to browser storage.
- **Destructive actions require confirmation**, and the most dangerous ones (delete a business,
  enable maintenance mode) require typing the resource name to unlock the button.
- **Suspending or blocking requires a reason**, which is written into the audit log.
- **Support access (impersonation) is UI only.** It requires a reason, shows a persistent banner,
  and records the session. It never bypasses authentication — real access will be granted by the
  backend against the admin's identity.
- **Every mutating service call writes an audit entry** (`writeAudit` in `services/store.js`), which
  is what the Audit Logs screen reads.

## Assets

Logos are imported from `src/assets/` rather than referenced by absolute path, so Vite rewrites
their URLs to match whichever base the app was built with. Do not reintroduce hard-coded
`/admin/...` image paths — they break the root-hosted build.
