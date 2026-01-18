<script setup lang="ts">
/**
 * User Autocomplete Input Component
 * Provides autocomplete functionality for user selection with debounced search
 * Reusable across manga listing, create, and edit pages
 */

interface UserItem {
  label: string
  value: string
}

interface Props {
  modelValue?: UserItem
  placeholder?: string
  minSearchLength?: number
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Nhập tên người đăng (tối thiểu 3 ký tự)...',
  minSearchLength: 3
})

const emit = defineEmits<{
  'update:modelValue': [value: UserItem | undefined]
}>()

const { fetchUsers } = useUsers()

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

// Fetch users based on debounced search term
const { data: usersData, status } = await useLazyAsyncData(
  'users-autocomplete',
  () => {
    if (debouncedSearchTerm.value.length >= props.minSearchLength) {
      return fetchUsers({
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
  usersData.value?.data?.map(u => ({
    label: u.name,
    value: u.id
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
    icon="i-lucide-user"
    ignore-filter
    class="w-full"
  />
</template>
