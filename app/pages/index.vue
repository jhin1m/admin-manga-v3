<script setup lang="ts">
const stats = useStatistics()

onMounted(() => {
  stats.fetchStats()
})

const cards = computed(() => [
  { label: 'Thành viên', value: stats.stats.value?.user_count ?? 0, icon: 'i-lucide-users' },
  { label: 'Tập truyện', value: stats.stats.value?.manga_count ?? 0, icon: 'i-lucide-book-open' },
  { label: 'Chương truyện', value: stats.stats.value?.chapter_count ?? 0, icon: 'i-lucide-layers' },
  { label: 'Bạn đồng hành', value: stats.stats.value?.pet_count ?? 0, icon: 'i-lucide-heart' }
])
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Welcome Header -->
    <div class="m-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Chào mừng quay trở lại!
      </h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Tổng quan hệ thống của bạn
      </p>
    </div>

    <!-- Stats Card -->
    <UCard>
      <template #header>
        <h2 class="font-semibold">
          Thông tin chung
        </h2>
      </template>

      <div
        v-if="stats.error.value"
        class="text-red-500"
      >
        {{ stats.error.value }}
      </div>

      <div
        v-else
        class="grid grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <DashboardStatCard
          v-for="card in cards"
          :key="card.label"
          :label="card.label"
          :value="card.value"
          :icon="card.icon"
          :loading="stats.isLoading.value"
        />
      </div>
    </UCard>
  </div>
</template>
