<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { User } from '~/types/user'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { fetchUser, updateUser } = useUsers()

const userId = route.params.id as string

const { data: response, status, refresh } = await useAsyncData(
    `user-${userId}`,
    () => fetchUser(userId)
)

const user = computed(() => response.value?.data)
const isLoading = computed(() => status.value === 'pending')

const schema = z.object({
    name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
    email: z.string().email('Email không hợp lệ'),
    total_points: z.number().min(0),
    level: z.number().min(1)
})

type Schema = z.output<typeof schema>

const state = reactive({
    name: '',
    email: '',
    total_points: 0,
    level: 1
})

// Sync state when user data is loaded
watch(user, (newUser) => {
    if (newUser) {
        state.name = newUser.name
        state.email = newUser.email
        state.total_points = newUser.total_points
        state.level = newUser.level
    }
}, { immediate: true })

const isUpdating = ref(false)

async function onSubmit(event: FormSubmitEvent<Schema>) {
    isUpdating.value = true
    try {
        await updateUser(userId, event.data)
        toast.add({ title: 'Cập nhật thành công', color: 'success' })
        refresh()
    } catch (error: any) {
        toast.add({ title: error.message || 'Cập nhật thất bại', color: 'error' })
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
            <UDashboardNavbar title="Chi tiết người dùng">
                <template #leading>
                    <UButton icon="i-lucide-arrow-left" variant="ghost" color="neutral" @click="router.back()" />
                </template>
                <template #right>
                    <UButton v-if="user" icon="i-lucide-external-link" label="Xem trên web" variant="ghost"
                        color="neutral" />
                </template>
            </UDashboardNavbar>
        </template>

        <div v-if="isLoading && !user" class="flex items-center justify-center p-12">
            <UIcon name="i-lucide-loader-2" class="w-10 h-10 animate-spin text-primary" />
        </div>

        <div v-else-if="user" class="p-4 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Left Column: Profile Card -->
                <div class="lg:col-span-1 flex flex-col gap-8">
                    <UCard :ui="{ body: { padding: 'p-0' } }"
                        class="overflow-hidden border-gray-200 dark:border-gray-800 shadow-sm">
                        <div class="relative h-24 bg-gradient-to-r from-primary-500 to-indigo-600"></div>
                        <div class="px-6 pb-6 pt-0 flex flex-col items-center">
                            <div class="relative -mt-12 mb-4">
                                <UAvatar :src="user.avatar_full_url" :alt="user.name" size="3xl"
                                    class="ring-4 ring-white dark:ring-gray-900 shadow-xl" />
                                <div
                                    class="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full">
                                </div>
                            </div>

                            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ user.name }}</h2>
                            <div
                                class="flex items-center gap-2 mt-1 py-1 px-3 rounded-full bg-gray-100 dark:bg-gray-800 text-sm text-gray-500">
                                <UIcon name="i-lucide-mail" class="w-4 h-4" />
                                <span>{{ user.email }}</span>
                            </div>

                            <div class="mt-8 w-full grid grid-cols-2 gap-4">
                                <div class="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center">
                                    <span class="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Cấp
                                        độ</span>
                                    <span class="mt-1 text-2xl font-black text-primary">{{ user.level }}</span>
                                </div>
                                <div class="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center">
                                    <span
                                        class="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Exp</span>
                                    <span class="mt-1 text-2xl font-black text-indigo-500">{{ user.exp }}</span>
                                </div>
                            </div>
                        </div>

                        <template #footer>
                            <div class="space-y-4">
                                <div class="flex flex-col gap-1">
                                    <span class="text-[10px] uppercase font-bold text-gray-400 tracking-widest">ID Hệ
                                        Thống</span>
                                    <div
                                        class="flex items-center gap-2 p-2 rounded bg-gray-100 dark:bg-gray-800 font-mono text-[10px] text-gray-600 dark:text-gray-300">
                                        <span class="truncate flex-1">{{ user.id }}</span>
                                        <UButton icon="i-lucide-copy" variant="ghost" size="xs" color="neutral" />
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 gap-3">
                                    <div class="flex items-center justify-between text-xs">
                                        <span class="text-gray-500">Ngày tham gia</span>
                                        <span class="font-medium">{{ formatDate(user.created_at) }}</span>
                                    </div>
                                    <div class="flex items-center justify-between text-xs">
                                        <span class="text-gray-500">Hoạt động cuối</span>
                                        <span class="font-medium">{{ formatDate(user.updated_at) }}</span>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </UCard>

                    <!-- Points Breakdown -->
                    <UCard title="Kinh tế" :ui="{ header: { padding: 'px-6 py-4' } }"
                        class="border-gray-200 dark:border-gray-800 shadow-sm">
                        <div class="space-y-6">
                            <div>
                                <div class="flex justify-between items-end mb-2">
                                    <span class="text-sm font-medium text-gray-500">Tổng điểm tích lũy</span>
                                    <span class="text-xl font-bold text-yellow-500">{{ user.total_points }}</span>
                                </div>
                                <UMeter :value="100" color="yellow" size="sm" />
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div class="flex flex-col gap-1">
                                    <span class="text-xs text-gray-500">Đã tiêu xài</span>
                                    <span class="font-bold text-orange-500">{{ user.used_points }}</span>
                                </div>
                                <div class="flex flex-col gap-1">
                                    <span class="text-xs text-gray-500">Thành tựu</span>
                                    <span class="font-bold text-blue-500">{{ user.achievements_points }}</span>
                                </div>
                            </div>
                        </div>
                    </UCard>
                </div>

                <!-- Right Column: Forms & Controls -->
                <div class="lg:col-span-2 flex flex-col gap-8">
                    <UCard title="Cài đặt thông tin" :ui="{ header: { padding: 'px-6 py-4' } }"
                        class="border-gray-200 dark:border-gray-800 shadow-sm">
                        <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-8">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <UFormField label="Tên người dùng" name="name" required
                                    description="Tên chính thức hiển thị trên website.">
                                    <UInput v-model="state.name" placeholder="Họ và tên" size="md"
                                        icon="i-lucide-user" />
                                </UFormField>

                                <UFormField label="Địa chỉ Email" name="email" required
                                    description="Email dùng để đăng nhập và nhận thông báo.">
                                    <UInput v-model="state.email" placeholder="example@gmail.com" size="md"
                                        icon="i-lucide-mail" />
                                </UFormField>

                                <UFormField label="Tổng điểm" name="total_points" required>
                                    <UInput v-model="state.total_points" type="number" size="md" icon="i-lucide-gem" />
                                </UFormField>

                                <UFormField label="Cấp độ hiện tại" name="level" required>
                                    <UInput v-model="state.level" type="number" size="md" icon="i-lucide-trending-up" />
                                </UFormField>
                            </div>

                            <div class="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
                                <UButton type="button" label="Tải lại dữ liệu" color="neutral" variant="ghost"
                                    @click="refresh()" />
                                <UButton type="submit" label="Lưu tất cả thay đổi" color="primary" size="md"
                                    :loading="isUpdating" block class="md:w-auto" />
                            </div>
                        </UForm>
                    </UCard>

                    <!-- Security & Management -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <UCard title="Vai trò & Quyền hạn" class="border-gray-200 dark:border-gray-800 shadow-sm">
                            <div class="flex flex-wrap gap-2">
                                <UBadge v-for="role in user.roles || ['Member']" :key="role" color="primary"
                                    variant="solid">
                                    {{ role }}
                                </UBadge>
                                <UButton icon="i-lucide-plus" size="xs" variant="ghost" color="neutral" />
                            </div>
                        </UCard>

                        <UCard class="border-red-200 dark:border-red-900/30 bg-red-50/30 dark:bg-red-950/10 shadow-sm">
                            <template #header>
                                <h3 class="text-red-500 font-bold flex items-center gap-2">
                                    <UIcon name="i-lucide-alert-triangle" />
                                    Khu vực nguy hiểm
                                </h3>
                            </template>
                            <p class="text-xs text-gray-500 mb-4">Việc cấm tài khoản sẽ khiến người dùng không thể truy
                                cập hệ
                                thống ngay lập tức.</p>
                            <UButton label="Cấm người dùng này" color="error" variant="outline" icon="i-lucide-ban"
                                block />
                        </UCard>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="flex flex-col items-center justify-center p-24 text-center">
            <div class="p-4 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <UIcon name="i-lucide-user-x" class="w-12 h-12 text-gray-400" />
            </div>
            <h3 class="text-xl font-bold">Không tìm thấy người dùng</h3>
            <p class="text-gray-500 mt-2 max-w-xs">Tài khoản này có thể đã bị xóa hoặc ID không chính xác.</p>
            <UButton label="Quay lại danh sách" variant="link" color="primary" class="mt-4"
                @click="router.push('/users')" />
        </div>
    </UDashboardPanel>
</template>
