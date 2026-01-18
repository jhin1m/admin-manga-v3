<script setup lang="ts">
import { navigationItems } from '~/config/navigation'

const auth = useAuth()
const collapsed = ref(false)

// Keyboard shortcut to toggle sidebar
defineShortcuts({
  c: () => collapsed.value = !collapsed.value
})
</script>

<template>
  <UApp>
    <UDashboardGroup>
      <!-- Left Sidebar -->
      <UDashboardSidebar
        v-model:collapsed="collapsed"
        collapsible
        resizable
      >
        <!-- Logo -->
        <template #header>
          <NuxtLink
            to="/"
            class="flex items-center gap-2 p-4"
          >
            <AppLogo class="w-auto h-6 shrink-0" />
            <span
              v-if="!collapsed"
              class="font-semibold"
            >
              Admin Manga
            </span>
          </NuxtLink>
        </template>

        <!-- Navigation Menu -->
        <div class="mt-6 flex-1">
          <UNavigationMenu
            :items="navigationItems"
            :collapsed="collapsed"
            orientation="vertical"
            :highlight="true"
          />
        </div>

        <!-- Footer: User Info + Actions -->
        <template #footer>
          <div class="p-4 border-t border-gray-200 dark:border-gray-800">
            <div
              v-if="!collapsed && auth.user.value"
              class="mb-2 text-sm truncate"
            >
              {{ auth.user.value.name }}
            </div>
            <div class="flex items-center gap-2">
              <UColorModeButton />
              <UButton
                icon="i-lucide-log-out"
                color="neutral"
                variant="ghost"
                :label="collapsed ? '' : 'Đăng xuất'"
                @click="auth.logout()"
              />
            </div>
          </div>
        </template>
      </UDashboardSidebar>

      <!-- Main Content Panel -->
      <UDashboardPanel>
        <slot />
      </UDashboardPanel>
    </UDashboardGroup>
  </UApp>
</template>
