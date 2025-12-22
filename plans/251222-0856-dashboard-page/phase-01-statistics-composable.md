# Phase 01: Statistics Composable

**Parent Plan**: [plan.md](./plan.md)
**Dependencies**: `useAuth` composable, API setup
**Docs**: [API Documentation](../../docs/API_ADMIN_DOCUMENTATION.md)

## Overview

| Field | Value |
|-------|-------|
| Date | 2025-12-22 |
| Description | Create composable to fetch dashboard statistics |
| Priority | High |
| Implementation Status | Completed |
| Review Status | Approved |

## Key Insights

1. API endpoint `GET /api/admin/statics/basic` returns `{ total_users, total_mangas, total_chapters }`
2. Missing `total_pets` field - need placeholder or API update
3. Must use Bearer token from `useAuth` composable
4. Follow existing composable patterns from `use-auth.ts`

## Requirements

1. Create `use-statistics.ts` composable
2. Fetch stats from `/statics/basic` endpoint
3. Handle loading/error states
4. Use SSR-safe patterns (useState)
5. Auto-refresh capability (optional)

## Architecture

```ts
// app/composables/use-statistics.ts
interface DashboardStats {
  total_users: number
  total_mangas: number
  total_chapters: number
  total_pets: number  // placeholder if not in API
}

export function useStatistics() {
  const stats = useState<DashboardStats | null>('dashboard_stats', () => null)
  const isLoading = useState('stats_loading', () => false)
  const error = useState<string | null>('stats_error', () => null)

  async function fetchStats() { ... }

  return { stats, isLoading, error, fetchStats }
}
```

## Related Code Files

- `app/composables/use-auth.ts` - Reference pattern
- `app/utils/api.ts` - API types
- `nuxt.config.ts` - Runtime config

## Implementation Steps

1. [ ] Create `app/composables/use-statistics.ts`
2. [ ] Define `DashboardStats` interface
3. [ ] Implement `fetchStats()` with token injection
4. [ ] Add loading/error state management
5. [ ] Export composable with readonly state

## Todo List

- [x] Create composable file
- [x] Define TypeScript interfaces
- [x] Implement API fetch logic
- [x] Handle error states
- [x] Test with mock/real API

## Success Criteria

- [x] Stats fetched successfully with auth token
- [x] Loading state shows during fetch
- [x] Error state handled gracefully
- [x] Types correctly defined
- [x] Follows codebase patterns

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| API missing pets field | Low | Use 0 as placeholder |
| Token not available | Medium | Check auth before fetch |
| API timeout | Low | Add error handling |

## Security Considerations

- Token injected via Authorization header
- No sensitive data exposed in client state
- API errors don't leak internal details

## Code Snippet

```ts
// app/composables/use-statistics.ts
import type { ApiResponse } from '~/utils/api'

interface DashboardStats {
  total_users: number
  total_mangas: number
  total_chapters: number
  total_pets: number
}

export function useStatistics() {
  const config = useRuntimeConfig()
  const auth = useAuth()

  const stats = useState<DashboardStats | null>('dashboard_stats', () => null)
  const isLoading = useState('stats_loading', () => false)
  const error = useState<string | null>('stats_error', () => null)

  async function fetchStats() {
    if (!auth.token.value) return

    isLoading.value = true
    error.value = null

    try {
      const res = await $fetch<ApiResponse<DashboardStats>>('/statics/basic', {
        baseURL: config.public.apiBase,
        headers: { Authorization: `Bearer ${auth.token.value}` }
      })
      stats.value = {
        ...res.data,
        total_pets: res.data.total_pets ?? 0
      }
    } catch (e: unknown) {
      error.value = 'Failed to load statistics'
      console.error('Stats fetch error:', e)
    } finally {
      isLoading.value = false
    }
  }

  return {
    stats: readonly(stats),
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchStats
  }
}
```

## Next Steps

After completion, proceed to [Phase 02: Dashboard Page UI](./phase-02-dashboard-page-ui.md)
