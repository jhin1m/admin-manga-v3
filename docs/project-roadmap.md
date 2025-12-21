# Admin Manga v3 - Project Roadmap

## Project Summary
Modern admin manga management application built with Nuxt 4, Vue 3, and Nuxt UI v4. Provides authentication, manga CRUD operations, and admin dashboard capabilities.

**Last Updated:** 2025-12-21
**Overall Progress:** 75% (Phase 01, 02, 03, 05 Complete)

---

## Phase Overview

| Phase | Component | Status | Progress | Target Date |
|-------|-----------|--------|----------|------------|
| Phase 01 | Runtime Config & API Setup | ✅ Done | 100% | 2025-12-21 |
| Phase 02 | Auth Composable & State | ✅ Done | 100% | 2025-12-21 |
| Phase 03 | Login Page UI | ✅ Done | 100% | 2025-12-21 |
| Phase 04 | Route Middleware | ⏳ Pending | 0% | 2025-12-25 |
| Phase 05 | Layout Separation | ✅ Done | 100% | 2025-12-21 |

---

## Detailed Phase Breakdown

### Phase 01: Runtime Config & API Setup ✅ COMPLETE
**Status:** ✅ Done (2025-12-21)
**Review:** ✅ Approved
**Completion:** 100%

**Objectives Completed:**
- Configured `runtimeConfig` in `nuxt.config.ts` for API base URL
- Created `app/utils/api.ts` with TypeScript interfaces for API responses
- Implemented `useApi()` utility with `$fetch.create` factory
- Added `.env` support for `NUXT_PUBLIC_API_BASE`
- Standardized error handling for API responses

**Files Implemented:**
- `nuxt.config.ts` - Runtime config setup
- `app/utils/api.ts` - API client and types
- `.env` - Environment variables

**Test Results:** All tests passed, 0 lint/TS errors

---

### Phase 02: Auth Composable & State ✅ COMPLETE
**Status:** ✅ Done (2025-12-21)
**Review:** ✅ Approved
**Completion:** 100%

**Objectives Completed:**
- Created `app/composables/use-auth.ts` for auth state management
- Implemented `login`, `logout`, `fetchProfile` methods
- Added token persistence in `localStorage`
- Created `app/plugins/auth.client.ts` for state restoration on hydration
- Integrated `useToast()` for user notifications

**Files Implemented:**
- `app/composables/use-auth.ts`
- `app/plugins/auth.client.ts`

**Test Results:** All tests passed

---

### Phase 03: Login Page UI ✅ COMPLETE
**Status:** ✅ Done (2025-12-21)
**Review:** ✅ Approved (w/ minor recommendations)
**Completion:** 100%

**Objectives Completed:**
- Implemented `app/pages/login.vue` using Nuxt UI v4
- Added Zod-based form validation
- Integrated with `useAuth().login()` flow
- Implemented loading states and error handling
- Configured auth layout for login page

**Files Implemented:**
- `app/pages/login.vue`

**Test Results:** All tests passed

---

### Phase 05: Layout Separation ✅ COMPLETE
**Status:** ✅ Done (2025-12-21 21:12:00)
**Review:** ✅ Reviewed (0 critical issues)
**Completion:** 100%

**Objectives Completed:**
- Created `app/layouts/default.vue` - admin layout with header, sidebar, footer
- Created `app/layouts/auth.vue` - minimal layout for authentication
- Simplified `app.app.vue` to NuxtLayout wrapper
- Added logout button with icon to header
- Implemented user display in header
- Color mode toggle integrated

**Files Implemented:**
- `/app/layouts/default.vue` - Admin layout component
- `/app/layouts/auth.vue` - Auth layout component
- `/app/app.vue` - Simplified root component
- `/app/composables/use-auth.ts` - Auth composable stub
- `/app/pages/login.vue` - Login page stub

**Test Results:** All tests passed
**Code Review:** 0 critical issues, approved

