# System Architecture - Admin Manga v3

**Last Updated**: 2025-12-21 | **Phase**: Phase 04 - Route Middleware

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

## Layout System (Phase 05)

### Architecture Decision: Multi-layout Approach

**Problem**: Need different UI structures for authenticated users vs. login flow
- Admin pages: header, footer, navigation, user info
- Auth pages: minimal, centered login card

**Solution**: Nuxt layouts pattern
- Each route can specify its layout
- Layouts are wrapper templates that `<slot>` page content
- Default layout if not specified

### Layout Flow

```
User Request → Router → Page selected → Layout selected
                                      ↓
                              Layout wrapper
                                      ↓
                              Page <slot>
                                      ↓
                              Rendered HTML
```

### Implemented Layouts

#### default.vue (Admin Layout)
**Used by**: Dashboard, admin pages (default)
**Structure**:
```
UApp (Container)
├── UHeader (Top bar)
│   ├── Logo + Home link
│   ├── User name (from auth.user)
│   ├── Dark mode toggle
│   └── Logout button (calls auth.logout())
├── UMain (Content area)
│   └── <slot /> (page content)
├── USeparator
└── UFooter (Bottom bar)
    └── Copyright notice
```

**Dependencies**: `useAuth()` composable for user state

#### auth.vue (Auth Layout)
**Used by**: Login page
**Structure**:
```
UApp (Container)
└── UMain (Centered, dark-themed)
    └── <slot /> (login form)
```

**Features**: Minimal, full-screen centered content, dark background for contrast

### Layout Selection Mechanism

**Implicit** (default layout):
```vue
<!-- app/pages/index.vue -->
<script setup lang="ts">
// No layout specified → uses default.vue
</script>
```

**Explicit** (custom layout):
```vue
<!-- app/pages/login.vue -->
<script setup lang="ts">
definePageMeta({
  layout: 'auth'  // Uses app/layouts/auth.vue
})
</script>
```

---

## Component Architecture

### Component Hierarchy

```
app.vue (Root)
└── NuxtLayout (dynamic layout wrapper)
    ├── UHeader (layout component)
    ├── UMain
    │   └── NuxtPage (resolved page)
    │       └── Page-specific components
    └── UFooter
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
   - `TemplateMenu` - Navigation menu
   - Other UI building blocks

4. **Nuxt UI Components** (global)
   - `UApp`, `UHeader`, `UMain`, `UFooter`
   - `UButton`, `UCard`, `UInput`, `UTable`
   - Theme-aware, dark mode support

### Component Design Principles

1. **Single Responsibility** - One purpose per component
2. **Composability** - Combine components via slots/props
3. **Reusability** - Avoid page-specific logic in generic components
4. **Accessibility** - Use Nuxt UI accessible primitives
5. **Consistency** - Match existing patterns and naming

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
         ↓
   Components consume
   (auto-imported)
```

### Storage Strategy (Phase 01 & 05)

- **In-memory**: `useState()` (fast, lost on refresh)
- **localStorage**: Token persistence (client-only, manual sync needed)
- **Runtime Config**: Environment-specific settings (API URL)
- **Future** (Phase 02): Implement refresh token rotation + httpOnly cookies

### Auth Composable Interface

```ts
const {
  user: Ref<{ name: string } | null>,
  token: Ref<string | null>,
  isLoading: Ref<boolean>,
  isAuthenticated: ComputedRef<boolean>,
  logout: () => void
} = useAuth()
```

---

## Routing Architecture

### File-based Routing Structure

```
app/pages/
├── index.vue               → GET /          (default layout, auth protected)
├── login.vue               → GET /login     (auth layout, guest only)
└── [id].vue                → GET /:id       (dynamic, default layout, auth protected)
```

### Route-to-Layout Mapping

| Route | Page File | Layout | Middleware | Purpose |
|-------|-----------|--------|------------|---------|
| `/` | `index.vue` | default | `auth.global` | Admin dashboard |
| `/login` | `login.vue` | auth | `guest` | Login page |
| Future: `/mangas` | `mangas.vue` | default | `auth.global` | Manga list |

### Navigation Flow

```
Start
 ↓
GET / (no auth)
 ↓
Middleware: auth.global detects no token
 ↓
Redirect to /login
 ↓
Layout: auth → Page: login.vue
 ↓
User logs in
 ↓
auth.token = JWT
 ↓
Navigate to GET /
 ↓
Display dashboard
 ↓
User logs out
 ↓
auth.logout() clears state + navigates to /login
```

### Route Protection (Implemented Phase 04)

The application uses a hybrid approach for route protection to handle Nuxt's SSR and hydration phases correctly:

1. **Global Auth Guard** (`app/middleware/auth.global.ts`):
   - Protects all routes by default.
   - Skips check for `/login`.
   - On **Client**: Checks `localStorage` directly for `admin_token` to prevent navigation flashes during hydration.
   - On **Server**: Checks `useAuth()` state.

2. **Guest Guard** (`app/middleware/guest.ts`):
   - Applied to `/login` via `definePageMeta`.
   - Redirects authenticated users back to the dashboard.

3. **Logic Separation for Testing**:
   - Middleware logic is exported as pure functions (`authMiddlewareLogic`, `guestMiddlewareLogic`) to allow unit testing without a full Nuxt context.

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
<UMain class="bg-gray-50 dark:bg-gray-950">
  <!-- Light: gray-50, Dark: gray-950 -->
