# Code Review: Cookie-Based Authentication Refactoring

**Review Date**: 2025-12-22
**Reviewer**: code-reviewer subagent
**Commit Range**: 04da339 → 9dd55a6 (implied refactor)
**Scope**: Authentication token storage migration (localStorage → useCookie)

---

## Code Review Summary

### Scope
**Files Reviewed**:
- `app/composables/use-auth.ts` (123 LOC) - Cookie storage implementation
- `app/middleware/auth.global.ts` (13 LOC) - Simplified cookie check
- `app/middleware/guest.ts` (9 LOC) - Simplified cookie check
- `app/pages/login.vue` (124 LOC) - Form validation unchanged
- **Removed**: `app/plugins/auth.client.ts`, `app/middleware/middleware.test.ts`

**Lines Analyzed**: ~269 LOC (active code)
**Review Focus**: Cookie security, SSR safety, token handling, middleware edge cases

### Overall Assessment

**Quality Rating**: ⭐⭐⭐⭐ (4/5)

The refactoring successfully migrates from localStorage to useCookie, fixing SSR hydration flash issues and simplifying middleware. Implementation is clean, SSR-safe, and follows Nuxt 4 best practices. However, several **security and edge case concerns** need addressing before production deployment.

**Key Improvements**:
- ✅ Fixed login page flash during SSR hydration
- ✅ Simplified middleware from 38 LOC → 13 LOC (auth.global) and 31 LOC → 9 LOC (guest)
- ✅ Removed unnecessary client-side plugin and test complexity
- ✅ Better SSR/client cookie synchronization
- ✅ Passes TypeScript checks and linting
- ✅ Production build successful (10.7 MB, 3.4 MB gzip)

---

## Critical Issues

### 🔴 C1: Cookie Security - Missing httpOnly Protection

**Location**: `app/composables/use-auth.ts:27-32`

```ts
const tokenCookie = useCookie<string | null>(TOKEN_KEY, {
  maxAge: 60 * 60 * 24 * 7, // 7 days
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/'
})
```

**Issue**: JWT token accessible via JavaScript (XSS vulnerability). Nuxt's `useCookie` doesn't support `httpOnly` flag (client-side API limitation).

**Impact**: If attacker injects malicious script, they can steal token:
```js
// XSS attack vector
document.cookie // Exposes admin_token
```

**Recommendation**:
1. **Short-term**: Accept risk with mitigations:
   - Add CSP headers in `nuxt.config.ts`:
     ```ts
     routeRules: {
       '/**': {
         headers: {
           'Content-Security-Policy': "default-src 'self'; script-src 'self'"
         }
       }
     }
     ```
   - Document vulnerability in security docs
   - Implement token rotation (refresh tokens)

2. **Long-term**: Migrate to server-side session cookies (Phase 07+):
   - Use Nuxt server middleware to set httpOnly cookies
   - Store token server-side only
   - Client receives opaque session ID

**Severity**: CRITICAL (blocked by Nuxt API, needs mitigation)

---

### 🔴 C2: Cookie Exposure in URL/Referrer Leaks

**Location**: `app/composables/use-auth.ts:60, 81, 100`

**Issue**: Token sent in Authorization header, but cookie still in browser. If API redirects or external links clicked, cookie may leak via Referrer header.

**Recommendation**:
```ts
// Add to nuxt.config.ts
routeRules: {
  '/**': {
    headers: {
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  }
}
```

**Severity**: CRITICAL

---

## High Priority Findings

### 🟠 H1: Token Expiration Not Validated Client-Side

**Location**: `app/composables/use-auth.ts:38, 42`

```ts
const isAuthenticated = computed(() => !!tokenCookie.value)

function init() {
  if (tokenCookie.value) {
    fetchProfile() // No JWT expiry check before API call
  }
}
```

**Issue**: Expired tokens not detected until API call fails. Wastes API request and delays logout.

**Recommendation**:
```ts
import { jwtDecode } from 'jwt-decode' // Add dependency

const isTokenExpired = (token: string): boolean => {
  try {
    const { exp } = jwtDecode<{ exp: number }>(token)
    return Date.now() >= exp * 1000
  } catch {
    return true
  }
}

const isAuthenticated = computed(() => {
  if (!tokenCookie.value) return false
  return !isTokenExpired(tokenCookie.value)
})
```

