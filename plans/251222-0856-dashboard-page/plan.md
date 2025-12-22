# Dashboard Page Implementation Plan

**Plan ID**: 251222-0856-dashboard-page
**Created**: 2025-12-22
**Status**: Completed
**Phase**: 06 - Admin Dashboard

## Overview

Implement the dashboard page for Admin Manga v3, displaying statistics cards (members, manga, chapters, pets) matching the reference design.

## Reference

- **API**: `GET /api/admin/statics/basic` → `{ total_users, total_mangas, total_chapters }`
- **Image**: `docs/images/dashboard/dashboard.png`

## Implementation Phases

| Phase | Description | Status | File |
|-------|-------------|--------|------|
| 01 | Statistics composable | Completed | [phase-01-statistics-composable.md](./phase-01-statistics-composable.md) |
| 02 | Dashboard page UI | Completed | [phase-02-dashboard-page-ui.md](./phase-02-dashboard-page-ui.md) |

## Architecture

```
app/
├── composables/
│   └── use-statistics.ts      # NEW: Fetch /statics/basic
├── components/
│   └── dashboard/
│       └── StatCard.vue       # NEW: Reusable stat card
└── pages/
    └── index.vue              # MODIFY: Replace placeholder
```

## API Data Mapping

| Card Label (VN) | API Field | Icon |
|-----------------|-----------|------|
| Thành viên | total_users | i-lucide-users |
| Tập truyện | total_mangas | i-lucide-book-open |
| Chương truyện | total_chapters | i-lucide-layers |
| Bạn đồng hành | total_pets* | i-lucide-heart |

*Note: `total_pets` not in current API response. Will use placeholder or request API update.

## Dependencies

- Existing `useAuth` composable (token for API calls)
- Nuxt UI v4 components (UCard, etc.)
- Existing default layout

## Success Criteria

- [x] Dashboard displays 4 stat cards
- [x] Stats fetched from API with auth token
- [x] Loading/error states handled
- [x] Dark mode compatible
- [x] Matches reference design layout

## Related Docs

- [API Documentation](../../docs/API_ADMIN_DOCUMENTATION.md)
- [Code Standards](../../docs/code-standards.md)
- [System Architecture](../../docs/system-architecture.md)
