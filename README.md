# Flunexia Web App

Production web client for **Flunexia** — the organizer–supplier platform for group trips, service requests, offers, and supplier trust management.

| | |
|---|---|
| **Staging (current)** | [https://staging.flunexia.fr](https://staging.flunexia.fr) |
| **Production (after testing)** | [https://flunexia.fr](https://flunexia.fr) |
| **Repository** | [github.com/nizam-app/fluide_web_app](https://github.com/nizam-app/fluide_web_app) |
| **API** | [https://api.flunexia.fr/api/v1](https://api.flunexia.fr/api/v1) |
| **Stack** | React 19 · Vite 8 · Chakra UI v3 · React Router 7 |

---

## Table of contents

- [Overview](#overview)
- [Features by role](#features-by-role)
- [Tech stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [npm scripts](#npm-scripts)
- [Application routes](#application-routes)
- [Project structure](#project-structure)
- [Production deployment (Vercel)](#production-deployment-vercel)
- [Connecting to the API](#connecting-to-the-api)
- [Demo accounts](#demo-accounts)
- [Build & quality](#build--quality)
- [Troubleshooting](#troubleshooting)
- [Related repositories](#related-repositories)

---

## Overview

Single-page application (SPA) with role-based portals:

- **Organizers** — create trips, open service requests, compare offers, view supplier trust profiles
- **Suppliers** — browse opportunities, submit proposals with optional quote attachments, manage billing and documents
- **Admins** — user management, supplier approval, document review, platform overview

The app is a **Progressive Web App** (vite-plugin-pwa) and talks to the Flunexia REST API over HTTPS.

---

## Features by role

### Organizer
- **Create Trip** with Step 1 service builder (Transfer, Hotel, Restaurant, Equipment) matching the product wireframe
- Trip detail: requests, offers, messaging, accept/reject offers
- Supplier trust preview on offer rows; full profile at `/providers/:id`
- Favorites; notifications

### Supplier
- Dashboard, trips, and requests relevant to approved service types
- Submit proposals with price, message, and **optional quote attachment** (PDF/image)
- Profile: services, billing (SIRET, IBAN, Chorus Pro), **trust document** upload
- Avatar upload

### Admin
- Dashboard with users, trips, requests, activity
- Suspend / activate users; approve pending supplier services
- **Edit supplier** modal (profile, billing, document approve/reject)
- Read-only supplier profile with all document statuses

---

## Tech stack

| Layer | Choice |
|-------|--------|
| UI framework | React 19 |
| Build | Vite 8 |
| Components | Chakra UI 3 |
| Routing | React Router 7 (data router) |
| Styling | Chakra tokens + custom Fluide theme |
| HTTP | `fetch` via `src/lib/api.js` |
| PWA | vite-plugin-pwa |
| Auth storage | `localStorage` (JWT + cached user) |

---

## Prerequisites

- **Node.js** ≥ 20 (recommended)
- **npm**
- Running Flunexia API (local or remote) with CORS allowing your dev origin

---

## Quick start

```bash
git clone https://github.com/nizam-app/fluide_web_app.git
cd fluide_web_app
npm ci
cp .env.example .env   # or create .env manually — see below
npm run dev
```

Open **http://localhost:5173**

### Minimal `.env`

```env
# Local API
VITE_API_URL=http://localhost:5000/api/v1

# Or point at production (ensure CORS allows localhost)
# VITE_API_URL=https://api.flunexia.fr/api/v1
```

> Vite only exposes variables prefixed with `VITE_`. Rebuild/restart dev server after changing `.env`.

---

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | **Yes** | API base URL including `/api/v1`, no trailing slash |

### Vercel (production)

Set in **Project → Settings → Environment Variables**:

```
VITE_API_URL=https://api.flunexia.fr/api/v1
```

Set on your staging/production host. Redeploy after changing env vars (Vite bakes them in at build time).

---

## npm scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Development server with HMR |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Serve `dist/` locally |
| `npm run lint` | ESLint |
| `npm run stitch:fetch` | Fetch Stitch design assets (optional) |

---

## Application routes

| Path | Access | Description |
|------|--------|-------------|
| `/` | Public | Marketing home |
| `/login` | Public | Login / register |
| `/contact` | Public | Contact form |
| `/dashboard` | Authenticated | Role dashboard |
| `/create-trip` | Organizer | Create trip (Step 1 service plan) |
| `/trips` | Organizer, Supplier | Trip list |
| `/trips/:tripId` | Organizer, Supplier | Trip detail, offers, requests |
| `/requests` | Organizer, Supplier | Requests list |
| `/favorites` | Organizer | Favorite suppliers |
| `/providers/:providerId` | Organizer, Admin | Supplier trust profile |
| `/profile` | Authenticated | Account & billing & documents |
| `/admin` | Admin | Admin dashboard |
| `/admin/trips` | Admin | All trips |
| `/admin/requests` | Admin | All requests |

Route guards live in `src/lib/roles.js` and `PortalShell`.

---

## Project structure

```
src/
├── appRouter.jsx          # Route definitions
├── main.jsx               # Entry + providers
├── context/
│   └── AuthContext.jsx    # Session, login, profile updates
├── pages/                 # Screen-level components
│   ├── CreateTripPage.jsx
│   ├── TripDetailPage.jsx
│   ├── ProviderProfilePage.jsx
│   ├── AdminDashboardPage.jsx
│   └── ...
├── components/
│   ├── atoms/
│   ├── molecules/         # TripServiceNeedsBuilder, OfferRow, etc.
│   └── templates/         # PortalShell
├── lib/
│   ├── api.js             # API client
│   ├── authStorage.js
│   ├── needTypes.js       # UI ↔ API need type mapping
│   ├── servicePlan.js     # Step 1 trip service details
│   └── format.js
├── theme/
│   └── fluide-theme.js
└── data/
    └── mockData.js        # Nav items, option lists
public/                    # Static assets, PWA icons
vercel.json                # SPA rewrites for Vercel
```

---

## Production deployment (Vercel)

1. Import the GitHub repository in [Vercel](https://vercel.com)
2. Framework preset: **Vite**
3. Build command: `npm run build`
4. Output directory: `dist`
5. Set `VITE_API_URL` for Production (and Preview if needed)
6. Deploy

CLI deploy from project root:

```bash
npx vercel --prod
```

`vercel.json` configures SPA fallback so client-side routes work:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## Connecting to the API

The API client (`src/lib/api.js`) reads `VITE_API_URL` and sends:

```http
Authorization: Bearer <token>
```

on authenticated requests. On `401`, the session is cleared and the user is prompted to log in again.

**CORS:** the backend `CLIENT_ORIGIN` must include:

- `http://localhost:5173` (local dev)
- `https://staging.flunexia.fr` (staging — current)
- `https://flunexia.fr` and `https://www.flunexia.fr` (production — after testing)

---

## Demo accounts

Available when the API is seeded (see backend README):

| Role | Email | Password |
|------|--------|----------|
| Admin | `admin@flunexia.org` | `demo123` |
| Organizer | `organizer@flunexia.org` | `demo123` |
| Supplier | `supplier@flunexia.org` | `demo123` |

Use only in demo/staging environments.

---

## Build & quality

```bash
npm run lint
npm run build
```

Production assets are emitted to `dist/`. The service worker is generated by `vite-plugin-pwa` for offline shell caching.

---

## Troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| Network error on login | `VITE_API_URL` empty or wrong; rebuild on Vercel |
| CORS blocked | Backend `CLIENT_ORIGIN` missing your URL |
| Blank page after refresh on `/trips/...` | Hosting missing SPA rewrite (use `vercel.json`) |
| Old UI after deploy | Hard refresh (`Ctrl+Shift+R`) or clear PWA cache |
| Features 404 (documents, attachments) | Backend not deployed to latest version |

---

## Related repositories

- **API / Backend:** [github.com/nizam-app/fluenixa_backend](https://github.com/nizam-app/fluenixa_backend)  
- Deploy backend before relying on new API features in this app.

---

## License

Private — proprietary to Flunexia / project owner unless otherwise agreed in contract.