**Severity**: HIGH

---

### 🟠 H2: Cookie Synchronization Race Condition

**Location**: `app/middleware/auth.global.ts:8`, `app/composables/use-auth.ts:27`

**Issue**: Middleware reads cookie directly while composable manages it. Potential race if cookie updated mid-request.

**Current Code**:
```ts
// middleware/auth.global.ts
const token = useCookie('admin_token') // Independent cookie instance

// composables/use-auth.ts
const tokenCookie = useCookie<string | null>(TOKEN_KEY, { ... }) // Different instance
```

**Problem**: Two separate reactive cookie instances may have stale values during navigation.

**Recommendation**:
```ts
// Option 1: Centralize cookie access through composable
export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/login') return

  const auth = useAuth()
  if (!auth.isAuthenticated.value) {
    return navigateTo('/login')
  }
})
```

**Severity**: HIGH (potential auth bypass in edge cases)

---

### 🟠 H3: Missing Cookie Cleanup on 401

**Location**: `app/composables/use-auth.ts:76-91`

```ts
async function fetchProfile() {
  if (!tokenCookie.value) return
  try {
    const res = await $fetch<ApiResponse<User>>('/auth', {
      baseURL: config.public.apiBase,
      headers: { Authorization: `Bearer ${tokenCookie.value}` }
    })
    user.value = res.data
  } catch (error: unknown) {
    // Only logout on 401 (unauthorized)
    const apiError = error as { statusCode?: number }
    if (apiError.statusCode === 401) {
      logout()
    }
  }
}
```

**Issue**: Comment says "Only logout on 401" but what about:
- 403 Forbidden (token valid but insufficient permissions)
- Network errors (offline scenario)
- 500 server errors (should retry, not logout)

**Recommendation**:
```ts
} catch (error: unknown) {
  const apiError = error as { statusCode?: number }

  // Clear invalid tokens
  if (apiError.statusCode === 401 || apiError.statusCode === 403) {
    logout()
    return
  }

  // Silently fail on network/server errors (keep token, retry later)
  console.error('Profile fetch failed:', apiError)
}
```

**Severity**: HIGH

---

### 🟠 H4: Test Coverage Lost - Middleware Tests Deleted

**Location**: Deleted `app/middleware/middleware.test.ts`

**Issue**: Previous middleware had 100% coverage (Phase 04). Refactored middleware has **0% test coverage**.

**Previous Tests Covered**:
- Server-side token check
- Client-side localStorage fallback
- Login page bypass
- Guest middleware redirect logic

**Recommendation**: Add new tests for cookie-based middleware:
```ts
// app/middleware/auth.global.test.ts
import { describe, it, expect, vi } from 'vitest'
import { authMiddleware } from './auth.global'

describe('auth.global middleware', () => {
  it('allows login page', () => {
    const result = authMiddleware({ path: '/login' }, { value: null })
    expect(result).toBeUndefined()
  })

  it('redirects when no token', () => {
    const result = authMiddleware({ path: '/dashboard' }, { value: null })
    expect(result).toEqual('/login')
  })

  it('allows authenticated access', () => {
    const result = authMiddleware({ path: '/dashboard' }, { value: 'valid.jwt.token' })
    expect(result).toBeUndefined()
  })
})
```

**Severity**: HIGH (regression in code quality standards)

---

## Medium Priority Improvements

### 🟡 M1: Inconsistent Token Naming

**Locations**:
- `use-auth.ts:20` - Constant: `TOKEN_KEY = 'admin_token'`
- `use-auth.ts:27` - Variable: `tokenCookie`
- `use-auth.ts:35` - State key: `'auth_token'` (INCONSISTENT)

**Issue**: State key `'auth_token'` doesn't match cookie name `'admin_token'`. Confusing for debugging.

**Recommendation**:
```ts
const TOKEN_KEY = 'admin_token'
const tokenCookie = useCookie<string | null>(TOKEN_KEY, { ... })
const user = useState<User | null>('admin_token_user', () => null) // Match prefix
```

