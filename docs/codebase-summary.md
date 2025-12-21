# Codebase Summary - Admin Manga v3

**Last Updated**: 2025-12-21 | **Phase**: Phase 03 - Login Page UI

## Project Overview

Admin Manga v3 is a Nuxt 4 management application built with Vue 3, TypeScript, and Nuxt UI v4. It features a modern layout system, centralized authentication management, and a schema-driven form validation approach.

## Key Technical Specifications

- **Framework**: Nuxt 4 (using `app/` directory)
- **UI System**: Nuxt UI v4 (Tailwind CSS + Radix UI)
- **Language**: TypeScript (Strict mode)
- **Validation**: Zod
- **Testing**: Vitest + @nuxt/test-utils (Happy DOM environment)
- **Auth Strategy**: JWT with localStorage persistence and SSR-safe state

## Core Directory Structure

```
app/
├── app.vue                # Main entry point (NuxtLayout + NuxtPage)
├── app.config.ts         # Theme & UI configuration
├── assets/                # Global styles and static assets
├── components/           # Auto-imported Vue components
├── composables/          # Shared logic (useAuth, etc.)
├── layouts/              # UI wrappers (default, auth)
├── pages/                # Route-based components
├── plugins/              # Client/Server side plugins
└── utils/                # Helper functions (api client)

docs/                     # Project documentation
plans/                    # Planning and reports
vitest.config.ts          # Test configuration
```

## Recent Implementation: Phase 03 (Login Page UI)

### 1. Login Implementation (`app/pages/login.vue`)
- **Layout**: Uses `auth` layout (centered, minimal).
- **Form System**: Utilizes `<UForm>` with Zod schema validation.
- **Security**: Password fields and email validation enforced at the UI level.
- **Integration**: Directly calls `auth.login()` from the auth composable.
- **UX**: Includes loading states on the submit button.

### 2. Testing Suite (`app/pages/login.test.ts`)
- **Environment**: Configured with `@nuxt/test-utils` for Nuxt context.
- **Coverage**: Validates rendering, input handling, and validation logic.
- **Mocks**: Global stubs for `navigateTo` and `localStorage`.

### 3. Dependency Updates
- Added `zod` for schema validation.
- Added `vitest` and `@nuxt/test-utils` for the testing framework.
- Added `@vue/test-utils` and `happy-dom` for component testing.

## Standards & Patterns

- **Validation**: Always use Zod schemas for forms.
- **Testing**: New features should include unit tests adjacent to source files.
- **Auto-imports**: Leverage Nuxt 4's auto-importing for components and composables.
- **State**: Use `useState` for cross-component shared state to ensure SSR compatibility.

## Current Roadmap Status

- [x] Phase 01: API Setup & Runtime Config
- [x] Phase 02: Auth State & Composables
- [x] Phase 03: Login Page UI & Validation
- [x] Phase 05: Layout System Separation
- [ ] Phase 04: Admin Dashboard & Manga Management
- [ ] Phase 06: User Management
