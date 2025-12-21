# Admin Login Implementation Plan

## Overview
Implement complete authentication system for admin manga panel with login page, auth state management, route protection, and API integration.

## Status
| Phase | Description | Status |
|-------|-------------|--------|
| 01 | Runtime Config & API Setup | ✅ Done |
| 02 | Auth Composable & State | ✅ Done |
| 03 | Login Page UI | ✅ Done |
| 04 | Route Middleware | ⏳ Pending |
| 05 | Layout Separation | ✅ Done |

## Tech Stack
- **Framework:** Nuxt 4 + Vue 3
- **UI:** Nuxt UI v4 (UForm, UInput, UButton, UCard)
- **State:** Composable with localStorage persistence
- **API:** $fetch with Bearer token auth

## API Reference
- **Base URL:** `http://127.0.0.1:8000/api/admin`
- **Login:** `POST /auth` → `{ email, password }` → `{ token, type }`
- **Profile:** `GET /auth` (Bearer token)
- **Logout:** `DELETE /auth` (Bearer token)

## Files to Create
```
app/
├── composables/
│   └── use-auth.ts           # Auth state & methods
├── middleware/
│   └── auth.ts               # Route protection
├── layouts/
│   ├── default.vue           # Admin layout (with header/footer)
│   └── auth.vue              # Auth layout (minimal)
├── pages/
│   └── login.vue             # Login page
└── utils/
    └── api.ts                # API client wrapper
```

## Implementation Phases
- [Phase 01: Runtime Config & API Setup](./phase-01-runtime-config-api-setup.md)
- [Phase 02: Auth Composable & State](./phase-02-auth-composable-state.md)
- [Phase 03: Login Page UI](./phase-03-login-page-ui.md)
- [Phase 04: Route Middleware](./phase-04-route-middleware.md)
- [Phase 05: Layout Separation](./phase-05-layout-separation.md)

## Success Criteria
- [x] Login form with validation (email format, required fields)
- [x] Token stored in localStorage, persists across refreshes
- [x] Protected routes redirect to /login when unauthenticated
- [x] Logout clears token and redirects to /login
- [x] Error messages display via toast
- [x] Loading states during API calls