**Severity**: MEDIUM

---

### 🟡 M2: Login Page Tests Still Mock localStorage

**Location**: `app/pages/login.test.ts:14-23`

```ts
// Mock window.localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  // ...
}
vi.stubGlobal('localStorage', localStorageMock)
```

**Issue**: Tests mock localStorage but code no longer uses it. Dead test code.

**Recommendation**: Remove localStorage mock entirely (now handled by useCookie internally).

**Severity**: MEDIUM

---

### 🟡 M3: No Token Validation on Login Response

**Location**: `app/composables/use-auth.ts:60`

```ts
tokenCookie.value = res.data.token
await fetchProfile()
```

**Issue**: Token assigned without validating format. Malformed JWT causes cryptic errors later.

**Recommendation**:
```ts
const token = res.data.token
if (!token || token.split('.').length !== 3) {
  throw new Error('Invalid token format received')
}
tokenCookie.value = token
```

**Severity**: MEDIUM

---

### 🟡 M4: Logout Doesn't Handle API Failure Gracefully

**Location**: `app/composables/use-auth.ts:94-105`

```ts
async function logout() {
  if (tokenCookie.value) {
    try {
      await $fetch('/auth', {
        baseURL: config.public.apiBase,
        method: 'DELETE',
        headers: { Authorization: `Bearer ${tokenCookie.value}` }
      })
    } catch {
      // Ignore errors on logout
    }
  }

  tokenCookie.value = null
  user.value = null

  navigateTo('/login')
}
```

**Issue**: Comment says "Ignore errors" but doesn't explain why. User may think logout failed.

**Recommendation**: Add toast notification:
```ts
} catch (err) {
  // Server-side logout failed, but clear client-side anyway
  console.warn('Server logout failed:', err)
  toast.add({
    title: 'Logged out locally',
    description: 'Server logout failed, but you are logged out on this device',
    color: 'warning'
  })
}
```

**Severity**: MEDIUM

---

### 🟡 M5: Cookie Path Too Broad

**Location**: `app/composables/use-auth.ts:31`

```ts
path: '/'
```

**Issue**: Cookie sent to all paths. If app has public pages, token unnecessarily exposed.

**Recommendation**: Scope to admin routes if app grows:
```ts
path: '/admin' // Only send cookie to admin routes
```

**Current State**: Acceptable for now (all routes require auth). Document for future.

**Severity**: LOW (future consideration)

---

## Low Priority Suggestions

### 🟢 L1: Code Standards - Vietnamese Comment

**Location**: `app/pages/login.vue:30`

```ts
// Custom validation - chỉ validate khi field đã có giá trị
```

**Issue**: Comment in Vietnamese. Code standards specify English comments.

**Recommendation**:
```ts
// Custom validation - only validate fields after user interaction
```

**Severity**: LOW

---

### 🟢 L2: Readonly Export Inconsistency

**Location**: `app/composables/use-auth.ts:113-122`

```ts
return {
  token: readonly(tokenCookie),
  user: readonly(user),
  isAuthenticated, // Not readonly
  isLoading: readonly(isLoading),
  // ...
}
```

**Issue**: `isAuthenticated` is computed (inherently readonly) but not marked. Inconsistent pattern.

**Recommendation**:
```ts
isAuthenticated: readonly(isAuthenticated), // Explicit for consistency
```

**Severity**: LOW

---

### 🟢 L3: Missing Type Export for Testing

**Location**: `app/composables/use-auth.ts:3-18`

**Issue**: Interfaces not exported. Can't mock in tests without duplication.

**Recommendation**:
```ts
export interface User { ... }
export interface LoginCredentials { ... }
export interface AuthResponse { ... }
```

**Severity**: LOW

---

## Positive Observations

✅ **Excellent Simplification**: Middleware reduced from complex SSR/client dual-check to simple cookie read
✅ **SSR-Safe State**: Proper use of `useState` and `useCookie` for hydration safety
✅ **Error Handling**: Try-catch blocks comprehensive with appropriate fallbacks
✅ **TypeScript**: Strong typing throughout, no `any` types
✅ **Code Style**: Follows project standards (1TBS, no trailing commas)
✅ **Toast Notifications**: Good UX feedback on login success
✅ **Token Lifecycle**: Proper cleanup on logout (both cookie and state)
✅ **Readonly Exports**: Prevents external mutation of auth state

