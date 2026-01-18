# Phase 01: Types & Composable

**Estimated Time**: 45 minutes

## Objective

Define Chapter type and create useChapters composable for API interactions.

## Tasks

### 1. Create Chapter Type (`app/types/chapter.ts`)

```ts
import type { Manga } from './manga'
import type { User } from './user'

export interface Chapter {
  id: string
  name: string
  slug: string
  order: number
  views: number
  manga_id: string
  user_id: string
  created_at: string
  updated_at: string
  // Included relations
  manga?: Manga
  user?: User
}
```

### 2. Create useChapters Composable (`app/composables/use-chapters.ts`)

```ts
import type { Chapter } from '~/types/chapter'
import type { PaginatedApiResponse, ApiResponse } from '~/utils/api'

export interface ChapterFilters {
  page?: number
  per_page?: number
  'filter[manga_id]'?: string
  'filter[name]'?: string
  'filter[user_id]'?: string
  include?: string
  sort?: string
}

export function useChapters() {
  const api = useApi()

  async function fetchChapters(params?: ChapterFilters) {
    return await api<PaginatedApiResponse<Chapter>>('/chapters', {
      method: 'GET',
      params
    })
  }

  async function fetchChapter(id: string, params?: Record<string, any>) {
    return await api<ApiResponse<Chapter>>(`/chapters/${id}`, {
      method: 'GET',
      params
    })
  }

  async function deleteChapter(id: string) {
    return await api<ApiResponse<null>>(`/chapters/${id}`, {
      method: 'DELETE'
    })
  }

  async function deleteChapters(ids: string[]) {
    return await api<ApiResponse<null>>('/chapters/delete-many', {
      method: 'PUT',
      body: { ids }
    })
  }

  return {
    fetchChapters,
    fetchChapter,
    deleteChapter,
    deleteChapters
  }
}
```

## Code Standards Checklist

- [ ] No trailing commas
- [ ] 1TBS brace style
- [ ] Types exported from types/ directory
- [ ] Composable follows existing patterns (use-manga.ts, use-users.ts)
- [ ] Use `useApi()` for authenticated requests

## Verification

```bash
# Type check
pnpm typecheck

# Lint
pnpm lint
```

## Next Phase

Phase 02: Create MangaChaptersTable component
