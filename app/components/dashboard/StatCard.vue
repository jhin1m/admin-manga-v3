<script setup lang="ts">
interface Props {
  label: string
  value: number
  icon?: string
  loading?: boolean
}

defineProps<Props>()
</script>

<template>
  <div class="flex flex-col gap-1">
    <span class="text-sm text-muted">{{ label }}</span>
    <USkeleton
      v-if="loading"
      class="h-8 w-24"
    />
    <span
      v-else
      class="text-2xl font-semibold"
    >
      {{ value.toLocaleString() }}
    </span>
  </div>
</template>
