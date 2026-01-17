<script setup lang="ts">
/**
 * Artist Autocomplete Input Component
 * Provides autocomplete functionality for artist selection with debounced search
 * Reusable across manga listing, create, and edit pages
 */

interface ArtistItem {
  label: string
  value: string
}

interface Props {
  modelValue?: ArtistItem
  placeholder?: string
  minSearchLength?: number
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Nhập tên tác giả (tối thiểu 3 ký tự)...',
  minSearchLength: 3
})

const emit = defineEmits<{
  'update:modelValue': [value: ArtistItem | undefined]
}>()

const { fetchArtists } = useArtists()

// Local state for search term
const searchTerm = ref('')
const debouncedSearchTerm = ref('')

// Debounce search term manually
let debounceTimeout: ReturnType<typeof setTimeout> | null = null
watch(searchTerm, (newVal) => {
  if (debounceTimeout) clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    debouncedSearchTerm.value = newVal
  }, 200)
})

// Sync modelValue with internal state
const selected = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// Fetch artists based on debounced search term
const { data: artistsData, status } = await useLazyAsyncData(
  'artists-autocomplete',
  () => {
    if (debouncedSearchTerm.value.length >= props.minSearchLength) {
      return fetchArtists({
        per_page: 20,
        'filter[name]': debouncedSearchTerm.value
      })
    }
    return Promise.resolve(null)
  },
  {
    watch: [debouncedSearchTerm],
    immediate: false
  }
)

// Transform API data to InputMenu items
const items = computed(() =>
  artistsData.value?.data?.map(a => ({
    label: a.name,
    value: a.id
  })) || []
)

const isLoading = computed(() => status.value === 'pending')
</script>

<template>
  <UInputMenu
    v-model="selected"
    v-model:search-term="searchTerm"
    :items="items"
    :loading="isLoading"
    :placeholder="placeholder"
    icon="i-lucide-pen-tool"
    ignore-filter
    class="w-full"
  />
</template>
