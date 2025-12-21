# Code Standards - Admin Manga v3

**Last Updated**: 2025-12-21 | **Reference**: CLAUDE.md + Phase 02 Implementation

## Code Style Rules

### Formatting
- **No trailing commas**: `commaDangle: 'never'`
  ```ts
  // ✓ Correct
  const obj = {
    a: 1,
    b: 2
  }

  // ✗ Incorrect
  const obj = {
    a: 1,
    b: 2,  // <-- trailing comma not allowed
  }
  ```

- **1TBS Brace Style**: `braceStyle: '1tbs'`
  ```ts
  // ✓ Correct
  if (condition) {
    // code
  }

  // ✗ Incorrect
  if (condition)
  {
    // code
  }
  ```

### TypeScript
- **Use `<script setup lang="ts">`** in all Vue components
- Prefer explicit type annotations for public APIs
- Use Nuxt-generated tsconfig references (`.nuxt/tsconfig.*.json`)

### File Naming
- Components: PascalCase (e.g., `AppLogo.vue`, `UButton`)
- Pages: lowercase with hyphens (e.g., `login.vue`, `manga-detail.vue`)
- Layouts: lowercase (e.g., `default.vue`, `auth.vue`)
- Composables: `use-` prefix in kebab-case (e.g., `use-auth.ts`)
- Utils: lowercase with hyphens (e.g., `api-client.ts`)

---

## API Integration Pattern (Phase 01)

### API Client Utility (`app/utils/api.ts`)
```ts
export interface ApiResponse<T> {
  success: boolean
  data: T
  code: number
}

export function useApi() {
  const config = useRuntimeConfig()
  return $fetch.create({
    baseURL: config.public.apiBase,
    onResponseError({ response }) {
      const error = response._data as ApiError
      if (error?.message) {
        console.error('API Error:', error.message)
      }
    }
  })
}
```

### Usage in Components/Composables
```vue
<script setup lang="ts">
const api = useApi()

const fetchData = async () => {
  const response = await api<ApiResponse<Manga[]>>('/mangas')
  if (response.success) {
    // ...
  }
}
</script>
```

---

## Vue Component Patterns

### Script Setup Syntax
All Vue components use `<script setup>` with TypeScript:

```vue
<script setup lang="ts">
// Import only if not auto-imported
// Most composables/utilities are auto-imported

const isVisible = ref(false)
const count = computed(() => items.value.length)

const handleClick = () => {
  isVisible.value = !isVisible.value
}
</script>

<template>
  <div>
    <button @click="handleClick">Toggle</button>
  </div>
</template>
```

### Layout Definition
Pages specify layout via `definePageMeta`:

```vue
<script setup lang="ts">
// Use default layout (implicit)
// No definePageMeta needed for default.vue

// OR specify custom layout
definePageMeta({
  layout: 'auth'  // uses app/layouts/auth.vue
})
</script>
```

### Component Organization
1. **Script block** - Logic first
2. **Template block** - Structure
3. Optional **style block** (prefer Tailwind)

---

## Auto-imports Reference

### Nuxt Auto-imported Composables
No need to import - use directly:
- State: `useState(key, defaultValue)`
- Navigation: `navigateTo(path)`
- Head: `useHead(config)`, `useSeoMeta(config)`
- Routing: `useRouter()`, `useRoute()`
- Router link: `<NuxtLink>`
- Layout: `<NuxtLayout>`, `<NuxtPage />`
- Meta: `definePageMeta(config)`

### Vue Auto-imported
- Reactivity: `ref()`, `computed()`, `reactive()`, `watch()`
- Lifecycle: `onMounted()`, `onBeforeUnmount()`
- Utilities: `getCurrentInstance()`

### Project Auto-imported
- Composables from `app/composables/`:
  - `useAuth()` - Auth state management
- Components from `app/components/`:
  - `AppLogo`, `TemplateMenu`, etc.
- Nuxt UI components:
  - `UApp`, `UHeader`, `UMain`, `UFooter`, `UButton`, `UCard`, etc.

---

## Nuxt UI Component Usage

### Common Components
- `<UApp>` - Main container
- `<UHeader>` - Top navigation bar
- `<UMain>` - Content area
- `<UFooter>` - Bottom footer
- `<UButton>` - Interactive button
- `<UCard>` - Card container
- `<UColorModeButton>` - Dark mode toggle
- `<UInput>` - Form input
- `<USelect>` - Dropdown select
- `<UTable>` - Data table
- `<USeparator>` - Divider line

### Styling Components
- Use Tailwind CSS utility classes
- Nuxt UI components accept `class` prop
- Theme colors: `primary` (green), `neutral` (slate)
- Support dark mode via `dark:` prefix

### Icon Usage
Iconify format: `i-{collection}-{icon}`
- Lucide icons: `i-lucide-menu`, `i-lucide-log-out`, `i-lucide-search`
- Simple Icons: `i-simple-icons-github`, `i-simple-icons-nuxt`

```vue
<UButton icon="i-lucide-menu">Menu</UButton>
<UButton icon="i-lucide-log-out" />
```

---

## Layout System (Phase 05+)

### Naming Convention
- `default.vue` - Main admin layout (header/footer)
- `auth.vue` - Authentication layout (minimal)
- Custom layouts follow layout name in `definePageMeta`

### Layout Implementation
```vue
<!-- app/layouts/default.vue -->
<template>
  <UApp>
    <UHeader><!-- Header content --></UHeader>
    <UMain>
      <slot />  <!-- Page content injected here -->
    </UMain>
    <UFooter><!-- Footer content --></UFooter>
  </UApp>
</template>
```

