# Phase 01: Runtime Config & API Setup

## Context
- **Parent:** [plan.md](./plan.md)
- **Dependencies:** None
- **Docs:** [API Documentation](../../docs/API_ADMIN_DOCUMENTATION.md)

## Overview
| Field | Value |
|-------|-------|
| Date | 2025-12-21 |
| Priority | High |
| Status | ✅ Complete |
| Review | ✅ Approved - All fixes verified |

Configure Nuxt runtime config for API base URL and create reusable API client wrapper.

## Key Insights
- Nuxt 4 uses `useRuntimeConfig()` for env-based configuration
- `$fetch` is auto-imported and handles JSON parsing
- API returns `{ success, data, code }` or `{ success, message, code }`

## Requirements
1. Add `NUXT_PUBLIC_API_BASE` env variable support
2. Create typed API response interfaces
3. Create `$api` wrapper with base URL and error handling

## Architecture
```
nuxt.config.ts
├── runtimeConfig.public.apiBase
└── defaults to http://127.0.0.1:8000/api/admin

app/utils/api.ts
├── ApiResponse<T> interface
├── ApiError interface
└── $api() function with auth header injection
```

## Related Files
- `nuxt.config.ts` - Add runtime config
- `app/utils/api.ts` - Create API wrapper

## Implementation Steps

### Step 1: Update nuxt.config.ts
Add runtime config for API base URL:
```ts
runtimeConfig: {
  public: {
    apiBase: 'http://127.0.0.1:8000/api/admin'
  }
}
```

### Step 2: Create app/utils/api.ts
```ts
// Types for API responses
export interface ApiResponse<T> {
  success: boolean
  data: T
  code: number
}

export interface ApiError {
  success: false
  message: string
  code: number
  errors?: Record<string, string[]>
}

// API client factory
export function useApi() {
  const config = useRuntimeConfig()
  const auth = useAuth() // will be created in phase 02

  return $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      const token = auth.token.value
      if (token) {
        options.headers.set('Authorization', `Bearer ${token}`)
      }
    }
  })
}
```

## Todo List
- [x] Add runtimeConfig to nuxt.config.ts
- [x] Create app/utils/api.ts with types
- [x] Fix ESLint errors (unused param, key order)
- [x] Add NUXT_PUBLIC_API_BASE env support
- [x] Test config with `useRuntimeConfig()`

## Success Criteria
- [x] `useRuntimeConfig().public.apiBase` returns correct URL
- [x] API types defined for success/error responses
- [x] `useApi()` composable created
- [x] ESLint passes without errors
- [x] Environment variable override functional

## Risk Assessment
| Risk | Mitigation |
|------|------------|
| Circular dependency with useAuth | Defer auth injection to phase 02 |

## Security Considerations
- API base URL configurable via env (not hardcoded in prod)
- Token only sent with Authorization header

## Next Steps
Proceed to [Phase 02: Auth Composable](./phase-02-auth-composable-state.md)
