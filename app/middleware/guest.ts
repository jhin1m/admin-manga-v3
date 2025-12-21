interface AuthState {
  token: { value: string | null }
  isAuthenticated: { value: boolean }
}

export const guestMiddlewareLogic = (auth: AuthState | null, env: { client: boolean, server: boolean }, storage: Storage | null) => {
  // Redirect authenticated users away from login
  if (env.client && storage) {
    const token = storage.getItem('admin_token')
    if (token) {
      return '/'
    }
  }

  if (auth?.isAuthenticated?.value) {
    return '/'
  }
}

export default defineNuxtRouteMiddleware(() => {
  const auth = useAuth()
  const result = guestMiddlewareLogic(
    auth as AuthState,
    { client: import.meta.client, server: import.meta.server },
    import.meta.client ? localStorage : null
  )

  if (result) {
    return navigateTo(result)
  }
})