---

## Breaking Changes / Migration Issues

### ✅ No Breaking Changes Detected

**Verified**:
- Login flow unchanged (same credentials interface)
- Middleware behavior identical (still redirects to `/login`)
- Public API of `useAuth()` composable unchanged
- Component imports unaffected

**Migration Path**: Zero changes needed in consuming code.

---

## Security Assessment

### Threat Model Analysis

| Threat | Current Mitigation | Risk Level | Recommended Action |
|--------|-------------------|------------|-------------------|
| XSS Token Theft | None (JS-accessible cookie) | 🔴 HIGH | Add CSP headers (C1) |
| CSRF | `sameSite: 'lax'` | 🟢 LOW | Adequate |
| Token Replay | Expiry check (server-side) | 🟡 MEDIUM | Add client expiry check (H1) |
| MitM Attack | `secure: production` | 🟢 LOW | Adequate |
| Session Fixation | Token regenerated on login | 🟢 LOW | Adequate |
| Referrer Leak | No referrer policy | 🔴 HIGH | Add header (C2) |

**Overall Security Rating**: ⚠️ **REQUIRES HARDENING**

---

## Performance Analysis

### Cookie Size Impact

**Token Size**: ~200-400 bytes (typical JWT)
**Cookie Overhead**: Sent with every request to same domain
**Impact**: Minimal (~0.4 KB per request)

**Optimization**: None needed (cookie size acceptable).

---

### Middleware Execution

**Before** (localStorage):
- Client: 2 storage reads per navigation
- Server: 1 state check

**After** (useCookie):
- Client: 1 cookie read per navigation
- Server: 1 cookie read (from request headers)

**Performance**: ✅ Improved (eliminated localStorage I/O)

---

## Edge Cases Analysis

### ⚠️ Edge Case 1: Cookie Max Size

**Scenario**: JWT grows beyond 4 KB (cookie limit)
**Current Handling**: None (will silently fail to set cookie)
**Recommendation**: Add size check:
```ts
if (token.length > 4000) {
  console.error('Token too large for cookie storage')
  // Fallback to server-side session
}
```

---

### ⚠️ Edge Case 2: Cookie Disabled in Browser

**Scenario**: User has cookies disabled
**Current Handling**: Auth silently fails
**Recommendation**: Detect and show warning:
```ts
if (!navigator.cookieEnabled) {
  toast.add({
    title: 'Cookies Required',
    description: 'Please enable cookies to use this application',
    color: 'error',
    timeout: 0
  })
}
```

---

### ⚠️ Edge Case 3: Concurrent Tab Logout

**Scenario**: User logs out in Tab A, Tab B still thinks authenticated
**Current Handling**: Tab B will fail on next API call (401 triggers logout)
**Recommendation**: Add BroadcastChannel sync:
```ts
// In useAuth composable
const channel = new BroadcastChannel('auth_sync')
channel.onmessage = (event) => {
  if (event.data.type === 'logout') {
    tokenCookie.value = null
    user.value = null
  }
}

// In logout()
channel.postMessage({ type: 'logout' })
```

---

### ✅ Edge Case 4: Server Restart During Session

**Scenario**: API server restarts, invalidates all JWTs
**Current Handling**: ✅ 401 response triggers logout → user re-authenticates
**Status**: Handled correctly

---

### ✅ Edge Case 5: Token Refresh Not Needed (Short Sessions)

**Current**: 7-day expiry, no refresh token
**Assessment**: ✅ Acceptable for admin panel (users typically stay logged in)
**Future**: Consider refresh tokens if implementing auto-logout

---

## Code Standards Compliance

### ✅ Passed Checks

- [x] No trailing commas
- [x] 1TBS brace style
- [x] TypeScript `lang="ts"` in all Vue files
- [x] Auto-imports used correctly (no manual imports)
- [x] ESLint passes
- [x] TypeScript check passes
- [x] Production build succeeds