</UMain>
```

### Nuxt UI Theme Configuration

**Color Palette** (`app.config.ts`):
- `primary: 'green'` - Primary action color
- `neutral: 'slate'` - Neutral/secondary color

### Global Styles

**Location**: `app/assets/css/main.css`
- Import global Tailwind directives
- Custom utility classes
- Animation definitions (future)

### Component Styling Strategy

1. Use Nuxt UI components (already themed)
2. Add Tailwind utilities for custom spacing/sizing
3. Dark mode via `dark:` prefix
4. No scoped CSS (prefer Tailwind classes)

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

### Current Flow (Auth Stub)

```
Component
  ↓
useAuth() composable
  ↓
useState() (in-memory state)
  ↓
localStorage (token persistence)
  ↓
Display user info / logout button
```

### Future Flow (Phase 02+)

```
Component
  ↓
useAuth() composable
  ↓
API call ($fetch to /api/admin/auth)
  ↓
Backend validation
  ↓
Token + user data returned
  ↓
useState() + localStorage
  ↓
Route middleware checks auth
  ↓
Navigate to dashboard or show error
```

---

## Key Architectural Decisions

### 1. Nuxt 4 `app/` Directory Structure
**Why**: Modern Nuxt 4 convention, cleaner organization than Pages Router v3.

### 2. Layouts Pattern for Multi-Layout Support
**Why**: Eliminates duplicated header/footer code, clean separation between auth and admin flows.

### 3. useState() for State Management
**Why**: Nuxt-native, server-friendly, no dependency bloat vs Redux/Pinia. Works for current phase scope.

### 4. Nuxt UI Component Library
**Why**: Pre-built accessible components, Tailwind-integrated, dark mode out-of-box, consistent design.

### 5. Composables for Reusable Logic
**Why**: Vue 3 Composition API standard, auto-imported, easier to test than mixins.

### 6. Client-side localStorage with Server-side Check
**Why**: SSR-safe, prevents errors in server context (Nuxt Node.js).

### 8. Config-driven API Client (Phase 01)
**Why**: Avoids hardcoding URLs, allows per-environment configuration via `.env`, and centralizes error handling and token injection.

---

## Security Architecture

### Current Measures (Phase 01-05)

1. **CSRF Protection**: Not yet (backend responsibility)
2. **XSS Prevention**: Nuxt template auto-escaping + Nuxt UI sanitization
3. **Token Storage**: localStorage (client-side only)
4. **Auth Check**: Server-side conditional + Client-side localStorage check in middleware (Phase 04)
5. **Config Safety**: Public API URL exposed via `runtimeConfig.public`
6. **Route Protection**: Global auth middleware + Guest middleware (Phase 04)

### Planned Improvements (Phase 06+)

1. **httpOnly Cookies**: Replace localStorage for token
2. **Refresh Token Rotation**: Implement token refresh flow
3. **CSRF Tokens**: Add CSRF protection
4. **Rate Limiting**: Backend enforces (see API docs)

---

## Performance Architecture

### Current Optimizations

1. **Code Splitting**: Nuxt auto-splits by route
2. **Auto-imports**: Only loaded composables/components used
3. **Lazy Loading**: Page components loaded on-demand
4. **Tree Shaking**: Unused Nuxt UI components excluded from bundle

### Planned Optimizations (Future)

1. **Image Optimization**: Nuxt Image component for covers
2. **API Caching**: Implement with SWR pattern
3. **Bundle Analysis**: Monitor bundle size
4. **Prerendering**: Static routes via route rules

---

## Deployment Architecture

### Build Process

```
Source Code (TypeScript + Vue)
    ↓
pnpm build
    ↓
Nuxt Compiler (vite)
    ↓
.output/ directory
    ├── public/ (static files)
    └── server/ (server bundle)
    ├── dist/ (client bundle)
    ↓
Deploy to hosting
```

### Environment Configuration

**Development**: `pnpm dev` (HMR enabled)
**Production**: `pnpm build && pnpm preview`

### API Configuration (Future)

Environment variables:
```env
NUXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api/admin
NUXT_PUBLIC_API_TIMEOUT=5000
```

---

## Phase-based Architecture Evolution

### Phase 01 (Runtime Config & API Setup)
- API client wrapper (`useApi`) ✓
- Runtime config integration ✓
- Typed API responses ✓
- Environment variable support ✓

### Phase 05 (Layout Separation)
- Layout separation ✓
- Basic auth stub ✓
- Login page placeholder ✓

### Phase 02 (Auth Implementation)
- Full login flow
- Token management
- Route protection middleware

### Phase 03 (Login UI)
- Form validation
- Error handling
- Success/failure feedback

### Phase 04 (Admin Dashboard)
- Manga CRUD
- Data tables
- Admin features

---

## Related Documentation
- [codebase-summary.md](./codebase-summary.md) - Directory structure & overview
- [code-standards.md](./code-standards.md) - Code style & patterns
- [project-overview-pdr.md](./project-overview-pdr.md) - Requirements & PDR
- [API_ADMIN_DOCUMENTATION.md](./API_ADMIN_DOCUMENTATION.md) - Backend API reference
- [CLAUDE.md](../CLAUDE.md) - Project guidelines & workflows
