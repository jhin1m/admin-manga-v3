# System Architecture - Admin Manga v3

**Last Updated**: 2025-12-22 | **Phase**: Phase 06 - Admin Dashboard

## Architecture Overview

Admin Manga v3 uses a layered client-side architecture with Nuxt 4 as the meta-framework. The application separates concerns into layouts, pages, components, and composables.

```
┌─────────────────────────────────────────────────────┐
│                  Browser / Client                    │
├─────────────────────────────────────────────────────┤
│  Nuxt 4 (Meta-framework)                            │
│  ├─ Vue 3 (UI Framework)                            │
│  │  └─ Tailwind CSS (Styling)                       │
│  └─ Nuxt UI v4 (Component Library)                  │
│     └─ Radix UI + Iconify (Primitives + Icons)      │
├─────────────────────────────────────────────────────┤
│  Application Layer                                  │
│  ├─ Layouts (app/layouts/)                          │
│  ├─ Pages (app/pages/)                              │
│  ├─ Components (app/components/)                    │
│  ├─ Config (app/config/)                            │
│  ├─ Composables (app/composables/)                  │
│  └─ Utils (app/utils/)                              │
├─────────────────────────────────────────────────────┤
│  State Management                                   │
│  └─ Nuxt useState() (Server-friendly reactive)      │
├─────────────────────────────────────────────────────┤
│  Form Validation                                    │
│  └─ Zod                                             │
├─────────────────────────────────────────────────────┤
│  Testing Infrastructure                             │
│  └─ Vitest + @nuxt/test-utils                       │
├─────────────────────────────────────────────────────┤
│  HTTP Client                                        │
│  └─ $fetch (Nuxt built-in, replaces axios)         │
├─────────────────────────────────────────────────────┤
│  Backend APIs (Laravel)                             │
│  └─ http://127.0.0.1:8000/api/admin                │
└─────────────────────────────────────────────────────┘
```

---

## Form Architecture (Phase 03)

### Decision: Schema-driven Validation

**Problem**: Manual validation is error-prone, hard to type-safe, and difficult to maintain.

**Solution**: Use **Zod** for schema definition and Nuxt UI's `<UForm>` for rendering.
- Defined schemas provide compile-time and runtime type safety
- Automatic error message mapping to UI components
- Clean separation of validation logic from component state

### Data Flow (Login Form)

```
User Input → Reactive State (reactive)
                 ↓
      UForm @submit event
                 ↓
      Zod Schema Validation
                 ↓
      (If Success) → auth.login(data)
                 ↓
      (If Success) → navigateTo('/')
```

---

## Testing Architecture (Phase 03)

### Strategy: Nuxt-integrated Testing

**Framework**: Vitest
**Environment**: `nuxt` (via `@nuxt/test-utils`)

#### Features:
- **mountSuspended**: Renders components within a Nuxt runtime, supporting auto-imports and Nuxt-specific components
- **Mocking**: Global mocks for Nuxt/Vue globals (localStorage, navigateTo)
- **Coverage**: V8-based coverage for the `app/` directory

---

## Layout System (Phase 06 Update)

### Architecture Decision: Dashboard Sidebar Layout

**Problem**: Previous header/footer layout was too simplistic for a management app with many navigation links.

**Solution**: Implement a professional dashboard layout using Nuxt UI v4 components.
- **UDashboardGroup**: Main container for dashboard elements.
- **UDashboardSidebar**: Left-aligned, collapsible, and resizable navigation area.
- **UDashboardPanel**: Main content area where pages are rendered.

### Implemented Layouts

#### default.vue (Dashboard Layout)
**Used by**: All admin pages (Dashboard, Manga Management, etc.)
**Structure**:
```
UApp (Global Provider)
└── UDashboardGroup
    ├── UDashboardSidebar (Left Sidebar)
    │   ├── Header (Logo + Title)
    │   ├── Body (UNavigationMenu)
    │   └── Footer (User Name + Theme Toggle + Logout)
    └── UDashboardPanel (Main Content)
        └── <slot /> (Page content)
```

**Features**:
- **Centralized Config**: Navigation items are managed in `app/config/navigation.ts`.
- **Keyboard Shortcut**: `C` key toggles sidebar state.
- **Stateful**: `collapsed` state managed via `ref` and persisted/synced with UI.
- **Theme-aware**: Integrated `UColorModeButton` for dark mode.

#### auth.vue (Minimal Layout)
**Used by**: Login page
**Structure**:
```
UApp (Global Provider)
└── UMain (Centered Layout)
    └── <slot /> (Login form)
```

---

## Component Architecture

### Component Hierarchy

