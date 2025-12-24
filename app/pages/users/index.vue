<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { User } from '~/types/user'

const { fetchUsers } = useUsers()

const page = ref(1)
const perPage = ref(50)
const search = ref('')
const sort = ref('-created_at')

const { data: response, refresh, status } = await useAsyncData(
    'users',
    () => fetchUsers({
        page: page.value,
        per_page: perPage.value,
        'filter[name]': search.value || undefined,
        sort: sort.value
    }),
    {
        watch: [page, perPage, sort]
    }
)

const users = computed(() => response.value?.data || [])
const total = computed(() => response.value?.pagination.total || 0)
const isLoading = computed(() => status.value === 'pending')

const columns: TableColumn<User>[] = [
    {
        accessorKey: 'name',
        header: 'Người dùng',
    },
    {
        accessorKey: 'email',
        header: 'Email'
    },
    {
        accessorKey: 'total_points',
        header: 'Điểm',
    },
    {
        accessorKey: 'level',
        header: 'Cấp độ'
    },
    {
        accessorKey: 'created_at',
        header: 'Ngày tham gia'
    },
    {
        id: 'actions',
        header: ''
    }
]

// Handle search with debounce
let searchTimeout: any
watch(search, () => {
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
        page.value = 1
        refresh()
    }, 500)
})

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}
</script>

<template>
    <UDashboardPanel>
        <template #header>
            <UDashboardNavbar title="Quản lý người dùng" icon="i-lucide-users">
                <template #right>
                    <UButton icon="i-lucide-plus" label="Thêm người dùng" color="primary" />
                </template>
            </UDashboardNavbar>
        </template>

        <div class="flex flex-col gap-4 p-4 lg:p-6 overflow-y-auto">
            <div>
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">Tất cả người dùng</h2>
                <p class="text-sm text-gray-500 mt-1">Quản lý tài khoản, điểm thưởng và quyền hạn của người dùng.</p>
            </div>

            <!-- Filters Toolbar -->
            <div
                class="flex flex-col md:flex-row items-center gap-4 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <div class="flex-1 w-full">
                    <UInput v-model="search" icon="i-lucide-search" placeholder="Tìm kiếm theo tên hoặc email..."
                        size="md" class="w-full" :ui="{ root: 'max-w-md' }" />
                </div>
                <div class="flex items-center gap-3 w-full md:w-auto">
                    <span class="text-xs text-gray-500 font-medium whitespace-nowrap">Hiển thị:</span>
                    <USelect v-model="perPage" :options="[20, 50, 100]" class="w-24" size="md" />
                </div>
            </div>

            <!-- Table Section -->
            <UCard
                :ui="{ body: { padding: 'p-0' }, root: 'overflow-hidden border-gray-200 dark:border-gray-800 shadow-sm' }">
                <UTable :data="users" :columns="columns" :loading="isLoading" class="w-full">
                    <!-- Custom item rendering -->
                    <template #name-cell="{ row }">
                        <div class="flex items-center gap-3 py-1">
                            <UAvatar :src="row.original.avatar_full_url" :alt="row.original.name" size="md"
                                class="shadow-sm border border-gray-100 dark:border-gray-800" />
                            <div class="flex flex-col min-w-0">
                                <span
                                    class="font-semibold text-gray-900 dark:text-white truncate max-w-[150px] lg:max-w-[250px]">{{
                                    row.original.name }}</span>
                                <span
                                    class="text-[10px] text-gray-400 font-mono tracking-tighter truncate max-w-[150px]">{{
                                    row.original.id }}</span>
                            </div>
                        </div>
                    </template>

                    <template #email-cell="{ row }">
                        <div class="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                            <UIcon name="i-lucide-mail" class="w-3.5 h-3.5 opacity-50" />
                            <span class="truncate max-w-[150px] lg:max-w-none">{{ row.original.email }}</span>
                        </div>
                    </template>

                    <template #total_points-cell="{ row }">
                        <div class="flex flex-col gap-0.5">
                            <div class="flex items-center gap-1.5">
                                <div class="p-1 rounded bg-yellow-50 dark:bg-yellow-900/20">
                                    <UIcon name="i-lucide-gem" class="w-3.5 h-3.5 text-yellow-500" />
                                </div>
                                <span class="font-bold text-gray-900 dark:text-white">{{ row.original.total_points
                                    }}</span>
                            </div>
                            <div class="text-[10px] text-gray-500 pl-6">Sử dụng: {{ row.original.used_points }}</div>
                        </div>
                    </template>

                    <template #level-cell="{ row }">
                        <div class="flex flex-col gap-1">
                            <UBadge color="neutral" variant="subtle" size="sm" class="w-fit font-bold">
                                LEVEL {{ row.original.level }}
                            </UBadge>
                            <div class="w-20 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div class="h-full bg-primary-500"
                                    :style="{ width: `${Math.min((row.original.exp / 1000) * 100, 100)}%` }"></div>
                            </div>
                        </div>
                    </template>

                    <template #created_at-cell="{ row }">
                        <div class="flex flex-col text-xs">
                            <span class="text-gray-900 dark:text-white font-medium">{{
                                formatDate(row.original.created_at) }}</span>
                            <span class="text-gray-500 italic">{{ new
                                Date(row.original.created_at).toLocaleTimeString('vi-VN', {
                                    hour: '2-digit', minute:
                                '2-digit' }) }}</span>
                        </div>
                    </template>

                    <template #actions-cell="{ row }">
                        <UDropdownMenu :items="[
                            [
                                { label: 'Chi tiết & Sửa', icon: 'i-lucide-pencil', to: `/users/${row.original.id}` },
                                { label: 'Gửi thông báo', icon: 'i-lucide-bell' }
                            ],
                            [
                                { label: 'Cấm người dùng', icon: 'i-lucide-ban', color: 'error' }
                            ]
                        ]">
                            <UButton icon="i-lucide-more-horizontal" color="neutral" variant="ghost" />
                        </UDropdownMenu>
                    </template>
                </UTable>

                <!-- Pagination -->
                <div
                    class="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                    <div class="text-sm text-gray-500 order-2 sm:order-1">
                        Đang xem <span class="font-semibold text-gray-900 dark:text-white">{{ users.length }}</span>
                        trên tổng số <span class="font-semibold text-gray-900 dark:text-white">{{ total }}</span> thành
                        viên
                    </div>
                    <UPagination v-model:page="page" :total="total" :items-per-page="perPage" show-edges
                        class="order-1 sm:order-2" />
                </div>
            </UCard>
        </div>
    </UDashboardPanel>
</template>
