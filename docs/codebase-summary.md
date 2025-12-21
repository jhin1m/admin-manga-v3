# Codebase Summary - Admin Manga v3

**Last Updated**: 2025-12-21 | **Phase**: Phase 01 - Runtime Config & API Setup

## Project Overview

Admin Manga v3 is a Nuxt 4 application for managing manga content. Built with Vue 3, TypeScript, and Nuxt UI v4 components (styled with Tailwind CSS). Follows Nuxt 4's `app/` directory structure.

**Stack**:
- Framework: Nuxt 4
- UI: Nuxt UI v4 (Radix UI + Tailwind CSS)
- Language: TypeScript
- Package Manager: pnpm
- Icons: Iconify (lucide, simple-icons)

---

## Directory Structure

```
app/
├── app.vue                 # Root app - delegates to NuxtLayout + NuxtPage
├── app.config.ts          # Theme config (colors: primary: green, neutral: slate)
├── layouts/               # Layout templates
│   ├── default.vue        # Admin layout (header/footer/logout)
│   └── auth.vue           # Auth layout (minimal - login page)
├── pages/                 # File-based routing
│   ├── index.vue          # Dashboard
│   └── login.vue          # Login page (auth layout)
├── components/            # Auto-imported Vue components
│   ├── AppLogo.vue        # Logo component
│   └── TemplateMenu.vue   # Menu component
├── composables/           # Auto-imported Vue composables
│   └── use-auth.ts        # Auth state management
├── assets/                # Static assets (CSS, images)
│   └── css/
│       └── main.css       # Global styles
└── utils/                 # Utility functions (auto-imported)
    └── api.ts             # API client & types (Phase 01)

docs/
├── codebase-summary.md      # This file
├── project-overview-pdr.md  # Project overview & requirements
├── code-standards.md        # Code style & patterns
├── system-architecture.md   # Architecture decisions
├── API_ADMIN_DOCUMENTATION.md # API endpoints reference

plans/
└── reports/               # Phase reports & planning docs
```

---

## Key Components & Composables

### Layouts

**default.vue** (Admin Layout)
- Uses UApp (main container)
- UHeader with logo, user name, color mode button, logout button
- UMain (content area)
- USeparator
- UFooter with copyright
- Consumes `useAuth()` composable

**auth.vue** (Auth Layout)
- Minimal UApp wrapper
- UMain with dark/light background
- Used for login page

### Composables

**use-auth.ts** (Auth Stub - Phase 05)
- State: `user`, `token`, `isLoading`
- Computed: `isAuthenticated`
- Methods: `logout()` (clears state, navigates to `/login`)
- Full implementation planned for Phase 02

### Utils

**api.ts** (API Client - Phase 01)
- `ApiResponse<T>` and `ApiError` interfaces
- `useApi()` factory function using `$fetch.create`
- Standardized error handling (logging `ApiError.message`)
- Config-driven `baseURL` via `runtimeConfig.public.apiBase`

**index.vue** (Dashboard)
- Default admin dashboard
- Uses `default` layout

**login.vue** (Login Page)
- Minimal stub (full implementation Phase 03)
- Uses `auth` layout via `definePageMeta({ layout: 'auth' })`
- Centered UCard with login form placeholder

### Components

**AppLogo.vue**
- SVG/image logo for navbar branding

**TemplateMenu.vue**
- Menu/navigation component

---

## Routing

File-based routing from `app/pages/`:

| Route | File | Layout |
|-------|------|--------|
| `/` | `pages/index.vue` | `default` |
| `/login` | `pages/login.vue` | `auth` |

---

## Architecture Patterns

### Layout System (Phase 05)
- Layouts in `app/layouts/` override default behavior
- Pages define layout via `definePageMeta({ layout: 'layout-name' })`
- App.vue delegates to `<NuxtLayout>` + `<NuxtPage />`
- Enables different layouts per route (auth flow vs admin flow)

