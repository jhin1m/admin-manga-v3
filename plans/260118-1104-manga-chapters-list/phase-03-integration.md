# Phase 03: Integration

**Estimated Time**: 45 minutes

## Objective

Integrate MangaChaptersTable into the manga edit page.

## Tasks

### 1. Modify Manga Edit Page (`app/pages/manga/[id]/edit/index.vue`)

Add MangaChaptersTable component below MangaForm.

#### Current Structure

```vue
<template>
  <UDashboardPanel>
    <template #header>...</template>
    <template #body>
      <div v-if="isLoading && !manga">...</div>
      <div v-else-if="manga" class="mx-auto w-full">
        <MangaForm :manga="manga" :is-editing="true" @submit="handleSubmit" />
      </div>
      <div v-else>...</div>
    </template>
  </UDashboardPanel>
</template>
```

#### Updated Structure

```vue
<template>
  <UDashboardPanel>
    <template #header>...</template>
    <template #body>
      <div v-if="isLoading && !manga">...</div>
      <div v-else-if="manga" class="mx-auto w-full flex flex-col gap-8">
        <!-- Manga Edit Form -->
        <MangaForm :manga="manga" :is-editing="true" @submit="handleSubmit" />

        <!-- Chapters Section Divider -->
        <USeparator />

        <!-- Chapters Table -->
        <MangaChaptersTable :manga-id="mangaId" />
      </div>
      <div v-else>...</div>
    </template>
  </UDashboardPanel>
</template>
```

### 2. Full Modified File

```vue
<script setup lang="ts">
import type { MangaFormData } from '~/composables/use-manga'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { fetchManga, updateManga } = useManga()

const mangaId = route.params.id as string

// Fetch manga data
const { data: response, status, refresh } = await useAsyncData(
  `manga-${mangaId}`,
  () => fetchManga(mangaId, { include: 'genres' })
)

const manga = computed(() => {
  const data = response.value?.data
  if (!data) return undefined
  return {
    ...data,
    status: String(data.status)
  } as {
    id: string
    name: string
    name_alt?: string | null
    status: string
    artist_id?: string | null
    doujinshi_id?: string | null
    group_id?: string | null
    cover_full_url?: string
    genres?: import('~/types/manga').Genre[]
    is_hot?: boolean
    content?: string | null
    updated_at: string
  }
})

const isLoading = computed(() => status.value === 'pending')
const isUpdating = ref(false)

async function handleSubmit(data: MangaFormData) {
  isUpdating.value = true
  try {
    await updateManga(mangaId, data)
    toast.add({
      title: 'Cập nhật thành công',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
    refresh()
  } catch (error: any) {
    console.error('Update manga error:', error)
    const message = error.data?.message || error.message || 'Cập nhật thất bại'
    toast.add({
      title: 'Lỗi',
      description: message,
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  } finally {
    isUpdating.value = false
  }
}

function formatDate(dateString?: string) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar :title="manga?.name ? `Chỉnh sửa: ${manga.name}` : 'Chỉnh sửa truyện'" icon="i-lucide-edit">
        <template #leading>
          <UButton icon="i-lucide-arrow-left" variant="ghost" color="neutral" @click="router.back()" />
        </template>
        <template v-if="manga" #right>
          <div class="flex items-center gap-2 text-sm text-gray-500">
            <UIcon name="i-lucide-clock" class="w-4 h-4" />
            <span>Cập nhật: {{ formatDate(manga.updated_at) }}</span>
          </div>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-if="isLoading && !manga" class="flex items-center justify-center p-12">
        <UIcon name="i-lucide-loader-2" class="w-10 h-10 animate-spin text-primary" />
      </div>

      <div v-else-if="manga" class="mx-auto w-full flex flex-col gap-8">
        <!-- Manga Edit Form -->
        <MangaForm :manga="manga" :is-editing="true" @submit="handleSubmit" />

        <!-- Chapters Section -->
        <USeparator />
        <MangaChaptersTable :manga-id="mangaId" />
      </div>

      <div v-else class="flex flex-col items-center justify-center p-24 text-center">
        <div class="p-4 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <UIcon name="i-lucide-book-x" class="w-12 h-12 text-gray-400" />
        </div>
        <h3 class="text-xl font-bold">Không tìm thấy truyện</h3>
        <p class="text-gray-500 mt-2 max-w-xs">Truyện này có thể đã bị xóa hoặc ID không chính xác.</p>
        <UButton label="Quay lại danh sách" variant="link" color="primary" class="mt-4"
          @click="router.push('/manga')" />
      </div>
    </template>
  </UDashboardPanel>
</template>
```

## Layout Structure

```
UDashboardPanel
└── #body
    └── div.flex.flex-col.gap-8
        ├── MangaForm         (existing)
        ├── USeparator        (visual divider)
        └── MangaChaptersTable (new component)
```

## Testing Checklist

- [ ] Navigate to `/manga/{id}/edit`
- [ ] MangaForm displays correctly
- [ ] USeparator visible between sections
- [ ] MangaChaptersTable loads and displays
- [ ] Chapters fetch uses correct manga_id
- [ ] Edit button navigates to chapter edit
- [ ] Delete button shows confirmation modal
- [ ] Pagination works if many chapters
- [ ] Empty state shows if no chapters
- [ ] No console errors
- [ ] Run `pnpm lint` - passes
- [ ] Run `pnpm typecheck` - passes

## Final Verification

```bash
# Start dev server
pnpm dev

# Navigate to manga edit page
# http://localhost:3000/manga/{mangaId}/edit

# Verify all features work
```

## Definition of Done

- Manga edit page shows chapters table
- All table features functional
- No TypeScript/ESLint errors
- Visual consistency with existing UI
