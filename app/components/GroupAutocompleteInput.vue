<script setup lang="ts">
/**
 * Group Autocomplete Input Component
 * Provides autocomplete functionality for group selection with debounced search
 * Reusable across manga listing, create, and edit pages
 */

interface GroupItem {
  label: string
  value: string
}

interface Props {
  modelValue?: GroupItem
  placeholder?: string
  minSearchLength?: number
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Nhập tên nhóm dịch (tối thiểu 3 ký tự)...',
  minSearchLength: 3
})

const emit = defineEmits<{
  'update:modelValue': [value: GroupItem | undefined]
}>()

const { fetchGroups } = useGroups()

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
  set: val => emit('update:modelValue', val)
})

// Fetch groups based on debounced search term
const { data: groupsData, status } = await useLazyAsyncData(
  'groups-autocomplete',
  () => {
    if (debouncedSearchTerm.value.length >= props.minSearchLength) {
      return fetchGroups({
        'per_page': 20,
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
  groupsData.value?.data?.map(g => ({
    label: g.name,
    value: g.id
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
    icon="i-lucide-users"
    ignore-filter
    class="w-full"
  />
</template>