**Key Features:**
- Layout separation allows different page styling
- Admin pages inherit default layout with full chrome
- Auth pages (login) use minimal layout
- User context accessible throughout admin section
- Dark mode support maintained

---

## Implementation Plan Status

**Plan File:** `plans/251221-2112-admin-login/plan.md`

### Success Criteria (Project Level)
- [x] Login form with validation (email format, required fields)
- [x] Token stored in localStorage, persists across refreshes
- [ ] Protected routes redirect to /login when unauthenticated
- [ ] Logout clears token and redirects to /login
- [x] Error messages display via toast
- [x] Loading states during API calls

### Tech Stack
- **Framework:** Nuxt 4 + Vue 3 (TypeScript)
- **UI:** Nuxt UI v4 (Components: UForm, UInput, UButton, UCard, UApp, UHeader, UMain, UFooter)
- **State Management:** Composable with localStorage persistence
- **API Integration:** $fetch with Bearer token authentication
- **Styling:** Tailwind CSS via Nuxt UI

### API Reference
- **Base URL:** `http://127.0.0.1:8000/api/admin`
- **Login:** `POST /auth` - Body: `{ email, password }` - Returns: `{ token, type }`
- **Profile:** `GET /auth` - Headers: `Authorization: Bearer {token}`
- **Logout:** `DELETE /auth` - Headers: `Authorization: Bearer {token}`

---

## Pending Phases

### Phase 01: Runtime Config & API Setup
**Target:** 2025-12-22
**Scope:** Environment configuration, API client setup, runtime config integration

**Files to Create:**
- `nuxt.config.ts` - Runtime config for API base URL
- `app/utils/api.ts` - API client wrapper with error handling

**Acceptance Criteria:**
- Runtime config accessible via `useRuntimeConfig()`
- $fetch wrapper handles Bearer token injection
- Error response handling standardized

---

### Phase 02: Auth Composable & State
**Target:** 2025-12-23
**Scope:** Authentication state management, localStorage persistence, composable API

**Files to Create:**
- `app/composables/use-auth.ts` - Full implementation (currently stub)

**Acceptance Criteria:**
- `useAuth()` provides: `user`, `token`, `isAuthenticated`, `login()`, `logout()`, `checkAuth()`
- Token persists in localStorage
- User info retrieved from profile endpoint
- Composable reactive to state changes

---

### Phase 03: Login Page UI
**Target:** 2025-12-24
**Scope:** Login form component with validation

**Files to Update:**
- `app/pages/login.vue` - Full implementation (currently stub)

**Acceptance Criteria:**
- Form with email and password fields
- Client-side validation (email format, required fields)
- Loading state during submission
- Error message display
- Redirect to home on successful login

---

### Phase 04: Route Middleware
**Target:** 2025-12-25
**Scope:** Route protection and authentication guards

**Files to Create:**
- `app/middleware/auth.ts` - Route protection middleware

**Acceptance Criteria:**
- Protected routes require authentication
- Unauthenticated users redirected to /login
- Login page accessible without authentication
- Logout functionality properly clears session

---

## Changelog

### Version 1.0.0-alpha.2 (2025-12-21)
- **Phase 01: Runtime Config & API Setup** - COMPLETE
  - Configured Nuxt runtime config for API base URL
  - Created typed API response/error interfaces
  - Implemented `useApi()` utility with `$fetch.create`
  - Added `NUXT_PUBLIC_API_BASE` environment variable support
  - Standardized error logging for API responses

### Version 1.0.0-alpha.1 (2025-12-21)
- **Phase 05: Layout Separation** - COMPLETE
  - Separated admin layout from auth layout
  - Created `app/layouts/default.vue` with header, main, footer structure
  - Created `app/layouts/auth.vue` minimal layout
  - Simplified `app.vue` to NuxtLayout wrapper
  - Added logout button to header with user display
  - All tests passed, code reviewed (0 critical issues)