### Auto-imports
- Vue composables (ref, computed, useState, navigateTo, etc.)
- Nuxt composables (useHead, useSeoMeta, useAuth, etc.)
- Components from `app/components/` (UButton, UCard, etc.)

### Auth Flow
- User state stored via `useAuth()` composable (Nuxt useState)
- Token stored in localStorage (client-side only)
- Logout clears state + redirects to `/login`
- Full auth (login/register/protection) planned for Phase 02-03

### Styling
- Tailwind CSS via Nuxt UI v4
- Theme colors: primary (green), neutral (slate)
- Dark mode support via Nuxt UI's color mode button
- Global styles in `app/assets/css/main.css`

---

## Development Workflow

### Installation
```bash
pnpm install
```

### Development Server
```bash
pnpm dev
# http://localhost:3000
```

### Build
```bash
pnpm build
pnpm preview
```

### Code Quality
```bash
pnpm typecheck  # TypeScript validation
pnpm lint       # ESLint (no trailing commas, 1TBS brace style)
```

---

## Configuration Files

**nuxt.config.ts**
- ESLint module with stylistic rules
- Route rules for prerendering
- Custom CSS imports
- Devtools enabled
- `runtimeConfig` with `public.apiBase` (Phase 01)

**app.config.ts**
- UI theme configuration
- Color palette definitions

**tsconfig.json**
- References Nuxt-generated types (`.nuxt/tsconfig.*.json`)

---

## Current Implementation Status

### Completed (Phase 01 & 05)
- Runtime Config & API Setup (Phase 01)
- Layout separation (default + auth) (Phase 05)
- App.vue simplified to use NuxtLayout
- Login page stub with auth layout
- useAuth() composable (state management stub)
- useApi() utility (API client wrapper)
- Component auto-imports working

### Planned
- **Phase 02**: Full auth composable (login/register/token management)
- **Phase 03**: Login page UI implementation
- **Phase 04**: Admin dashboard pages
- Future: API integration, permissions system, data management

---

## Dependencies Overview

**Production**:
- `nuxt` v4
- `@nuxt/ui` v4
- `tailwindcss`
- `@iconify-json/lucide`, `@iconify-json/simple-icons`
- `vue` v3

**Dev**:
- TypeScript
- ESLint with Nuxt stylistic rules
- Build tools (vite)

---

## Important Notes

1. **Always use pnpm** - Project configured with pnpm workspaces
2. **TypeScript preferred** - Use `<script setup lang="ts">` syntax
3. **No trailing commas** - ESLint enforces commaDangle: 'never'
4. **1TBS brace style** - ESLint enforces braceStyle: '1tbs'
5. **Auto-imports enabled** - Don't manually import Vue/Nuxt composables
6. **Language**: Vietnamese (html lang="vi" in app.vue)
7. **Dark mode ready** - Nuxt UI components support automatic theme switching

---

## Recent Changes

### Phase 01: Runtime Config & API Setup (2025-12-21)
- Added `runtimeConfig.public.apiBase` to `nuxt.config.ts`
- Created `app/utils/api.ts` with `ApiResponse`/`ApiError` types
- Implemented `useApi()` composable factory
- Added `NUXT_PUBLIC_API_BASE` support in `.env`

### Phase 05: Layout Separation (2025-12-21)
- Added `app/layouts/default.vue` - Admin layout with header/footer
- Added `app/layouts/auth.vue` - Minimal auth layout
- Modified `app/app.vue` - Simplified to use NuxtLayout delegation
- Added `app/composables/use-auth.ts` - Auth state stub
- Added `app/pages/login.vue` - Login page with auth layout

---

## Next Steps

1. Implement full auth composable (Phase 02)
2. Build login page UI (Phase 03)
3. Create admin dashboard (Phase 04)
4. Integrate backend API endpoints
5. Implement route protection/auth middleware
