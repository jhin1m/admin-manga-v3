interface AuthState {
  token: { value: string | null }
  isAuthenticated: { value: boolean }
}

export const authMiddlewareLogic = (to: { path: string }, auth: AuthState | null, env: { client: boolean, server: boolean }, storage: Storage | null) => {
  // Skip auth check for login page
  if (to.path === '/login') {
    return
  }

  // On client, check localStorage directly for SSR hydration
  if (env.client && storage) {
    const token = storage.getItem('admin_token')
    if (!token) {
      return '/login'
    }
  }

  // On server, check state (will be null on first load)
  if (env.server && !auth?.token?.value) {
    return '/login'
  }
}

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuth()
  const result = authMiddlewareLogic(
    to,
    auth as AuthState,
    { client: import.meta.client, server: import.meta.server },
    import.meta.client ? localStorage : null
  )

  if (result) {
    return navigateTo(result)
  }
})
