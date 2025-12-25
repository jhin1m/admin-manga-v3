<script setup lang="ts">
import type { Manga } from '~/types/manga'
import { refDebounced } from '@vueuse/core'

const route = useRoute()
const router = useRouter()
const { fetchMangas, deleteManga } = useManga()
const { fetchUsers } = useUsers()
// Correcting the imports based on what I wrote in use-filters.ts
const { fetchArtists: getArtists } = useArtists()
const { fetchGroups: getGroups } = useGroups()
const { fetchDoujinshis: getDoujinshis } = useDoujinshis()

// Filter states
const page = ref(Number(route.query.page) || 1)
const perPage = ref(Number(route.query.per_page) || 20)
const search = ref((route.query['filter[name]'] as string) || '')
const userId = ref((route.query['filter[user_id]'] as string) || undefined)
const artistId = ref((route.query['filter[artist_id]'] as string) || undefined)
const groupId = ref((route.query['filter[group_id]'] as string) || undefined)
const doujinshiId = ref((route.query['filter[doujinshi_id]'] as string) || undefined)
const isReviewed = ref(route.query['filter[is_reviewed]'] as string || undefined)

// Selection states (for InputMenu objects)
const userSelected = ref<{ label: string, value: string } | undefined>(undefined)
const artistSelected = ref<{ label: string, value: string } | undefined>(undefined)
const groupSelected = ref<{ label: string, value: string } | undefined>(undefined)
const doujinshiSelected = ref<{ label: string, value: string } | undefined>(undefined)

// Search terms for autocomplete
const userSearchTerm = ref('')
const artistSearchTerm = ref('')
const groupSearchTerm = ref('')
const doujinshiSearchTerm = ref('')

// Debounced search terms (200ms delay)
const userSearchDebounced = refDebounced(userSearchTerm, 200)
const artistSearchDebounced = refDebounced(artistSearchTerm, 200)
const groupSearchDebounced = refDebounced(groupSearchTerm, 200)
const doujinshiSearchDebounced = refDebounced(doujinshiSearchTerm, 200)

// Data fetching
const { data: response, refresh, status } = await useAsyncData(
    'mangas',
    () => fetchMangas({
        page: page.value,
        per_page: perPage.value,
        'filter[name]': search.value || undefined,
        'filter[user_id]': userId.value || undefined,
        'filter[artist_id]': artistId.value || undefined,
        'filter[group_id]': groupId.value || undefined,
        'filter[doujinshi_id]': doujinshiId.value || undefined,
        'filter[is_reviewed]': isReviewed.value || undefined,
        include: 'genres,user'
    }),
    {
        watch: [page, perPage]
    }
)

const mangas = computed(() => response.value?.data || [])
const total = computed(() => response.value?.pagination?.total || 0)
const isLoading = computed(() => status.value === 'pending')

// Update URL query
const updateFilters = () => {
    const query: any = {
        page: page.value,
        per_page: perPage.value,
        'filter[name]': search.value || undefined,
        'filter[user_id]': userId.value || undefined,
        'filter[artist_id]': artistId.value || undefined,
        'filter[group_id]': groupId.value || undefined,
        'filter[doujinshi_id]': doujinshiId.value || undefined,
        'filter[is_reviewed]': isReviewed.value || undefined
    }

    // Remove undefined/empty
    Object.keys(query).forEach(key => {
        if (query[key] === undefined || query[key] === '') delete query[key]
    })

    router.push({ query })
}

const handleSearch = () => {
    page.value = 1
    updateFilters()
    refresh()
}

const handleReset = () => {
    search.value = ''
    userId.value = undefined
    artistId.value = undefined
    groupId.value = undefined
    doujinshiId.value = undefined
    userSelected.value = undefined
    artistSelected.value = undefined
    groupSelected.value = undefined
    doujinshiSelected.value = undefined
    userSearchTerm.value = ''
    artistSearchTerm.value = ''
    groupSearchTerm.value = ''
    doujinshiSearchTerm.value = ''
    isReviewed.value = undefined
    page.value = 1
    updateFilters()
    refresh()
}

// Autocomplete data fetching based on search terms
const { data: usersData, status: usersStatus } = await useLazyAsyncData(
    'users-autocomplete',
    () => {
        // Only search if term length > 2
        if (userSearchDebounced.value.length > 2) {
            return fetchUsers({
                per_page: 20,
                'filter[name]': userSearchDebounced.value
            })
        }
        return Promise.resolve(null)
    },
    {
        watch: [userSearchDebounced],
        immediate: false
    }
)

const { data: artistsData, status: artistsStatus } = await useLazyAsyncData(
    'artists-autocomplete',
    () => {
        if (artistSearchDebounced.value.length > 2) {
            return getArtists({
                per_page: 20,
                'filter[name]': artistSearchDebounced.value
            })
        }
        return Promise.resolve(null)
    },
    {
        watch: [artistSearchDebounced],
        immediate: false
    }
)

