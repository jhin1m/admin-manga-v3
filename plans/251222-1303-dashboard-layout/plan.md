# Dashboard Layout with Sidebar Navigation

**Date**: 2025-12-22
**Status**: DONE (2025-12-22 13:45:00)
**Complexity**: Medium

## Overview

Transform current header/footer layout to dashboard layout with collapsible left sidebar navigation using Nuxt UI v4 dashboard components.

## Current State

```
app/layouts/default.vue
├── UApp
│   ├── UHeader (top bar with logo, user info, logout)
│   ├── UMain (page content)
│   └── UFooter (copyright)
```

## Target State

```
app/layouts/default.vue
├── UApp
│   └── UDashboardGroup
│       ├── UDashboardSidebar (collapsible left nav)
│       │   ├── header slot (logo)
│       │   ├── default slot (UNavigationMenu)
│       │   └── footer slot (user info, theme toggle, logout)
│       └── UDashboardPanel (main content area)
│           └── slot (page content)
```

## Implementation

### Phase 1: Navigation Configuration ✅ DONE (2025-12-22)

**File**: `app/config/navigation.ts`

```ts
export interface NavItem {
  label: string
  icon: string
  to?: string
  children?: NavItem[]
}

export const navigationItems: NavItem[] = [
  {
    label: 'Dashboard',
    icon: 'i-lucide-layout-dashboard',
    to: '/'
  },
  {
    label: 'Quản lý truyện',
    icon: 'i-lucide-book-open',
    children: [
      { label: 'Danh sách', icon: 'i-lucide-list', to: '/manga' },
      { label: 'Thêm mới', icon: 'i-lucide-plus', to: '/manga/create' }
    ]
  },
  {
    label: 'Quản lý người dùng',
    icon: 'i-lucide-users',
    to: '/users'
  },
  {
    label: 'Cài đặt',
    icon: 'i-lucide-settings',
    to: '/settings'
  }
]
```

### Phase 2: Layout Transformation ✅ DONE (2025-12-22)

**File**: `app/layouts/default.vue`

```vue
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
        class="bg-gray-50 dark:bg-gray-900"
      >
        <!-- Logo -->
        <template #header>
          <NuxtLink to="/" class="flex items-center gap-2 p-4">
            <AppLogo class="w-auto h-6 shrink-0" />
            <span v-if="!collapsed" class="font-semibold">
              Admin Manga
            </span>
          </NuxtLink>
        </template>

        <!-- Navigation Menu -->
        <UNavigationMenu
          :items="navigationItems"
          :collapsed="collapsed"
          orientation="vertical"
          :highlight="true"
          class="flex-1"
        />

        <!-- Footer: User Info + Actions -->
        <template #footer>
          <div class="p-4 border-t border-gray-200 dark:border-gray-800">
            <div v-if="!collapsed && auth.user.value" class="mb-2 text-sm truncate">
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
```

### Phase 3: Page Adjustments ✅ DONE (2025-12-22)

Remove `UContainer` wrapper from pages since `UDashboardPanel` handles content area.

**File**: `app/pages/index.vue` (example adjustment)

```vue
<template>
  <!-- Remove outer UContainer if panel provides padding -->
  <div class="p-6">
    <UCard>
      <!-- existing content -->
    </UCard>
  </div>
</template>
```

## Files to Modify

| File | Action | Description |
|------|--------|-------------|
| `app/config/navigation.ts` | Create | Navigation items config |
| `app/layouts/default.vue` | Modify | Replace with dashboard layout |
| `app/pages/index.vue` | Modify | Adjust container/padding |

## Dependencies

No new dependencies. Uses existing Nuxt UI v4 components:
- `UDashboardGroup`
- `UDashboardSidebar`
- `UDashboardPanel`
- `UNavigationMenu`

## Testing Checklist

- [x] Sidebar collapses/expands correctly
- [x] Keyboard shortcut (C) toggles sidebar
- [x] Navigation items highlight active route
- [x] User info displays in sidebar footer
- [x] Logout works from sidebar
- [x] Dark mode toggle works
- [x] Responsive: sidebar becomes slideover on mobile
- [x] Auth middleware still protects routes

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Breaking existing auth flow | Keep useAuth() usage unchanged |
| Mobile responsiveness issues | DashboardSidebar has built-in mobile mode |
| Navigation state persistence | DashboardGroup uses cookie storage by default |

## Estimated Effort

Single implementation phase, straightforward component replacement.
