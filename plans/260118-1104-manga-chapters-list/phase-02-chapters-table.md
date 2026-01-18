# Phase 02: Chapters Table Component

**Estimated Time**: 1.5 hours

## Objective

Create MangaChaptersTable.vue component with full table functionality.

## Tasks

### 1. Create Component (`app/components/manga/MangaChaptersTable.vue`)

```vue
<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Chapter } from '~/types/chapter'

const props = defineProps<{
  mangaId: string
}>()

const toast = useToast()
const { fetchChapters, deleteChapter } = useChapters()

// Pagination state
const page = ref(1)
const perPage = ref(20)

// Data fetching
const { data: response, refresh, status } = await useAsyncData(
  `chapters-${props.mangaId}`,
  () => fetchChapters({
    'filter[manga_id]': props.mangaId,
    include: 'user',
    sort: '-order',
    page: page.value,
    per_page: perPage.value
  }),
  {
    watch: [page, perPage]
  }
)

const chapters = computed(() => response.value?.data || [])
const total = computed(() => response.value?.pagination?.total || 0)
const isLoading = computed(() => status.value === 'pending')

// Columns definition
const columns: TableColumn<Chapter>[] = [
  {
    accessorKey: 'name',
    header: 'Tên chapter'
  },
  {
    accessorKey: 'order',
    header: 'Thứ tự'
  },
  {
    accessorKey: 'views',
    header: 'Lượt xem'
  },
  {
    accessorKey: 'created_at',
    header: 'Ngày tạo'
  },
  {
    id: 'actions',
    header: ''
  }
]

// Delete handler
const chapterToDelete = ref<Chapter | null>(null)
const isDeleting = ref(false)

async function confirmDelete() {
  if (!chapterToDelete.value) return

  isDeleting.value = true
  try {
    await deleteChapter(chapterToDelete.value.id)
    toast.add({
      title: 'Xóa thành công',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
    chapterToDelete.value = null
    refresh()
  } catch (error: any) {
    toast.add({
      title: 'Lỗi',
      description: error.data?.message || 'Xóa thất bại',
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  } finally {
    isDeleting.value = false
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        Danh sách chapters
      </h3>
      <UButton
        icon="i-lucide-plus"
        label="Thêm chapter"
        color="primary"
        size="sm"
        :to="`/manga/${mangaId}/chapters/create`"
      />
    </div>

    <!-- Table Card -->
    <UCard :ui="{ body: 'p-0', root: 'overflow-hidden' }">
      <!-- Loading skeleton -->
      <div v-if="isLoading && chapters.length === 0" class="p-4 space-y-3">
        <div v-for="i in 5" :key="i" class="flex items-center gap-4 animate-pulse">
          <div class="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
          <div class="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16" />
          <div class="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16" />
          <div class="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24" />
          <div class="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16 ml-auto" />
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="!isLoading && chapters.length === 0"
        class="flex flex-col items-center justify-center py-12"
      >
        <UIcon name="i-lucide-file-text" class="w-12 h-12 text-gray-300 mb-4" />
        <p class="text-gray-500 mb-4">Chưa có chapter nào</p>
        <UButton
          icon="i-lucide-plus"
          label="Thêm chapter đầu tiên"
          color="primary"
          variant="soft"
          :to="`/manga/${mangaId}/chapters/create`"
        />
      </div>

      <!-- Table -->
      <UTable v-else :data="chapters" :columns="columns" :loading="isLoading">
        <template #name-cell="{ row }">
          <span class="font-medium text-gray-900 dark:text-white">
            {{ row.original.name }}
          </span>
        </template>

        <template #order-cell="{ row }">
          <UBadge color="neutral" variant="subtle" size="sm">
            #{{ row.original.order }}
          </UBadge>
        </template>

        <template #views-cell="{ row }">
          <div class="flex items-center gap-1 text-sm text-gray-500">
            <UIcon name="i-lucide-eye" class="w-3.5 h-3.5" />
            {{ row.original.views.toLocaleString('vi-VN') }}
          </div>
        </template>

        <template #created_at-cell="{ row }">
          <span class="text-sm text-gray-500">
            {{ formatDate(row.original.created_at) }}
          </span>
        </template>

        <template #actions-cell="{ row }">
          <div class="flex items-center justify-end gap-1">
            <UButton
              icon="i-lucide-pencil"
              color="primary"
              variant="ghost"
              size="xs"
              :to="`/manga/${mangaId}/chapters/${row.original.id}/edit`"
            />
            <UButton
              icon="i-lucide-trash-2"
              color="error"
              variant="ghost"
              size="xs"
              @click="chapterToDelete = row.original"
            />
          </div>
        </template>
      </UTable>

      <!-- Pagination -->
      <div
        v-if="total > perPage"
        class="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-800"
      >
        <span class="text-sm text-gray-500">
          {{ chapters.length }} / {{ total }} chapters
        </span>
        <UPagination v-model:page="page" :total="total" :items-per-page="perPage" />
      </div>
    </UCard>

    <!-- Delete Confirmation Modal -->
    <UModal v-model:open="!!chapterToDelete">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center gap-2 text-error-500">
              <UIcon name="i-lucide-alert-triangle" class="w-5 h-5" />
              <span class="font-semibold">Xác nhận xóa</span>
            </div>
          </template>

          <p class="text-gray-600 dark:text-gray-400">
            Bạn có chắc muốn xóa chapter
            <strong class="text-gray-900 dark:text-white">
              "{{ chapterToDelete?.name }}"
            </strong>?
          </p>

          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton
                label="Hủy"
                color="neutral"
                variant="ghost"
                @click="chapterToDelete = null"
              />
              <UButton
                label="Xóa"
                color="error"
                :loading="isDeleting"
                @click="confirmDelete"
              />
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </div>
</template>
```

## Component Features

| Feature | Implementation |
|---------|---------------|
| Loading | Skeleton rows with pulse animation |
| Empty | Icon + message + CTA button |
| Table | UTable with custom cell templates |
| Pagination | UPagination below table |
| Delete | Modal confirmation |
| Actions | Edit (pencil) + Delete (trash) buttons |

## Key Patterns

1. **Cell Templates**: Use `#{columnKey}-cell` slot pattern
2. **Row Access**: `row.original` for data access
3. **Async Data**: `useAsyncData` with watch for reactivity
4. **Toast**: Success/error feedback

## Verification

- Component renders without errors
- Loading state shows during fetch
- Empty state shows when no data
- Pagination appears when total > perPage
- Delete modal shows on trash click
- Actions navigate/delete correctly

## Next Phase

Phase 03: Integrate component into manga edit page