const { data: groupsData, status: groupsStatus } = await useLazyAsyncData(
    'groups-autocomplete',
    () => {
        if (groupSearchDebounced.value.length > 2) {
            return getGroups({
                per_page: 20,
                'filter[name]': groupSearchDebounced.value
            })
        }
        return Promise.resolve(null)
    },
    {
        watch: [groupSearchDebounced],
        immediate: false
    }
)

const { data: doujinshisData, status: doujinshisStatus } = await useLazyAsyncData(
    'doujinshis-autocomplete',
    () => {
        if (doujinshiSearchDebounced.value.length > 2) {
            return getDoujinshis({
                per_page: 20,
                'filter[name]': doujinshiSearchDebounced.value
            })
        }
        return Promise.resolve(null)
    },
    {
        watch: [doujinshiSearchDebounced],
        immediate: false
    }
)

const userItems = computed(() => usersData.value?.data?.map(u => ({ label: u.name, value: u.id })) || [])
const artistItems = computed(() => artistsData.value?.data?.map(a => ({ label: a.name, value: a.id })) || [])
const groupItems = computed(() => groupsData.value?.data?.map(g => ({ label: g.name, value: g.id })) || [])
const doujinshiItems = computed(() => doujinshisData.value?.data?.map(d => ({ label: d.name, value: d.id })) || [])

const reviewOptions = [
    { label: 'Tất cả', value: undefined },
    { label: 'Đã duyệt', value: '1' },
    { label: 'Chờ duyệt', value: '0' }
]

const getStatusLabel = (status: string | number) => {
    const labels: Record<string | number, string> = {
        ongoing: 'Đang tiến hành',
        completed: 'Hoàn thành',
        onhold: 'Tạm ngưng',
        canceled: 'Đã hủy',
        1: 'Đang tiến hành',
        2: 'Hoàn thành',
        3: 'Tạm ngưng',
        4: 'Đã hủy'
    }
    return labels[status] || status
}

const getStatusColor = (status: string | number) => {
    const colors: Record<string | number, any> = {
        ongoing: 'primary',
        completed: 'success',
        onhold: 'warning',
        canceled: 'error',
        1: 'primary',
        2: 'success',
        3: 'warning',
        4: 'error'
    }
    return colors[status] || 'neutral'
}

// Sync IDs with selections
watch(userSelected, (val) => userId.value = val?.value)
watch(artistSelected, (val) => artistId.value = val?.value)
watch(groupSelected, (val) => groupId.value = val?.value)
watch(doujinshiSelected, (val) => doujinshiId.value = val?.value)

const handleDelete = async (manga: Manga) => {
    if (confirm(`Bạn có chắc muốn xóa truyện "${manga.name}"?`)) {
        try {
            await deleteManga(manga.id)
            refresh()
        } catch (e) {
            console.error(e)
        }
    }
}
</script>

