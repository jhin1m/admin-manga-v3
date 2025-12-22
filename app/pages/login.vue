<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

const auth = useAuth()

// Track touched fields
const touched = reactive({
  email: false,
  password: false
})

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
})

type Schema = z.output<typeof schema>

const state = reactive({
  email: '',
  password: ''
})

// Custom validation
function validate(state: Partial<Schema>) {
  const errors = []

  if (touched.email) {
    if (!state.email) {
      errors.push({ path: 'email', message: 'Email is required' })
    } else if (!z.string().email().safeParse(state.email).success) {
      errors.push({ path: 'email', message: 'Invalid email address' })
    }
  }

  if (touched.password) {
    if (!state.password) {
      errors.push({ path: 'password', message: 'Password is required' })
    } else if (state.password.length < 8) {
      errors.push({ path: 'password', message: 'Password must be at least 8 characters' })
    }
  }

  return errors
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Validate full schema on submit
  const result = schema.safeParse(state)
  if (!result.success) {
    touched.email = true
    touched.password = true
    return
  }

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
          <h1 class="text-2xl font-bold">
            Admin Login
          </h1>
          <p class="text-sm text-muted mt-1">
            Sign in to manage your manga
          </p>
        </div>
      </template>

      <UForm
        :validate="validate"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField
          label="Email"
          name="email"
        >
          <UInput
            v-model="state.email"
            type="email"
            placeholder="admin@example.com"
            icon="i-lucide-mail"
            size="lg"
            class="w-full"
            autocomplete="email"
            @blur="touched.email = true"
          />
        </UFormField>

        <UFormField
          label="Password"
          name="password"
        >
          <UInput
            v-model="state.password"
            type="password"
            placeholder="••••••••"
            icon="i-lucide-lock"
            size="lg"
            class="w-full"
            autocomplete="current-password"
            @blur="touched.password = true"
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
