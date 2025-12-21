# Phase 05: Layout Separation

## Context
- **Parent:** [plan.md](./plan.md)
- **Dependencies:** Phase 03, Phase 04
- **Docs:** [Nuxt Layouts](https://nuxt.com/docs/guide/directory-structure/layouts)

## Overview
| Field | Value |
|-------|-------|
| Date | 2025-12-21 |
| Priority | Medium |
| Status | ✅ Done (2025-12-21 21:12:00) |
| Review | ✅ Reviewed (2025-12-21 21:12:00) |

Refactor app.vue to use layouts, separating admin layout from auth layout.

## Key Insights
- Nuxt 4 supports layouts in `app/layouts/`
- Default layout applied to all pages unless specified
- Auth layout = minimal (no header/footer)
- Default layout = full admin chrome (header, sidebar, footer)

## Requirements
1. Move current app.vue content to default layout
2. Create minimal auth layout for login
3. Update app.vue to use NuxtLayout
4. Add logout button to header

## Architecture
```
app/
├── app.vue              # Minimal wrapper with NuxtLayout
├── layouts/
│   ├── default.vue      # Full admin layout (header, main, footer)
│   └── auth.vue         # Minimal layout (centered content)
└── pages/
    └── login.vue        # Uses auth layout
```

## Related Files
- `app/app.vue` - Simplify to NuxtLayout wrapper
- `app/layouts/default.vue` - Admin layout with header/footer
- `app/layouts/auth.vue` - Minimal auth layout

## Implementation Steps

### Step 1: Create app/layouts/default.vue
Move content from app.vue, add logout button:
```vue
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
        <span v-if="auth.user.value" class="text-sm text-muted">
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
```

### Step 2: Create app/layouts/auth.vue
```vue
<template>
  <UApp>
    <UMain class="bg-gray-50 dark:bg-gray-950">
      <slot />
    </UMain>
  </UApp>
</template>
```

### Step 3: Simplify app/app.vue
```vue
<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'vi'
  }
})

useSeoMeta({
  title: 'Admin Manga',
  description: 'Manga management admin panel'
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

## Todo List
- [x] Create layouts/default.vue
- [x] Create layouts/auth.vue
- [x] Simplify app.vue
- [x] Add logout button to header
- [x] Verify login page uses auth layout

## Success Criteria
- [x] Login page shows minimal layout (no header/footer)
- [x] Dashboard pages show full admin layout
- [x] Logout button visible in header
- [x] User name displayed in header

## Risk Assessment
| Risk | Mitigation |
|------|------------|
| Layout flash on navigation | Nuxt handles layout transitions |

## Security Considerations
- Logout button easily accessible
- User context visible in header

## Next Steps
- Test complete auth flow
- Add dashboard content
- Implement remaining CRUD features
