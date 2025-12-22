<script setup lang="ts">
const stats = useStatistics()

onMounted(() => {
  stats.fetchStats()
})

const cards = computed(() => [
  { label: 'Thành viên', value: stats.stats.value?.total_users ?? 0, icon: 'i-lucide-users' },
  { label: 'Tập truyện', value: stats.stats.value?.total_mangas ?? 0, icon: 'i-lucide-book-open' },
  { label: 'Chương truyện', value: stats.stats.value?.total_chapters ?? 0, icon: 'i-lucide-layers' },
  { label: 'Bạn đồng hành', value: stats.stats.value?.total_pets ?? 0, icon: 'i-lucide-heart' }
])
</script>

<template>
  <UContainer>
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
        <StatCard
          v-for="card in cards"
          :key="card.label"
          :label="card.label"
          :value="card.value"
          :icon="card.icon"
          :loading="stats.isLoading.value"
        />
      </div>
    </UCard>
  </UContainer>
</template>
