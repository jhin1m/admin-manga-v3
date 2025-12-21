# Phase 03: Login Page UI

## Context
- **Parent:** [plan.md](./plan.md)
- **Dependencies:** Phase 02
- **Docs:** [Nuxt UI Form](https://ui.nuxt.com/components/form)

## Overview
| Field | Value |
|-------|-------|
| Date | 2025-12-21 |
| Priority | High |
| Status | ✅ Done (2025-12-21 21:58) |
| Review | ✅ Approved (w/ minor recommendations) |
| Review Report | [code-reviewer-251221-phase03-login-ui.md](../reports/code-reviewer-251221-phase03-login-ui.md) |

Create login page with form validation using Nuxt UI v4 components.

## Key Insights
- Nuxt UI v4 uses `UForm` with Zod/Yup/Valibot validation
- UInput, UButton have built-in loading/disabled states
- Theme colors: primary='green', neutral='slate'
- Use `definePageMeta({ layout: 'auth' })` for minimal layout

## Requirements
1. Centered card layout
2. Email and password inputs
3. Form validation (required, email format)
4. Submit button with loading state
5. Error display
6. Redirect to / on success

## Architecture
```
app/pages/login.vue
├── Layout: auth (minimal, no header/footer)
├── Components
│   ├── UCard - container
│   ├── UForm - validation wrapper
│   ├── UFormField - label + error display
│   ├── UInput - email, password
│   └── UButton - submit
└── Logic
    ├── Form state (email, password)
    ├── Validation schema (Zod)
    └── Submit handler → useAuth().login()
```

## Related Files
- `app/pages/login.vue` - Login page

## Implementation Steps

### Step 1: Install Zod (if not present)
```bash
pnpm add zod
```

### Step 2: Create app/pages/login.vue
```vue
<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: 'auth'
})

const auth = useAuth()

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

type Schema = z.output<typeof schema>

const state = reactive({
  email: '',
  password: ''
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const success = await auth.login(event.data)
  if (success) {
    navigateTo('/')
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold">Admin Login</h1>
          <p class="text-sm text-muted mt-1">
            Sign in to manage your manga
          </p>
        </div>
      </template>

      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="Email" name="email">
          <UInput
            v-model="state.email"
            type="email"
            placeholder="admin@example.com"
            icon="i-lucide-mail"
            size="lg"
          />
        </UFormField>

        <UFormField label="Password" name="password">
          <UInput
            v-model="state.password"
            type="password"
            placeholder="••••••••"
            icon="i-lucide-lock"
            size="lg"
          />
        </UFormField>

        <UButton
          type="submit"
          block
          size="lg"
          :loading="auth.isLoading.value"
        >
          Sign in
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>
```

## Todo List
- [x] Install zod package
- [x] Create login.vue page
- [x] Add page meta for auth layout
- [x] Test form validation
- [x] Test login flow

## Success Criteria
- [x] Form validates email format
- [x] Form validates required fields
- [x] Error messages display below inputs
- [x] Button shows loading state
- [x] Successful login redirects to /
- [x] Failed login shows toast error

## Review Findings (2025-12-21)

**Status**: ✅ Approved with minor recommendations

**Quality Score**: 8.5/10

### Recommended Fixes
1. **Fix lint error**: Remove unused `registerEndpoint` import in `login.test.ts`
2. **Strengthen password validation**: Change `min(1)` to `min(8, 'Password must be at least 8 characters')`
3. **Add autocomplete**: Add `autocomplete="email"` and `autocomplete="current-password"` attributes

### Strengths
- Clean, simple code following YAGNI/KISS/DRY principles
- Proper TypeScript typing + Zod validation
- Excellent separation of concerns
- No security vulnerabilities
- Build ✅ TypeCheck ✅

### Next Phase Readiness
✅ Ready to proceed to Phase 04 after fixing lint error

## Risk Assessment
| Risk | Mitigation |
|------|------------|
| Nuxt UI v4 API changes | Check official docs for component props |

## Security Considerations
- Password field uses type="password"
- No credentials stored in URL
- HTTPS required in production

## Next Steps
Proceed to [Phase 04: Route Middleware](./phase-04-route-middleware.md)
