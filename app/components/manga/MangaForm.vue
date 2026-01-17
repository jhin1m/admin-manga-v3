<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { Genre, Artist, Group, Doujinshi } from '~/types/manga'

interface Props {
  manga?: {
    id: string
    name: string
    name_alt?: string | null
    status: string
    artist_id?: string | null
    doujinshi_id?: string | null
    group_id?: string | null
    cover_full_url?: string
    genres?: Genre[]
    is_hot?: boolean
    content?: string | null
  }
  isEditing?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isEditing: false
})

const emit = defineEmits<{
  submit: [data: any]
}>()

const toast = useToast()
const { fetchGenres } = useGenres()

// Status options
const statusOptions = [
  { label: 'Đang tiến hành', value: 'ongoing' },
  { label: 'Hoàn thành', value: 'completed' },
  { label: 'Tạm ngưng', value: 'onhold' },
  { label: 'Đã hủy', value: 'canceled' }
]

// Form validation schema
const schema = z.object({
  name: z.string().min(1, 'Tên truyện là bắt buộc').max(255),
  name_alt: z.string().optional(),
  status: z.string().min(1, 'Vui lòng chọn tình trạng'),
  artist_id: z.string().optional(),
  doujinshi_id: z.string().optional(),
  group_id: z.string().optional(),
  is_hot: z.boolean().optional(),
  content: z.string().optional(),
  genres: z.array(z.number()).optional(),
  cover: z.any().optional()
})

type Schema = z.output<typeof schema>

// Form state
const state = reactive({
  name: props.manga?.name || '',
  name_alt: props.manga?.name_alt || '',
  status: props.manga?.status || 'ongoing',
  artist_id: props.manga?.artist_id || undefined,
  doujinshi_id: props.manga?.doujinshi_id || undefined,
  group_id: props.manga?.group_id || undefined,
  is_hot: props.manga?.is_hot || false,
  content: props.manga?.content || '',
  genres: props.manga?.genres?.map(g => g.id) || [],
  cover: null as File | null
})

// Selected items for autocomplete inputs
const artistSelected = ref<{ label: string; value: string } | undefined>(undefined)
const groupSelected = ref<{ label: string; value: string } | undefined>(undefined)
const doujinshiSelected = ref<{ label: string; value: string } | undefined>(undefined)

// Sync selected items with state IDs
watch([artistSelected, groupSelected, doujinshiSelected], () => {
  state.artist_id = artistSelected.value?.value
  state.group_id = groupSelected.value?.value
  state.doujinshi_id = doujinshiSelected.value?.value
})

// Fetch genres for checkbox grid
const { data: genresResponse } = await useAsyncData('genres-list', () =>
  fetchGenres({ per_page: 100 })
)

const genres = computed(() => genresResponse.value?.data || [])

// Cover image preview
const coverPreview = ref<string | null>(props.manga?.cover_full_url || null)
const coverInputRef = ref<HTMLInputElement | null>(null)

function handleCoverChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.add({ title: 'Vui lòng chọn file ảnh (JPG, PNG, WebP)', color: 'error' })
      return
    }
    // Validate file size (2MB = 2048KB)
    const maxSize = 2 * 1024 * 1024
    if (file.size > maxSize) {
      toast.add({ title: 'File ảnh không được vượt quá 2MB', color: 'error' })
      return
    }
    state.cover = file
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      coverPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

function removeCover() {
  state.cover = null
  coverPreview.value = null
  if (coverInputRef.value) {
    coverInputRef.value.value = ''
  }
}

// Genre toggle function
function toggleGenre(genreId: number) {
  const index = state.genres.indexOf(genreId)
  if (index === -1) {
    state.genres.push(genreId)
  } else {
    state.genres.splice(index, 1)
  }
}

function isGenreSelected(genreId: number): boolean {
  return state.genres.includes(genreId)
}

