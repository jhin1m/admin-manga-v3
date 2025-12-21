# Codebase Summary - Admin Manga v3

**Last Updated**: 2025-12-21 | **Phase**: Phase 04 - Route Middleware

## Project Overview

Admin Manga v3 is a Nuxt 4 management application built with Vue 3, TypeScript, and Nuxt UI v4. It features a modern layout system, centralized authentication management, and a schema-driven form validation approach.

## Key Technical Specifications

- **Framework**: Nuxt 4 (using `app/` directory)
- **UI System**: Nuxt UI v4 (Tailwind CSS + Radix UI)
- **Language**: TypeScript (Strict mode)
- **Validation**: Zod
- **Testing**: Vitest + @nuxt/test-utils (Happy DOM environment)
- **Auth Strategy**: JWT with localStorage persistence and SSR-safe state
- **Route Protection**: Global auth middleware with hydration safety

## Core Directory Structure

```
app/
├── app.vue                # Main entry point (NuxtLayout + NuxtPage)
├── app.config.ts         # Theme & UI configuration
├── assets/                # Global styles and static assets
├── components/           # Auto-imported Vue components
├── composables/          # Shared logic (useAuth, etc.)
├── layouts/              # UI wrappers (default, auth)
├── middleware/           # Route guards (auth.global, guest)
├── pages/                # Route-based components
├── plugins/              # Client/Server side plugins
└── utils/                # Helper functions (api client)

docs/                     # Project documentation
plans/                    # Planning and reports
vitest.config.ts          # Test configuration
```

## Recent Implementation: Phase 04 (Route Middleware)

### 1. Global Authentication Guard (`app/middleware/auth.global.ts`)
- **Behavior**: Protects all routes except `/login`.
- **SSR Safety**: Uses a dual-check strategy. On the client, it checks `localStorage` directly to prevent flashes during hydration. On the server, it checks the reactive state.
- **Redirection**: Automatically sends unauthenticated users to `/login`.

### 2. Guest Guard (`app/middleware/guest.ts`)
- **Behavior**: Prevents authenticated users from accessing the login page.
- **Redirection**: Sends users back to the dashboard if a token is detected.

### 3. Middleware Testing (`app/middleware/middleware.test.ts`)
- **Strategy**: Unit tests middleware logic by exporting pure functions.
- **Coverage**: Achieved 100% code coverage for auth and guest logic.

## Standards & Patterns

- **Middleware**: Use `.global.ts` suffix for middleware that should apply to all routes.
- **Validation**: Always use Zod schemas for forms.
- **Testing**: New features must include unit tests. Logic should be separated from Nuxt-specific globals for easier testing.
- **Auto-imports**: Leverage Nuxt 4's auto-importing for components and composables.
- **State**: Use `useState` for cross-component shared state to ensure SSR compatibility.

## Current Roadmap Status

- [x] Phase 01: API Setup & Runtime Config
- [x] Phase 02: Auth State & Composables
- [x] Phase 03: Login Page UI & Validation
- [x] Phase 04: Route Middleware & Global Guards
- [x] Phase 05: Layout System Separation
- [ ] Phase 06: Admin Dashboard & Manga Management
