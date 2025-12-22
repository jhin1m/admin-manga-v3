# Login Page Flash Before Dashboard Redirect - Root Cause Analysis

**Date:** 2025-12-22
**Issue:** Flash of login page before redirecting to dashboard when accessing `/`
**Severity:** Medium (UX issue, not functional)

---

## Executive Summary

**Root Cause:** SSR/client hydration race condition between middleware execution and localStorage token restoration.

**Impact:**
- Poor UX - users see login page flash for ~100-300ms before dashboard loads
- Occurs on every authenticated page load when accessing via `/` route
- Creates perception of slow/buggy application

**Primary Issue:**
Server-side middleware has no access to localStorage token, always redirects to `/login`. Client-side plugin then restores token and triggers another redirect to `/`.

**Secondary Issue:**
Route prerendering (`routeRules: { '/': { prerender: true } }`) compounds timing issues.

---

## Technical Analysis

### Event Timeline (Current Behavior)

1. **Server-Side Rendering (SSR)**
   - User requests `http://localhost:3004/`
   - `auth.global.ts` middleware runs on server
   - Line 21: `if (env.server && !auth?.token?.value)` → always true (no localStorage on server)
   - Server redirects to `/login`
   - Server renders login page HTML

2. **Client Hydration**
   - Browser receives pre-rendered `/login` HTML
   - Vue hydration starts
   - `/login` page briefly visible

3. **Plugin Initialization**
   - `auth.client.ts` plugin runs (client-only)
   - Line 3: `auth.init()` executes
   - Restores token from localStorage
   - Sets `token.value = stored`

4. **Client-Side Middleware Re-execution**
   - `guest.ts` middleware detects authenticated user
   - Line 9-12: finds token in localStorage
   - Redirects to `/`
   - **Flash occurs here** (login page → dashboard)

5. **Final Render**
   - Dashboard page renders with authenticated state

### Code Analysis

#### Problem 1: SSR State Mismatch
**File:** `app/middleware/auth.global.ts` (lines 20-23)

```typescript
// On server, check state (will be null on first load)
if (env.server && !auth?.token?.value) {
  return '/login'
}
```

**Issue:** Server always has null token (no localStorage access), unconditionally redirects authenticated users to login.

#### Problem 2: Plugin Timing
**File:** `app/plugins/auth.client.ts`

```typescript
export default defineNuxtPlugin(() => {
  const auth = useAuth()
  auth.init() // Runs AFTER middleware, AFTER SSR
})
```

**Issue:** Runs too late - middleware already executed during SSR. Token restoration happens after initial navigation decision.

#### Problem 3: useState Initialization
**File:** `app/composables/use-auth.ts` (lines 27, 34-42)

```typescript
// State initialized as null
const token = useState<string | null>('auth_token', () => null)

// init() only runs client-side
function init() {
  if (import.meta.client) {
    const stored = localStorage.getItem(TOKEN_KEY)
    if (stored && stored.length > 10) {
      token.value = stored // Too late for SSR middleware
    }
  }
}
```

**Issue:** Token state unavailable during SSR, causing server-side middleware to fail auth check.

#### Problem 4: Prerendering Conflict
**File:** `nuxt.config.ts` (lines 21-23)

```typescript
routeRules: {
  '/': { prerender: true }
}
```

**Issue:** Prerendering dynamic auth-protected routes creates static HTML that doesn't match client state.

---

## Supporting Evidence

### Middleware Execution Order

1. **Server-side (SSR):**
   - `auth.global.ts` → detects no token → redirects `/login`

2. **Client-side (hydration):**
   - Plugins run → `auth.client.ts` → restores token
   - Middleware re-runs → `guest.ts` → detects token → redirects `/`
   - **Flash visible between these redirects**

### localStorage Access

```typescript
// Server: localStorage undefined
env.server && storage === null

// Client: localStorage available
env.client && storage === localStorage
```

Server middleware cannot check localStorage, always fails authentication.

---

## Recommended Fix Approach

### Solution 1: Cookie-Based Authentication (Recommended)

**Approach:** Store token in HTTP-only cookie instead of localStorage

**Benefits:**
- Cookies available during SSR
- Server middleware can validate token
- No flash - correct page rendered on first load
- Better security (HTTP-only prevents XSS)

**Implementation:**
- Move token from localStorage to cookies
- Update `useAuth()` to use `useCookie()` composable
- Server middleware reads cookie during SSR
- Single navigation decision (no redirect loop)

### Solution 2: Deferred Middleware Execution

**Approach:** Skip middleware during SSR, only run client-side

**Benefits:**
- Eliminates server-side redirect
- Plugin restores token before middleware runs

**Drawbacks:**
- Brief unauthorized content flash
- Not true SSR protection
- SEO implications

**Implementation:**
```typescript
// In auth.global.ts
if (env.server) {
  return // Skip server-side auth
}
```

### Solution 3: Remove Route Prerendering

**Approach:** Remove `routeRules` prerendering for auth-protected routes

**Benefits:**
- Reduces SSR/client state mismatch
- Dynamic rendering matches client state

**Drawbacks:**
- Still has flash (doesn't fix root cause)
- Slower initial page load
- Doesn't solve SSR auth problem

**Implementation:**
```typescript
routeRules: {
  // Remove: '/': { prerender: true }
}
```

### Solution 4: Loading State During Hydration

**Approach:** Show loading spinner until auth state resolves

**Benefits:**
- Better UX than flash
- Masks the redirect

**Drawbacks:**
- Band-aid solution
- Doesn't fix underlying race condition
- Extra loading delay

---

## Preventive Measures

1. **Use SSR-compatible state management**
   - Prefer cookies over localStorage for auth tokens
   - Use `useCookie()` composable for SSR access

2. **Avoid prerendering dynamic routes**
   - Auth-protected pages should not be prerendered
   - Static generation incompatible with user-specific content

3. **Test SSR behavior**
   - Always test with JavaScript disabled
   - Verify server-rendered HTML matches expected state
   - Check Network tab for redirect loops

4. **Initialize critical state early**
   - Use Nuxt hooks that run before middleware
   - Consider `app:created` or `app:beforeMount` hooks

---

## Unresolved Questions

1. **API token validation:** Should server middleware validate token against API during SSR? (adds latency)

2. **Cookie domain configuration:** What cookie settings needed for production deployment?

3. **Token refresh strategy:** How to handle expired tokens during SSR vs client-side?

4. **Backward compatibility:** Migration path from localStorage to cookies for existing users?

5. **SEO requirements:** Do any pages need prerendering despite auth protection?
