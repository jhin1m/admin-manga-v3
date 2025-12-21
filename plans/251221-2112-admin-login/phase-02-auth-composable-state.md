# Phase 02: Auth Composable & State

## Context
- **Parent:** [plan.md](./plan.md)
- **Dependencies:** Phase 01
- **Docs:** [API Documentation](../../docs/API_ADMIN_DOCUMENTATION.md)

## Overview
| Field | Value |
|-------|-------|
| Date | 2025-12-21 |
| Priority | High |
| Status | ✅ Complete |
| Review | ✅ Complete |

Create auth composable for login/logout/profile with token persistence in localStorage.

## Key Insights
- Use `useState` for SSR-safe reactive state
- Token persisted to localStorage on client only
- Auto-fetch profile on app init if token exists
- Nuxt UI v4 uses `useToast()` for notifications

## Requirements
1. Token storage with localStorage persistence
2. Login method (POST /auth)
3. Get profile method (GET /auth)
4. Logout method (DELETE /auth)
5. Loading and error states
6. Toast notifications for feedback

## Architecture
```
app/composables/use-auth.ts
├── State
│   ├── token: Ref<string | null>
│   ├── user: Ref<User | null>
│   ├── isAuthenticated: ComputedRef<boolean>
│   └── isLoading: Ref<boolean>
├── Methods
│   ├── login(email, password)
│   ├── logout()
│   ├── fetchProfile()
│   └── init() - restore from localStorage
└── Persistence
    └── localStorage key: 'admin_token'
```

## Related Files
- `app/composables/use-auth.ts` - Main auth composable
- `app/plugins/auth.client.ts` - Init auth on client

## Implementation Steps

### Step 1: Create app/composables/use-auth.ts
```ts
interface User {
  id: string
  name: string
  email: string
  roles: string[]
}

interface LoginCredentials {
  email: string
  password: string
}

interface AuthResponse {
  token: string
  type: string
}

const TOKEN_KEY = 'admin_token'

export function useAuth() {
  const config = useRuntimeConfig()
  const toast = useToast()

  // State - using useState for SSR safety
  const token = useState<string | null>('auth_token', () => null)
  const user = useState<User | null>('auth_user', () => null)
  const isLoading = useState('auth_loading', () => false)

  const isAuthenticated = computed(() => !!token.value)

  // Restore token from localStorage (client only)
  function init() {
    if (import.meta.client) {
      const stored = localStorage.getItem(TOKEN_KEY)
      if (stored) {
        token.value = stored
        fetchProfile()
      }
    }
  }

  // Login
  async function login(credentials: LoginCredentials) {
    isLoading.value = true
    try {
      const res = await $fetch<ApiResponse<AuthResponse>>(
        '/auth',
        {
          baseURL: config.public.apiBase,
          method: 'POST',
          body: credentials
        }
      )

      token.value = res.data.token
      if (import.meta.client) {
        localStorage.setItem(TOKEN_KEY, res.data.token)
      }

      await fetchProfile()
      toast.add({ title: 'Login successful', color: 'success' })
      return true
    } catch (error: any) {
      const msg = error.data?.message || 'Login failed'
      toast.add({ title: msg, color: 'error' })
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Get profile
  async function fetchProfile() {
    if (!token.value) return
    try {
      const res = await $fetch<ApiResponse<User>>('/auth', {
        baseURL: config.public.apiBase,
        headers: { Authorization: `Bearer ${token.value}` }
      })
      user.value = res.data
    } catch {
      // Token invalid, clear it
      logout()
    }
  }

  // Logout
  async function logout() {
    if (token.value) {
      try {
        await $fetch('/auth', {
          baseURL: config.public.apiBase,
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token.value}` }
        })
      } catch {
        // Ignore errors on logout
      }
    }

    token.value = null
    user.value = null
    if (import.meta.client) {
      localStorage.removeItem(TOKEN_KEY)
    }

    navigateTo('/login')
  }

  return {
    token: readonly(token),
    user: readonly(user),
    isAuthenticated,
    isLoading: readonly(isLoading),
    init,
    login,
    logout,
    fetchProfile
  }
}
```

### Step 2: Create app/plugins/auth.client.ts
```ts
export default defineNuxtPlugin(() => {
  const auth = useAuth()
  auth.init()
})
```

## Todo List
- [x] Create use-auth.ts composable
- [x] Create auth.client.ts plugin
- [x] Import ApiResponse type from utils/api.ts
- [ ] Test login/logout flow (manual testing)
- [ ] Address code review findings (H1-H3)

## Review Findings
**Report**: [code-reviewer-251221-phase02-auth-composable.md](../reports/code-reviewer-251221-phase02-auth-composable.md)

**High Priority**:
- H1: Error type safety - use ApiError interface
- H2: Add token validation on init
- H3: Fix race condition in login (persist after profile verified)

**Medium Priority**:
- M3: Only logout on 401, not network errors

## Success Criteria
- [ ] `useAuth()` returns auth state and methods
- [ ] Token persists in localStorage
- [ ] Login stores token and fetches profile
- [ ] Logout clears token and redirects
- [ ] Toast shows success/error messages

## Risk Assessment
| Risk | Mitigation |
|------|------------|
| SSR hydration mismatch | Use useState, client-only localStorage |
| Token expiry | Handle 401 in fetchProfile, auto-logout |

## Security Considerations
- Token stored in localStorage (acceptable for admin panel)
- Token cleared on logout
- 401 response triggers auto-logout

## Next Steps
Proceed to [Phase 03: Login Page UI](./phase-03-login-page-ui.md)
