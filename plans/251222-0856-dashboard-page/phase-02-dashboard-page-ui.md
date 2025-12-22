# Phase 02: Dashboard Page UI

**Parent Plan**: [plan.md](./plan.md)
**Dependencies**: Phase 01 (statistics composable)
**Docs**: [Code Standards](../../docs/code-standards.md)

## Overview

| Field | Value |
|-------|-------|
| Date | 2025-12-22 |
| Description | Create dashboard page with stat cards UI |
| Priority | High |
| Implementation Status | Completed |
| Review Status | Approved |

## Key Insights

1. Reference image shows 4 horizontal stat cards
2. Dark theme with "Thông tin chung" (General Info) header
3. Each card: label (top), large number (bottom)
4. Uses default layout (already has header/footer)
5. Replace current `index.vue` placeholder content

## Requirements

1. Create reusable `StatCard` component
2. Update `index.vue` with dashboard content
3. Display 4 stat cards in responsive grid
4. Fetch and display statistics on mount
5. Handle loading/error states
6. Match reference design styling

## Architecture

```
app/
├── components/
│   └── dashboard/
│       └── StatCard.vue       # Reusable stat card
└── pages/
    └── index.vue              # Dashboard page
```

### Component Props

```ts
// StatCard.vue props
interface StatCardProps {
  label: string
  value: number
  icon?: string
  loading?: boolean
}
```

## Related Code Files

- `app/pages/index.vue` - Current placeholder (to replace)
- `app/layouts/default.vue` - Layout wrapper
- `app/composables/use-statistics.ts` - Data source (Phase 01)

## Implementation Steps

1. [x] Create `app/components/dashboard/` directory
2. [x] Create `StatCard.vue` component
3. [x] Replace `index.vue` content with dashboard
4. [x] Add section header "Thông tin chung"
5. [x] Implement 4-column responsive grid
6. [x] Connect to `useStatistics` composable
7. [x] Add loading skeleton states
8. [x] Add error state handling
9. [x] Test dark mode compatibility

## Todo List

- [x] Create StatCard component
- [x] Update index.vue
- [x] Implement responsive grid
- [x] Add loading states
- [x] Add error handling
- [x] Test UI in light/dark modes

## Success Criteria

- [x] 4 stat cards displayed
- [x] Loading skeleton shown during fetch
- [x] Error message on API failure
- [x] Responsive layout (mobile/desktop)
- [x] Matches reference design
- [x] Dark mode compatible

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Layout breaking on mobile | Medium | Use responsive grid |
| Long numbers overflow | Low | Use number formatting |
| Loading flash | Low | Add skeleton loader |

## Security Considerations

- No user input handling
- Display only (no mutations)
- Stats are non-sensitive

## Code Snippets

### StatCard.vue

```vue
<script setup lang="ts">
interface Props {
  label: string
  value: number
  icon?: string
  loading?: boolean
}

defineProps<Props>()
</script>

<template>
  <div class="flex flex-col gap-1">
    <span class="text-sm text-muted">{{ label }}</span>
    <USkeleton v-if="loading" class="h-8 w-24" />
    <span v-else class="text-2xl font-semibold">
      {{ value.toLocaleString() }}
    </span>
  </div>
</template>
```

### index.vue

```vue
<script setup lang="ts">
const stats = useStatistics()

onMounted(() => {
  stats.fetchStats()
})

const cards = computed(() => [
  { label: 'Thành viên', value: stats.stats.value?.total_users ?? 0, icon: 'i-lucide-users' },
  { label: 'Tập truyện', value: stats.stats.value?.total_mangas ?? 0, icon: 'i-lucide-book-open' },
  { label: 'Chương truyện', value: stats.stats.value?.total_chapters ?? 0, icon: 'i-lucide-layers' },
  { label: 'Bạn đồng hành', value: stats.stats.value?.total_pets ?? 0, icon: 'i-lucide-heart' }
])
</script>

<template>
  <UContainer>
    <UCard>
      <template #header>
        <h2 class="font-semibold">Thông tin chung</h2>
      </template>

      <div v-if="stats.error.value" class="text-red-500">
        {{ stats.error.value }}
      </div>

      <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          v-for="card in cards"
          :key="card.label"
          :label="card.label"
          :value="card.value"
          :icon="card.icon"
          :loading="stats.isLoading.value"
        />
      </div>
    </UCard>
  </UContainer>
</template>
```

## Design Reference

From `docs/images/dashboard/dashboard.png`:
- Dark card background
- Gray label text (muted)
- White/large numbers
- 4-column horizontal layout
- Section title "Thông tin chung"

## Next Steps

After completion:
1. Run `pnpm lint && pnpm typecheck`
2. Test with real API
3. Update `docs/codebase-summary.md`
4. Mark plan as completed