### Page Using Layout
```vue
<!-- app/pages/protected-route.vue -->
<script setup lang="ts">
// Uses default layout implicitly (no need to specify)
</script>

<!-- OR -->

<script setup lang="ts">
definePageMeta({ layout: 'custom-layout' })
</script>
```

---

## Composables Pattern

### State Management (useAuth Example)
```ts
// app/composables/use-auth.ts
export const useAuth = () => {
  // State (using useState for SSR safety)
  const token = useState<string | null>('auth_token', () => null)
  const user = useState<User | null>('auth_user', () => null)
  const isLoading = useState('auth_loading', () => false)

  // Computed
  const isAuthenticated = computed(() => !!token.value)

  // Methods
  const login = async (credentials) => {
    // API call + token storage
  }

  const logout = () => {
    token.value = null
    user.value = null
    if (import.meta.client) {
      localStorage.removeItem('admin_token')
    }
    navigateTo('/login')
  }

  const init = () => {
    if (import.meta.client) {
      const stored = localStorage.getItem('admin_token')
      if (stored) token.value = stored
    }
  }

  return {
    token: readonly(token),
    user: readonly(user),
    isAuthenticated,
    login,
    logout,
    init
  }
}
```

### Client-side Check
Use `import.meta.client` to detect client environment:
```ts
if (import.meta.client) {
  localStorage.setItem('key', value)
}
```

---

## Routing Conventions

### File-based Routes
```
app/pages/
├── index.vue           → /
├── login.vue           → /login
├── about.vue           → /about
├── [id].vue            → /:id
└── admin/
    └── dashboard.vue   → /admin/dashboard
```

### Dynamic Routes
```ts
// Navigate with params
navigateTo(`/manga/${id}`)

// Access params in page
const route = useRoute()
const id = route.params.id
```

---

## API Integration Pattern

### Composable Example (Phase 02+)
```ts
// app/composables/use-api.ts
export const useApi = () => {
  const api = $fetch.create({
    baseURL: 'http://127.0.0.1:8000/api/admin'
  })

  const login = async (email: string, password: string) => {
    return api.post('/auth', { email, password })
  }

  return { api, login }
}
```

### Usage in Components
```vue
<script setup lang="ts">
const { login } = useApi()

const handleLogin = async () => {
  await login(email.value, password.value)
}
</script>
```

---

## Testing Conventions

### Unit Tests
- Test file: `*.test.ts` or `*.spec.ts`
- Location: Adjacent to source file or `tests/` directory
- Framework: Vitest (Nuxt default)

### Example
```ts
// app/composables/use-auth.test.ts
describe('useAuth', () => {
  it('should initialize with null user', () => {
    const { user } = useAuth()
    expect(user.value).toBeNull()
  })
})
```

---

## Security Patterns

### localStorage Usage
Only on client side:
```ts
if (import.meta.client) {
  localStorage.setItem('key', value)
  const value = localStorage.getItem('key')
}
```

### Auth Token Storage
- Store in localStorage (current: Phase 05 stub)
- Future: Consider httpOnly cookies (Phase 02)
- Clear on logout (implemented in useAuth)

### XSS Prevention
- Nuxt UI components auto-escape content
- Template expressions auto-escaped
- No v-html without sanitization

---

## Code Quality Checklist

Before committing:
- [ ] Run `pnpm lint` - pass all ESLint checks
- [ ] Run `pnpm typecheck` - no TypeScript errors
- [ ] No trailing commas in any files
- [ ] All files use 1TBS brace style
- [ ] Components use `<script setup lang="ts">`
- [ ] Auto-imported composables (no manual imports)
- [ ] Icons use correct Iconify format
- [ ] Layout defined if custom (via `definePageMeta`)
- [ ] Client-side code wrapped in `import.meta.client` checks
- [ ] No hardcoded API URLs (config-driven)

---

## Common Mistakes to Avoid

1. **Trailing commas** - ✗ Don't use at end of objects/arrays
2. **Manual imports** - ✗ Don't import auto-imported composables
3. **Brace style** - ✗ Don't put opening brace on new line
4. **localStorage without check** - ✗ Must use `import.meta.client`
5. **Missing layout definition** - ✗ Define if using custom layout
6. **Script without lang="ts"** - ✗ Always use TypeScript
7. **Hardcoded URLs** - ✗ Use config/environment variables

---

## Phase-specific Notes

**Phase 02 (Completed)**
- Full auth composable implemented
- Persistence in localStorage
- Client initialization plugin
- SSR-safe state management

**Phase 03 (Planned)**
- Login page UI
- Form validation
- Error handling

**Phase 04 (Planned)**
- Admin dashboard pages
- CRUD operations
- Data tables

---

## Useful Commands

```bash
# Development
pnpm dev           # Start dev server
pnpm build         # Build for production
pnpm preview       # Preview production build

# Code Quality
pnpm lint          # Run ESLint
pnpm typecheck     # TypeScript check

# Code Quality Combined
pnpm lint && pnpm typecheck  # Validate before commit
```

---

## Related Documentation
- [CLAUDE.md](../CLAUDE.md) - Project overview & package manager info
- [codebase-summary.md](./codebase-summary.md) - Architecture overview
- [system-architecture.md](./system-architecture.md) - Design decisions
- [API_ADMIN_DOCUMENTATION.md](./API_ADMIN_DOCUMENTATION.md) - Backend API reference