// Submit handler
const isSubmitting = ref(false)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isSubmitting.value = true
  try {
    emit('submit', {
      ...event.data,
      genres: state.genres,
      cover: state.cover
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-8">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Content Column -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Basic Information Card -->
        <UCard :ui="{ header: 'px-6 py-4', body: 'p-6' }" class="border-gray-200 dark:border-gray-800 shadow-sm">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <UIcon name="i-lucide-info" class="w-5 h-5 text-primary" />
                Thông tin cơ bản
              </h3>
              <UFormField name="is_hot">
                <div class="flex items-center gap-2">
                  <USwitch v-model="state.is_hot" id="is_hot" />
                  <label for="is_hot" class="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                    Hot
                  </label>
                </div>
              </UFormField>
            </div>
          </template>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormField label="Tên truyện" name="name" required description="Tên chính thức của truyện">
              <UInput v-model="state.name" placeholder="Nhập tên truyện..." icon="i-lucide-book-open" size="lg" />
            </UFormField>

            <UFormField label="Tên khác" name="name_alt" description="Các tên gọi khác, cách nhau bằng dấu phẩy">
              <UInput v-model="state.name_alt" placeholder="Tên 1, Tên 2, Tên 3..." />
              <template #hint>
                <span class="text-xs text-gray-400">Tên gọi khác</span>
              </template>
            </UFormField>

            <UFormField label="Doujinshi" name="doujinshi_id">
              <DoujinshiAutocompleteInput v-model="doujinshiSelected" placeholder="Tìm kiếm doujinshi..." />
            </UFormField>

            <UFormField label="Thể loại" name="genres" class="md:col-span-2">
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                <label v-for="genre in genres" :key="genre.id"
                  class="flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all" :class="[
                    isGenreSelected(genre.id)
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
                  ]">
                  <input type="checkbox" :checked="isGenreSelected(genre.id)" @change="toggleGenre(genre.id)"
                    class="sr-only" />
                  <div class="w-4 h-4 rounded border flex items-center justify-center" :class="[
                    isGenreSelected(genre.id)
                      ? 'bg-primary-500 border-primary-500'
                      : 'border-gray-300 dark:border-gray-600'
                  ]">
                    <UIcon v-if="isGenreSelected(genre.id)" name="i-lucide-check" class="w-3 h-3 text-white" />
                  </div>
                  <span class="text-sm truncate">{{ genre.name }}</span>
                </label>
              </div>
            </UFormField>
          </div>
        </UCard>

        <!-- Content Card -->
        <UCard :ui="{ header: 'px-6 py-4', body: 'p-6' }" class="border-gray-200 dark:border-gray-800 shadow-sm">
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <UIcon name="i-lucide-file-text" class="w-5 h-5 text-primary" />
              Nội dung
            </h3>
          </template>

          <UFormField label="Tóm tắt nội dung" name="content">
            <UTextarea v-model="state.content" :rows="8" placeholder="Nhập tóm tắt nội dung truyện..."
              class="w-full font-medium" />
          </UFormField>
        </UCard>
      </div>

      <!-- Sidebar Column -->
      <div class="lg:col-span-1 space-y-8">
        <!-- Cover Image Card -->
        <UCard :ui="{ header: 'px-6 py-4', body: 'p-6' }" class="border-gray-200 dark:border-gray-800 shadow-sm">
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <UIcon name="i-lucide-image" class="w-5 h-5 text-primary" />
              Ảnh bìa
            </h3>
          </template>

          <div class="space-y-4">
            <div v-if="coverPreview"
              class="relative aspect-[2/3] max-w-[200px] mx-auto rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <img :src="coverPreview" alt="Cover preview" class="w-full h-full object-cover" />
              <UButton icon="i-lucide-x" color="error" variant="solid" size="xs" class="absolute top-2 right-2"
                @click="removeCover" />
            </div>
            <div v-else
              class="aspect-[2/3] max-w-[200px] mx-auto rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-gray-400">
              <UIcon name="i-lucide-image-plus" class="w-12 h-12 mb-2" />
              <span class="text-sm">Chưa có ảnh bìa</span>
            </div>

            <UButton icon="i-lucide-upload" block variant="outline" color="primary" @click="coverInputRef?.click()">
              Tải ảnh lên
            </UButton>
            <input ref="coverInputRef" type="file" accept="image/jpeg,image/png,image/webp" class="hidden"
              @change="handleCoverChange" />

            <p class="text-xs text-center text-gray-400">
              Định dạng: JPG, PNG, WebP | Tối đa: 2MB
            </p>
          </div>
        </UCard>

        <!-- Other Information Card -->
        <UCard :ui="{ header: 'px-6 py-4', body: 'p-6' }" class="border-gray-200 dark:border-gray-800 shadow-sm">
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <UIcon name="i-lucide-settings" class="w-5 h-5 text-primary" />
              Thông tin khác
            </h3>
          </template>

          <div class="space-y-6">
            <UFormField label="Tình trạng" name="status" required>
              <USelect v-model="state.status" :options="statusOptions" placeholder="Chọn tình trạng"
                icon="i-lucide-flag" />
            </UFormField>

            <UFormField label="Tác giả" name="artist_id">
              <ArtistAutocompleteInput v-model="artistSelected" placeholder="Tìm kiếm tác giả..." />
            </UFormField>

            <UFormField label="Nhóm dịch" name="group_id">
              <GroupAutocompleteInput v-model="groupSelected" placeholder="Tìm kiếm nhóm dịch..." />
            </UFormField>
          </div>
        </UCard>

        <!-- Actions -->
        <div class="flex flex-col gap-3">
          <UButton type="submit" icon="i-lucide-save" color="primary" size="lg" block :loading="isSubmitting">
            {{ isEditing ? 'Cập nhật' : 'Thêm mới' }}
          </UButton>

          <UButton type="button" icon="i-lucide-arrow-left" variant="ghost" color="neutral" block
            @click="navigateTo('/manga')">
            Quay lại
          </UButton>
        </div>
      </div>
    </div>
  </UForm>
</template>