---

## Risk Assessment

| Risk | Severity | Impact | Mitigation | Status |
|------|----------|--------|-----------|--------|
| Layout flash on navigation | Low | UX degradation | Nuxt handles transitions | ✅ Mitigated |
| Auth token expiration | Medium | Session loss | Implement refresh token flow | ⏳ Pending |
| Cross-site request forgery | Medium | Security | CSRF token in headers | ⏳ Pending |
| Password strength validation | Low | Security | Client + server validation | ⏳ Pending |

---

## Dependencies & Blockers

### External Dependencies
- **Nuxt 4 Layouts API** - ✅ Available
- **Backend API** - Running on `http://127.0.0.1:8000/api/admin` - ✅ Available

### No Current Blockers
All prerequisites met to proceed with remaining phases.

---

## Next Steps (Priority Order)

1. **Phase 01: Runtime Config & API Setup** (2025-12-22)
   - Set up environment variables for API base URL
   - Create API client wrapper with error handling

2. **Phase 02: Auth Composable & State** (2025-12-23)
   - Implement full auth composable with localStorage persistence
   - Add user profile retrieval

3. **Phase 03: Login Page UI** (2025-12-24)
   - Build login form with Nuxt UI components
   - Implement client-side validation
   - Add loading and error states

4. **Phase 04: Route Middleware** (2025-12-25)
   - Create route protection middleware
   - Implement auth guards for protected routes
   - Test complete auth flow

---

## File Structure
```
admin-manga-v3/
├── docs/
│   ├── project-roadmap.md          # This file
│   ├── API_ADMIN_DOCUMENTATION.md  # API reference
│   └── ...
├── plans/
│   └── 251221-2112-admin-login/
│       ├── plan.md                 # Main plan
│       ├── phase-01-runtime-config-api-setup.md
│       ├── phase-02-auth-composable-state.md
│       ├── phase-03-login-page-ui.md
│       ├── phase-04-route-middleware.md
│       └── phase-05-layout-separation.md ✅ COMPLETE
└── app/
    ├── app.vue                     # Root component (simplified)
    ├── app.config.ts               # App configuration
    ├── nuxt.config.ts              # Nuxt configuration
    ├── layouts/
    │   ├── default.vue             # ✅ Admin layout
    │   └── auth.vue                # ✅ Auth layout
    ├── pages/
    │   ├── index.vue               # Dashboard (stub)
    │   └── login.vue               # ✅ Login page (stub)
    ├── components/
    │   ├── AppLogo.vue             # Logo component
    │   └── ...
    ├── composables/
    │   └── use-auth.ts             # ✅ Auth composable (stub)
    ├── middleware/
    │   └── auth.ts                 # ⏳ Route protection (pending)
    └── utils/
        └── api.ts                  # ✅ API client & types
```

---

## Success Metrics

### Quality Gates
- ✅ Code review: 0 critical issues (Phase 05)
- ⏳ Test coverage: Target 80%
- ⏳ Performance: API response time < 500ms
- ⏳ Security: All OWASP Top 10 mitigations implemented

### Delivery Metrics
- ✅ Phase 05 completed on schedule
- ⏳ Overall project: 20% complete (1/5 phases)
- ⏳ Estimated completion: 2025-12-25 (remaining phases)

---

## Team & Responsibilities

| Role | Responsibilities |
|------|-----------------|
| Project Manager | Planning, status tracking, roadmap maintenance |
| Backend Developer | API implementation, authentication endpoints |
| Frontend Developer | UI components, composables, page implementation |
| QA/Tester | Test planning, validation, bug reporting |
| Code Reviewer | Code quality, security, standards compliance |

---

## Contact & Escalation

For blockers, risks, or questions:
- Review implementation plans in `plans/251221-2112-admin-login/`
- Check API documentation in `docs/API_ADMIN_DOCUMENTATION.md`
- Reference code standards in `docs/code-standards.md`
