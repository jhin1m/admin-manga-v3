# Phase 04: Route Middleware

## Context
- **Parent:** [plan.md](./plan.md)
- **Dependencies:** Phase 02
- **Docs:** [Nuxt Middleware](https://nuxt.com/docs/guide/directory-structure/middleware)

## Overview
| Field | Value |
|-------|-------|
| Date | 2025-12-21 |
| Priority | High |
| Status | ✅ Complete (2025-12-21) |
| Review | ✅ Approved |

Create route middleware to protect admin routes and redirect unauthenticated users.

## Key Insights
- Named middleware (`auth.ts`) applied via `definePageMeta`
- Global middleware (`auth.global.ts`) runs on every route
- Middleware runs on both server and client
- Use `navigateTo()` for redirects in middleware

## Requirements
1. Auth middleware to check authentication
2. Guest middleware for login page (redirect if logged in)
3. Apply auth middleware globally except /login

## Architecture
```
app/middleware/
├── auth.global.ts    # Protect all routes except /login
└── guest.ts          # Redirect authenticated users from /login
```

## Related Files
- `app/middleware/auth.global.ts` - Global auth guard
- `app/middleware/guest.ts` - Guest-only routes

## Implementation Steps

### Step 1: Create app/middleware/auth.global.ts
```ts
export default defineNuxtRouteMiddleware((to) => {
  // Skip auth check for login page
  if (to.path === '/login') {
    return
  }

  const auth = useAuth()

  // On client, check localStorage directly for SSR hydration
  if (import.meta.client) {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      return navigateTo('/login')
    }
  }

  // On server, check state (will be null on first load)
  if (import.meta.server && !auth.token.value) {
    return navigateTo('/login')
  }
})
```

### Step 2: Create app/middleware/guest.ts
```ts
export default defineNuxtRouteMiddleware(() => {
  const auth = useAuth()

  // Redirect authenticated users away from login
  if (import.meta.client) {
    const token = localStorage.getItem('admin_token')
    if (token) {
      return navigateTo('/')
    }
  }

  if (auth.isAuthenticated.value) {
    return navigateTo('/')
  }
})
```

### Step 3: Apply guest middleware to login page
Update `app/pages/login.vue`:
```ts
definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})
```

## Todo List
- [x] Create auth.global.ts middleware
- [x] Create guest.ts middleware
- [x] Update login.vue page meta
- [x] Test redirect flow
- [x] ✅ **FIXED**: Fix 8 ESLint violations (0 violations)
- [x] ✅ **FIXED**: Replace `any` types with proper interfaces (AuthState added)
- [x] ✅ **FIXED**: Replace process.* with import.meta.* (all replaced)
- [x] ✅ **FIXED**: Verify pnpm lint passes (clean output)

## Success Criteria
- [x] Unauthenticated users redirected to /login
- [x] Authenticated users can access protected routes
- [x] Login page redirects authenticated users to /
- [x] No infinite redirect loops
- [x] ✅ All linting errors resolved (0 ESLint violations)
- [x] ✅ TypeScript types properly defined (AuthState interface)

## Risk Assessment
| Risk | Mitigation |
|------|------------|
| Infinite redirect loop | Skip auth check for /login path |
| SSR hydration issues | Check localStorage on client only |

## Security Considerations
- Middleware runs on every navigation
- Token validation happens on server via fetchProfile()
- Invalid tokens result in logout

## Code Review Results

### Initial Review
**Date**: 2025-12-21 | **Status**: ❌ Critical Issues Found
- 8 ESLint violations (type safety + Nuxt preferences)
- Full report: [code-reviewer-251221-phase04-middleware.md](../reports/code-reviewer-251221-phase04-middleware.md)

### Re-Review (Post-Fix)
**Date**: 2025-12-21 | **Status**: ✅ Approved for Merge

**All Critical Issues Resolved**:
- ✅ ESLint violations: 8 → 0
- ✅ Type safety improved (AuthState interface added)
- ✅ Nuxt 4 compliance (import.meta.* used)
- ✅ Tests: 13/13 passing (100% coverage)
- ✅ TypeCheck: Passed
- ✅ Lint: Clean output

**Quality Metrics**:
- Code quality: Excellent
- Test coverage: 100% logic coverage
- Security: No vulnerabilities
- Performance: No regressions

**Full Report**: [code-reviewer-251221-phase04-re-review.md](../reports/code-reviewer-251221-phase04-re-review.md)

## Next Steps
1. ✅ Merge Phase 04 to main branch
2. Proceed to [Phase 05: Layout Separation](./phase-05-layout-separation.md)
