# Saraswati Student Gallery (SSG)

> Multi-shop school e-commerce storefront for students in Nagaland & Northeast India.

Built with React 19 + Vite + TypeScript + Tailwind CSS v4.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | TypeScript type check |

## Project Structure

```
src/
├── api/          # Mock API layer (swap for real backend in Phase 2)
├── components/   # Reusable UI components
│   ├── common/   # Buttons, Cards, Chips, etc.
│   └── layout/   # Header, Footer, Nav
├── context/      # React Context (Shop, Cart, Toast)
├── hooks/        # Custom hooks (useWhatsApp, etc.)
├── mocks/        # Mock JSON data (products, schools, shops, categories)
├── pages/        # Page components (one per route)
├── styles/       # Design tokens CSS
└── types.ts      # TypeScript interfaces
```

## Phase 2: Backend

See `BACKEND_INTEGRATION.md` for the Claude Code handoff guide covering:
- Inventory deduction on order confirmation
- Offline order entry via admin
- Shop → Warehouse mapping
- Real-time stock sync

## Deploy

Deployed on Vercel. Configured via `vercel.json` with SPA rewrites for React Router.

## Tech Stack

- **React 19** + **Vite 6** + **TypeScript**
- **Tailwind CSS v4**
- **React Router v7**
- **Framer Motion** + **GSAP** (animations)
- **React Hook Form** + **Zod** (checkout validation)
- **Lucide React** (icons)
