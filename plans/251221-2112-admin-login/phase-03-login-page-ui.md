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
| Status | ⏳ Pending |
| Review | ⏳ Pending |

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
- [ ] Install zod package
- [ ] Create login.vue page
- [ ] Add page meta for auth layout
- [ ] Test form validation
- [ ] Test login flow

## Success Criteria
- [ ] Form validates email format
- [ ] Form validates required fields
- [ ] Error messages display below inputs
- [ ] Button shows loading state
- [ ] Successful login redirects to /
- [ ] Failed login shows toast error

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
