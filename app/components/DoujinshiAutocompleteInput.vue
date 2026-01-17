<script setup lang="ts">
/**
 * Doujinshi Autocomplete Input Component
 * Provides autocomplete functionality for doujinshi selection with debounced search
 * Reusable across manga listing, create, and edit pages
 */

interface DoujinshiItem {
  label: string
  value: string
}

interface Props {
  modelValue?: DoujinshiItem
  placeholder?: string
  minSearchLength?: number
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Nhập tên doujinshi (tối thiểu 3 ký tự)...',
  minSearchLength: 3
})

const emit = defineEmits<{
  'update:modelValue': [value: DoujinshiItem | undefined]
}>()

const { fetchDoujinshis } = useDoujinshis()

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

// Fetch doujinshis based on debounced search term
const { data: doujinshisData, status } = await useLazyAsyncData(
  'doujinshis-autocomplete',
  () => {
    if (debouncedSearchTerm.value.length >= props.minSearchLength) {
      return fetchDoujinshis({
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
  doujinshisData.value?.data?.map(d => ({
    label: d.name,
    value: d.id
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
    icon="i-lucide-book-heart"
    ignore-filter
    class="w-full"
  />
</template>