```
app.vue (Root)
└── NuxtLayout (dynamic layout wrapper)
    ├── UDashboardSidebar (if default layout)
    │   ├── AppLogo
    │   └── UNavigationMenu
    └── UDashboardPanel
        └── NuxtPage (resolved page)
            └── Page-specific components (e.g., StatCard)
```

### Component Categories

1. **Layout Components** (`app/layouts/`)
   - Wrapper templates for routes
   - Contain header/footer/navigation
   - Use slot for page content

2. **Page Components** (`app/pages/`)
   - Full page routes
   - Control layout via `definePageMeta`
   - Contain page-specific logic

3. **Reusable Components** (`app/components/`)
   - `AppLogo` - Branding
   - `dashboard/StatCard` - Dashboard statistics card
   - Other UI building blocks

4. **Nuxt UI Components** (global)
   - `UApp`, `UDashboardSidebar`, `UDashboardPanel`
   - `UButton`, `UCard`, `UInput`, `UTable`
   - Theme-aware, dark mode support

---

## State Management Architecture

### State Pattern (Phase 05)

Uses Nuxt `useState()` composable for simplicity:

```
┌─────────────────────────────────┐
│ useAuth() Composable            │
├─────────────────────────────────┤
│ State:                          │
│  - user (user object or null)   │
│  - token (JWT or null)          │
│  - isLoading (boolean)          │
├─────────────────────────────────┤
│ Computed:                       │
│  - isAuthenticated              │
├─────────────────────────────────┤
│ Methods:                        │
│  - logout()                     │
└─────────────────────────────────┘
```

### Storage Strategy (Phase 01 & 05)

- **In-memory**: `useState()` (fast, lost on refresh)
- **localStorage**: Token persistence (client-only, manual sync needed)
- **Runtime Config**: Environment-specific settings (API URL)

---

## Routing Architecture

### File-based Routing Structure

```
app/pages/
├── index.vue               → GET /          (default layout, auth protected)
├── login.vue               → GET /login     (auth layout, guest only)
```

### Route-to-Layout Mapping

| Route | Page File | Layout | Middleware | Purpose |
|-------|-----------|--------|------------|---------|
| `/` | `index.vue` | default | `auth.global` | Admin dashboard |
| `/login` | `login.vue` | auth | `guest` | Login page |

---

## Styling Architecture

### Tailwind CSS Approach

**Utility-first CSS**:
```vue
<div class="flex items-center justify-center min-h-screen px-4">
  <UCard class="w-full max-w-md">...</UCard>
</div>
```

**Dark Mode Support**:
```vue
<UDashboardSidebar class="bg-gray-50 dark:bg-gray-900">
  <!-- Light: gray-50, Dark: gray-900 -->
</UDashboardSidebar>
```

### Nuxt UI Theme Configuration

**Color Palette** (`app.config.ts`):
- `primary: 'green'` - Primary action color
- `neutral: 'slate'` - Neutral/secondary color

---

## Data Flow

### API Integration Flow (Phase 01)

```
Component / Composable
  ↓
useApi() utility (app/utils/api.ts)
  ↓
$fetch.create() (reusable client)
  ↓
baseURL: runtimeConfig.public.apiBase
  ↓
Backend API
```

---

## Key Architectural Decisions

### 1. Nuxt 4 `app/` Directory Structure
**Why**: Modern Nuxt 4 convention, cleaner organization.

### 2. Dashboard Sidebar Layout (Phase 06)
**Why**: Professional management UI, scalable navigation, resizable/collapsible.

### 3. useState() for State Management
**Why**: Nuxt-native, server-friendly, simple.

### 4. Nuxt UI Component Library
**Why**: Pre-built accessible components, Tailwind-integrated, dark mode out-of-box.

---

## Security Architecture

### Current Measures (Phase 01-06)

1. **XSS Prevention**: Nuxt template auto-escaping + Nuxt UI sanitization
2. **Token Storage**: localStorage (client-side only)
3. **Auth Check**: Server-side conditional + Client-side localStorage check in middleware (Phase 04)
4. **Route Protection**: Global auth middleware + Guest middleware (Phase 04)

---

## Related Documentation
- [codebase-summary.md](./codebase-summary.md) - Directory structure & overview
- [code-standards.md](./code-standards.md) - Code style & patterns
- [project-overview-pdr.md](./project-overview-pdr.md) - Requirements & PDR
- [API_ADMIN_DOCUMENTATION.md](./API_ADMIN_DOCUMENTATION.md) - Backend API reference
- [CLAUDE.md](../CLAUDE.md) - Project guidelines & workflows
