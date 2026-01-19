<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Chapter } from '~/types/chapter'

/**
 * MangaChaptersTable Component
 *
 * Hiển thị danh sách chapters của một manga với các tính năng:
 * - Load toàn bộ chapters
 * - Edit chapter (navigate to edit page)
 * - Delete chapter (với confirmation modal)
 * - Loading state (skeleton)
 * - Empty state
 */

interface Props {
  mangaId: string
}

const props = defineProps<Props>()

const { fetchChapters, deleteChapter } = useChapters()
const toast = useToast()

// State management
const sort = ref('-order') // Sort by order descending (newest chapters first)

// Fetch chapters data (load all chapters without pagination)
const { data: response, refresh, status } = await useAsyncData(
  `manga-chapters-${props.mangaId}`,
  () => fetchChapters({
    'filter[manga_id]': props.mangaId,
    'sort': sort.value
  })
)

// Computed values
const chapters = computed(() => response.value?.data || [])
const total = computed(() => response.value?.pagination.total || 0)
const isLoading = computed(() => status.value === 'pending')
const hasError = computed(() => status.value === 'error')

// Table columns definition
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

// Delete confirmation modal
const deleteModal = ref(false)
const chapterToDelete = ref<Chapter | null>(null)

function openDeleteModal(chapter: Chapter) {
  chapterToDelete.value = chapter
  deleteModal.value = true
}

async function confirmDelete() {
  if (!chapterToDelete.value) return

  try {
    await deleteChapter(chapterToDelete.value.id)
    toast.add({
      title: 'Xóa chapter thành công',
      description: `Đã xóa "${chapterToDelete.value.name}"`,
      color: 'success'
    })
    deleteModal.value = false
    chapterToDelete.value = null
    await refresh()
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Vui lòng thử lại'
    toast.add({
      title: 'Lỗi khi xóa chapter',
      description: message,
      color: 'error'
    })
  }
}

// Date formatting
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
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">
          Danh sách chapters
        </h3>
        <p class="text-sm text-gray-500 mt-1">
          Quản lý các chapter của manga này.
        </p>
      </div>
      <UButton icon="i-lucide-plus" label="Thêm chapter" color="primary" :to="`/manga/${mangaId}/chapters/create`" />
    </div>



    <!-- Table Section -->
    <UCard :ui="{ body: 'p-0', root: 'overflow-hidden border-gray-200 dark:border-gray-800 shadow-sm' }">
      <!-- Error State -->
      <div v-if="hasError" class="flex flex-col items-center justify-center py-16 px-4">
        <div class="p-4 rounded-full bg-error-100 dark:bg-error-900/20 mb-4">
          <UIcon name="i-lucide-alert-circle" class="w-8 h-8 text-error-500" />
        </div>
        <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Lỗi khi tải dữ liệu
        </h4>
        <p class="text-sm text-gray-500 mb-6 text-center max-w-md">
          Không thể tải danh sách chapters. Vui lòng thử lại.
        </p>
        <UButton icon="i-lucide-refresh-cw" label="Thử lại" color="primary" @click="() => refresh()" />
      </div>

      <!-- Empty State -->
      <div v-else-if="!isLoading && chapters.length === 0" class="flex flex-col items-center justify-center py-16 px-4">
        <div class="p-4 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <UIcon name="i-lucide-book-open" class="w-8 h-8 text-gray-400" />
        </div>
        <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Chưa có chapter nào
        </h4>
        <p class="text-sm text-gray-500 mb-6 text-center max-w-md">
          Manga này chưa có chapter nào. Bắt đầu bằng cách thêm chapter đầu tiên.
        </p>
        <UButton icon="i-lucide-plus" label="Thêm chapter" color="primary" :to="`/manga/${mangaId}/chapters/create`" />
      </div>

      <!-- Data Table -->
      <UTable v-else :data="chapters" :columns="columns" :loading="isLoading" class="w-full">
        <!-- Name column -->
        <template #name-cell="{ row }">
          <div class="flex flex-col gap-1 py-1">
            <span class="font-semibold text-gray-900 dark:text-white">{{ row.original.name }}</span>
            <span class="text-xs text-gray-400 font-mono">{{ row.original.slug }}</span>
          </div>
        </template>

        <!-- Order column -->
        <template #order-cell="{ row }">
          <UBadge color="neutral" variant="subtle" size="sm" class="font-bold">
            #{{ row.original.order }}
          </UBadge>
        </template>

        <!-- Views column -->
        <template #views-cell="{ row }">
          <div class="flex items-center gap-1.5">
            <UIcon name="i-lucide-eye" class="w-4 h-4 text-gray-400" />
            <span class="font-semibold text-gray-900 dark:text-white">{{ (row.original.views ?? 0).toLocaleString()
            }}</span>
          </div>
        </template>

        <!-- Created at column -->
        <template #created_at-cell="{ row }">
          <div class="flex flex-col text-xs">
            <span class="text-gray-900 dark:text-white font-medium">{{ formatDate(row.original.created_at) }}</span>
            <span class="text-gray-500 italic">
              {{ new Date(row.original.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
              }}
            </span>
          </div>
        </template>

        <!-- Actions column -->
        <template #actions-cell="{ row }">
          <UDropdownMenu :items="[
            [
              {
                label: 'Sửa chapter',
                icon: 'i-lucide-pencil',
                to: `/manga/${mangaId}/chapters/${row.original.id}/edit`
              }
            ],
            [
              {
                label: 'Xóa chapter',
                icon: 'i-lucide-trash',
                color: 'error',
                onSelect: (e: Event) => {
                  openDeleteModal(row.original)
                }
              }
            ]
          ]">
            <UButton icon="i-lucide-more-horizontal" color="neutral" variant="ghost" />
          </UDropdownMenu>
        </template>
      </UTable>

      <!-- Total Chapters Info -->
      <div v-if="!isLoading && chapters.length > 0"
        class="flex items-center justify-center gap-2 px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
        <div class="text-sm text-gray-500">
          Tổng số <span class="font-semibold text-gray-900 dark:text-white">{{ total }}</span> chapters
        </div>
      </div>
    </UCard>

    <!-- Delete Confirmation Modal -->
    <UModal v-model:open="deleteModal">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-error-100 dark:bg-error-900/20">
            <UIcon name="i-lucide-trash" class="w-5 h-5 text-error-500" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Xác nhận xóa chapter
          </h3>
        </div>
      </template>

      <template #body>
        <p class="text-gray-600 dark:text-gray-400">
          Bạn có chắc chắn muốn xóa chapter
          <span class="font-semibold text-gray-900 dark:text-white">"{{ chapterToDelete?.name }}"</span>?
        </p>
        <p class="text-sm text-error-600 dark:text-error-400 mt-2">
          Hành động này không thể hoàn tác.
        </p>
      </template>

      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton label="Hủy" color="neutral" variant="ghost" @click="deleteModal = false" />
          <UButton label="Xóa chapter" color="error" @click="confirmDelete" />
        </div>
      </template>
    </UModal>
  </div>
</template>
