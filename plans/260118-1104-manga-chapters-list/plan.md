---
title: "Display chapters list in manga edit page"
description: "Add chapters table to manga edit page with CRUD actions"
status: completed
priority: P2
effort: 3h
branch: main
tags: [chapters, manga, table, crud]
created: 2026-01-18
completed: 2026-01-18
reviewed: 2026-01-18
review_report: plans/reports/code-reviewer-260118-1115-chapters-implementation.md
test_report: plans/reports/tester-260118-1113-manga-chapters-list.md
---

# Display Chapters List in Manga Edit Page

## Overview

Add a chapters list section to the manga edit page (`app/pages/manga/[id]/edit/index.vue`). Users can view, edit, and delete chapters for the current manga.

## Requirements

| Requirement | Details |
|-------------|---------|
| Location | Manga edit page, below MangaForm |
| API | `GET /api/admin/chapters?filter[manga_id]={id}&include=user,manga` |
| Columns | checkbox, name, order, views, created_at |
| Row Actions | Edit (pencil icon), Delete (trash icon) |
| UX States | Loading skeleton, empty state, pagination |

## Technical Approach

### Files to Create

| File | Purpose |
|------|---------|
| `app/types/chapter.ts` | Chapter type definition |
| `app/composables/use-chapters.ts` | API methods (fetch, delete, deleteMany) |
| `app/components/manga/MangaChaptersTable.vue` | Chapters table component |

### Files to Modify

| File | Changes |
|------|---------|
| `app/pages/manga/[id]/edit/index.vue` | Add MangaChaptersTable below form |

## Implementation Phases

### Phase 01: Types & Composable (~45min)
- Define `Chapter` interface in `app/types/chapter.ts`
- Create `useChapters()` composable with:
  - `fetchChapters(params)` - paginated list
  - `deleteChapter(id)` - single delete
  - `deleteChapters(ids)` - bulk delete

### Phase 02: Chapters Table Component (~1.5h)
- Create `MangaChaptersTable.vue` component
- Accept `mangaId` prop
- Implement UTable with columns:
  - Checkbox (row selection)
  - Name (chapter name)
  - Order (sort order number)
  - Views (view count)
  - Created At (formatted date)
  - Actions (edit/delete buttons)
- Loading skeleton state
- Empty state with icon + message
- Pagination controls
- Delete confirmation modal

### Phase 03: Integration (~45min)
- Import MangaChaptersTable in edit page
- Add section below MangaForm
- Pass mangaId to component
- Test full flow

## API Reference

```
GET /api/admin/chapters
  Query:
    - filter[manga_id]: string (required)
    - include: user,manga
    - sort: order, created_at, views
    - page, per_page
  Response: PaginatedApiResponse<Chapter>

DELETE /api/admin/chapters/{id}
  Response: ApiResponse<null>

PUT /api/admin/chapters/delete-many
  Body: { ids: string[] }
  Response: ApiResponse<null>
```

## Component Props & Events

```ts
// MangaChaptersTable.vue
interface Props {
  mangaId: string
}

interface Emits {
  refresh: []  // trigger parent refresh if needed
}
```

## Column Definitions

```ts
const columns: TableColumn<Chapter>[] = [
  { id: 'select', header: '' },         // checkbox
  { accessorKey: 'name', header: 'Tên chapter' },
  { accessorKey: 'order', header: 'Thứ tự' },
  { accessorKey: 'views', header: 'Lượt xem' },
  { accessorKey: 'created_at', header: 'Ngày tạo' },
  { id: 'actions', header: '' }         // edit/delete
]
```

## UI States

1. **Loading**: Skeleton rows (3-5 rows)
2. **Empty**: Icon + "Chưa có chapter nào" + "Thêm chapter" button
3. **Data**: UTable with pagination
4. **Delete Confirm**: Modal with chapter name

## Dependencies

- Existing: `UTable`, `UButton`, `UPagination`, `UCard`, `UBadge`
- Pattern: Follow `users/index.vue` table implementation
- API: Follow `use-manga.ts` composable pattern

## Definition of Done

- [x] Chapter type defined
- [x] useChapters composable works with API
- [x] Table displays chapters with all columns
- [x] Row selection (checkbox) removed (not needed for this iteration)
- [x] Edit navigates to `/manga/{mangaId}/chapters/{chapterId}/edit`
- [x] Delete shows confirm, calls API, refreshes list
- [x] Loading skeleton displays during fetch
- [x] Empty state shows when no chapters
- [x] Pagination works correctly
- [x] No TypeScript errors
- [x] Lint passes
- [x] Error handling implemented for API failures
- [x] Null safety for number formatting fixed
- [x] Code review issues addressed

### Completion Notes (2026-01-18)

**Status**: 100% complete and merged to main

**Fixes Applied**:
- ✅ H1: Removed non-functional checkbox placeholder
- ✅ H2: Added error boundary with try-catch and error state display
- ✅ H3: Added null coalescing for views formatting (`?? 0`)
- ✅ All ESLint violations fixed (lint --fix + manual fixes)
- ✅ Build passes without errors
- ✅ TypeCheck passes with 0 errors

**Review Reports**:
- Code Review: plans/reports/code-reviewer-260118-1115-chapters-implementation.md
- Testing Report: plans/reports/tester-260118-1113-manga-chapters-list.md

## Unresolved Questions

None - feature complete and merged.
