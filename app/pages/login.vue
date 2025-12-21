<script setup lang="ts">
// Minimal login page stub for Phase 05 testing
// Full implementation in Phase 03
definePageMeta({
  layout: 'auth'
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold">
            Admin Login
          </h1>
          <p class="text-sm text-muted mt-1">
            Sign in to manage your manga
          </p>
        </div>
      </template>

      <div class="space-y-4">
        <p class="text-sm text-muted text-center">
          Login page stub - Full implementation in Phase 03
        </p>
      </div>
    </UCard>
  </div>
</template>
