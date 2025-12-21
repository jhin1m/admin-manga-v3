<script setup lang="ts">
const auth = useAuth()
</script>

<template>
  <UApp>
    <UHeader>
      <template #left>
        <NuxtLink to="/">
          <AppLogo class="w-auto h-6 shrink-0" />
        </NuxtLink>
      </template>

      <template #right>
        <span
          v-if="auth.user.value"
          class="text-sm text-muted"
        >
          {{ auth.user.value.name }}
        </span>

        <UColorModeButton />

        <UButton
          icon="i-lucide-log-out"
          color="neutral"
          variant="ghost"
          aria-label="Logout"
          @click="auth.logout()"
        />
      </template>
    </UHeader>

    <UMain>
      <slot />
    </UMain>

    <USeparator />

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          Admin Manga v3 • © {{ new Date().getFullYear() }}
        </p>
      </template>
    </UFooter>
  </UApp>
</template>