<template>
    <UDashboardPanel>
        <template #header>
            <UDashboardNavbar title="Quản lý truyện" icon="i-lucide-book-open">
                <template #right>
                    <UButton icon="i-lucide-plus" label="Thêm mới" color="primary" to="/manga/create" />
                </template>
            </UDashboardNavbar>
        </template>

        <template #body>
            <div class="flex flex-col gap-6">
                <!-- Filters Panel -->
                <UCard :ui="{ body: 'p-4' }">
                    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <UFormField label="Tên truyện / tên khác">
                            <UInput v-model="search" placeholder="Nhập tên truyện..." icon="i-lucide-search"
                                class="w-full" @keyup.enter="handleSearch" />
                        </UFormField>

                        <UFormField label="Người đăng">
                            <UInputMenu v-model="userSelected" v-model:search-term="userSearchTerm"
                                :items="userItems" :loading="usersStatus === 'pending'"
                                placeholder="Nhập tên người đăng (tối thiểu 3 ký tự)..." icon="i-lucide-user"
                                class="w-full" ignore-filter />
                        </UFormField>

                        <UFormField label="Tác giả">
                            <UInputMenu v-model="artistSelected" v-model:search-term="artistSearchTerm"
                                :items="artistItems" :loading="artistsStatus === 'pending'"
                                placeholder="Nhập tên tác giả (tối thiểu 3 ký tự)..." icon="i-lucide-pen-tool"
                                class="w-full" ignore-filter />
                        </UFormField>

                        <UFormField label="Nhóm dịch">
                            <UInputMenu v-model="groupSelected" v-model:search-term="groupSearchTerm"
                                :items="groupItems" :loading="groupsStatus === 'pending'"
                                placeholder="Nhập tên nhóm dịch (tối thiểu 3 ký tự)..." icon="i-lucide-users"
                                class="w-full" ignore-filter />
                        </UFormField>

                        <UFormField label="Doujinshi">
                            <UInputMenu v-model="doujinshiSelected" v-model:search-term="doujinshiSearchTerm"
                                :items="doujinshiItems" :loading="doujinshisStatus === 'pending'"
                                placeholder="Nhập tên doujinshi (tối thiểu 3 ký tự)..." icon="i-lucide-book-heart"
                                class="w-full" ignore-filter />
                        </UFormField>

                        <UFormField label="Duyệt">
                            <USelect v-model="isReviewed" :options="reviewOptions" class="w-full" />
                        </UFormField>

                        <div class="flex items-end gap-2 md:col-span-2 lg:col-span-1">
                            <UButton label="Tìm kiếm" icon="i-lucide-search" color="primary" class="flex-1"
                                @click="handleSearch" />
                            <UButton label="Reset" icon="i-lucide-rotate-ccw" color="neutral" variant="ghost"
                                @click="handleReset" />
                        </div>
                    </div>
                </UCard>

                <!-- Manga Grid -->
                <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <UCard v-for="i in 6" :key="i" class="animate-pulse">
                        <div class="flex gap-4">
                            <div class="w-24 h-36 bg-gray-200 dark:bg-gray-800 rounded shadow-sm shrink-0" />
                            <div class="flex-1 space-y-2">
                                <div class="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                                <div class="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                                <div class="flex gap-1 mt-2">
                                    <div class="h-5 bg-gray-200 dark:bg-gray-800 rounded w-12" />
                                    <div class="h-5 bg-gray-200 dark:bg-gray-800 rounded w-12" />
                                </div>
                            </div>
                        </div>
                    </UCard>
                </div>

                <div v-else-if="mangas.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <UCard v-for="manga in mangas" :key="manga.id" :ui="{ body: 'p-3' }"
                        class="hover:border-primary-500/50 transition-colors">
                        <div class="flex gap-4">
                            <!-- Cover Image -->
                            <div class="w-24 h-36 shrink-0 relative group">
                                <img :src="manga.cover_full_url" :alt="manga.name"
                                    class="w-full h-full object-cover rounded shadow-sm" />
                                <div v-if="!manga.is_reviewed"
                                    class="absolute inset-0 bg-black/50 flex items-center justify-center rounded">
                                    <span class="text-[10px] text-white font-bold bg-orange-500 px-1 py-0.5 rounded">CHỜ
                                        DUYỆT</span>
                                </div>
                            </div>

                            <!-- Info -->
                            <div class="flex-1 flex flex-col min-w-0">
                                <div class="flex justify-between items-start gap-2">
                                    <NuxtLink :to="`/manga/${manga.id}`"
                                        class="font-bold text-gray-900 dark:text-white hover:text-primary-500 transition-colors line-clamp-2">
                                        {{ manga.name }}
                                    </NuxtLink>

                                    <UButton icon="i-lucide-trash-2" color="error" variant="ghost" size="xs"
                                        @click="handleDelete(manga)" />
                                </div>

                                <div v-if="manga.name_alt" class="text-xs text-gray-400 truncate mt-0.5">
                                    {{ manga.name_alt }}
                                </div>

                                <!-- Badges -->
                                <div class="flex flex-wrap gap-1 mt-2">
                                    <UBadge v-for="genre in manga.genres?.slice(0, 3)" :key="genre.id" color="neutral"
                                        variant="subtle" size="xs">
                                        {{ genre.name }}
                                    </UBadge>
                                    <span v-if="manga.genres && manga.genres.length > 3"
                                        class="text-[10px] text-gray-400 self-center">
                                        +{{ manga.genres.length - 3 }}
                                    </span>
                                </div>

                                <!-- Footer Info -->
                                <div class="mt-auto pt-2 flex items-center justify-between">
                                    <UBadge :color="getStatusColor(manga.status)" variant="soft" size="sm"
                                        class="font-medium">
                                        {{ getStatusLabel(manga.status) }}
                                    </UBadge>

                                    <div class="text-[10px] text-gray-500 flex items-center gap-1">
                                        <UIcon name="i-lucide-calendar" class="w-3 h-3" />
                                        {{ new Date(manga.created_at).toLocaleDateString('vi-VN') }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </UCard>
                </div>

                <div v-else
                    class="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                    <UIcon name="i-lucide-book-x" class="w-12 h-12 text-gray-300 mb-4" />
                    <p class="text-gray-500">Không tìm thấy truyện nào matching với bộ lọc.</p>
                    <UButton label="Xóa bộ lọc" variant="link" color="primary" @click="handleReset" />
                </div>

                <!-- Bottom Pagination -->
                <div v-if="total > perPage" class="flex items-center justify-between px-2">
                    <div class="text-sm text-gray-500">
                        Hiển thị <span class="font-semibold">{{ mangas.length }}</span> / <span class="font-semibold">{{
                            total }}</span> truyện
                    </div>
                    <UPagination v-model:page="page" :total="total" :items-per-page="perPage" />
                </div>
            </div>
        </template>
    </UDashboardPanel>
</template>
