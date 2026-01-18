<script setup lang="ts">
import type { MangaFormData } from '~/composables/use-manga'

const router = useRouter()
const toast = useToast()
const { createManga } = useManga()

const isCreating = ref(false)

async function handleSubmit(data: MangaFormData) {
  isCreating.value = true
  try {
    await createManga(data)
    toast.add({
      title: 'Tạo truyện thành công',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
    router.push('/mangas')
  } catch (error: any) {
    console.error('Create manga error:', error)
    const message = error.data?.message || error.message || 'Tạo truyện thất bại'
    toast.add({
      title: 'Lỗi',
      description: message,
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  } finally {
    isCreating.value = false
  }
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar
        title="Thêm truyện mới"
        icon="i-lucide-plus-circle"
      >
        <template #leading>
          <UButton
            icon="i-lucide-arrow-left"
            variant="ghost"
            color="neutral"
            @click="router.back()"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="mx-auto w-full">
        <MangaForm @submit="handleSubmit" />
      </div>
    </template>
  </UDashboardPanel>
</template>