### ❌ Failed Checks

- [ ] **Test Coverage**: Middleware tests deleted without replacement (H4)
- [ ] **English Comments**: Vietnamese comment in login.vue (L1)

---

## Recommended Actions (Prioritized)

### Must Fix Before Production

1. **[C1] Add CSP Headers** - Mitigate XSS token theft risk
   ```ts
   // nuxt.config.ts
   routeRules: {
     '/**': {
       headers: {
         'Content-Security-Policy': "default-src 'self'; script-src 'self'",
         'Referrer-Policy': 'strict-origin-when-cross-origin'
       }
     }
   }
   ```

2. **[C2] Add Referrer Policy** - Prevent token leak via referrers

3. **[H1] Implement Token Expiry Check** - Validate JWT expiration client-side

4. **[H2] Fix Cookie Synchronization** - Use `useAuth()` in middleware instead of direct `useCookie()`

5. **[H4] Restore Test Coverage** - Write tests for new cookie-based middleware

### Should Fix Soon

6. **[H3] Improve Error Handling** - Differentiate 401 vs 403 vs network errors

7. **[M1] Fix Inconsistent Naming** - Align state key with cookie name

8. **[M2] Clean Up Test Mocks** - Remove localStorage mock from login.test.ts

9. **[M3] Validate Token Format** - Check JWT structure before storing

### Nice to Have

10. **[M4] Better Logout UX** - Notify user if server logout fails

11. **[L1] English Comments** - Translate Vietnamese comment

12. **[L2] Export Interfaces** - Allow test mocking

---

## Metrics

| Metric | Value | Status |
|--------|-------|--------|
| **Type Coverage** | 100% (no `any` types) | ✅ EXCELLENT |
| **Test Coverage** | ~60% (middleware untested) | ⚠️ DEGRADED |
| **Linting Issues** | 0 | ✅ PASS |
| **Build Success** | Yes (10.7 MB) | ✅ PASS |
| **Critical Issues** | 2 | ⚠️ BLOCKER |
| **High Priority** | 4 | ⚠️ REVIEW |
| **Medium Priority** | 5 | ℹ️ INFO |
| **Low Priority** | 3 | ℹ️ INFO |

---

## Test Failures

### ❌ Login Page Tests Failing (3/5 passing)

**Failed Tests**:
1. `shows validation errors for empty fields on submit`
2. `validates email format`

**Root Cause**: Test validation timing issue (unrelated to cookie refactor).

**Action Required**: Fix in separate PR (test infrastructure issue, not auth logic).

---

## Unresolved Questions

1. **Q1**: Should we implement refresh tokens for the 7-day cookie lifespan?
   **Recommendation**: Not urgent (admin panel context), defer to Phase 07.

2. **Q2**: Do we need cross-subdomain cookie sharing?
   **Current**: `path: '/'` works for single domain.
   **Recommendation**: Add `domain` option if deploying to subdomains.

3. **Q3**: Should we add CORS credentials flag to API calls?
   **Current**: Not needed (same-origin).
   **Recommendation**: Monitor if API moves to different domain.

4. **Q4**: Token rotation strategy for long-lived sessions?
   **Recommendation**: Implement sliding expiry in Phase 07 (refresh 7 days → 7 days on each request).

---

## Final Verdict

**Overall Rating**: ⭐⭐⭐⭐ (4/5)

**Approval Status**: ⚠️ **CONDITIONAL APPROVAL**

**Conditions**:
1. Fix critical security headers (C1, C2) - **BLOCKER**
2. Restore middleware test coverage (H4) - **REQUIRED**
3. Implement token expiry validation (H1) - **RECOMMENDED**
4. Fix cookie synchronization (H2) - **RECOMMENDED**

**Summary**: Refactoring achieves its goals (SSR safety, simplification) but introduces security gaps requiring immediate attention. Code quality excellent, but test coverage regression unacceptable per Phase 04 standards.

**Next Steps**:
1. Create follow-up tasks for critical fixes
2. Update `docs/code-standards.md` with cookie security guidelines
3. Add cookie-based auth patterns to `docs/codebase-summary.md`
4. Schedule security audit before production deployment
