import type { ApiResponse, ApiError } from '~/utils/api'

interface User {
  id: string
  name: string
  email: string
  roles: string[]
}

interface LoginCredentials {
  email: string
  password: string
}

interface AuthResponse {
  token: string
  type: string
}

const TOKEN_KEY = 'admin_token'

export function useAuth() {
  const config = useRuntimeConfig()
  const toast = useToast()

  // Use cookie for SSR-safe token storage
  const tokenCookie = useCookie<string | null>(TOKEN_KEY, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  })

  // State - using useState for SSR safety
  const user = useState<User | null>('auth_user', () => null)
  const isLoading = useState('auth_loading', () => false)

  const isAuthenticated = computed(() => !!tokenCookie.value)

  // Initialize user profile if token exists
  function init() {
    if (tokenCookie.value) {
      fetchProfile()
    }
  }

  // Login
  async function login(credentials: LoginCredentials) {
    isLoading.value = true
    try {
      const res = await $fetch<ApiResponse<AuthResponse>>(
        '/auth',
        {
          baseURL: config.public.apiBase,
          method: 'POST',
          body: credentials
        }
      )

      tokenCookie.value = res.data.token
      await fetchProfile()

      toast.add({ title: 'Login successful', color: 'success' })
      return true
    } catch (error: unknown) {
      const apiError = error as ApiError
      const msg = apiError.message || 'Login failed'
      toast.add({ title: msg, color: 'error' })
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Get profile
  async function fetchProfile() {
    if (!tokenCookie.value) return
    try {
      const res = await $fetch<ApiResponse<User>>('/auth', {
        baseURL: config.public.apiBase,
        headers: { Authorization: `Bearer ${tokenCookie.value}` }
      })
      user.value = res.data
    } catch (error: unknown) {
      // Only logout on 401 (unauthorized)
      const apiError = error as { statusCode?: number }
      if (apiError.statusCode === 401) {
        logout()
      }
    }
  }

  // Logout
  async function logout() {
    if (tokenCookie.value) {
      try {
        await $fetch('/auth', {
          baseURL: config.public.apiBase,
          method: 'DELETE',
          headers: { Authorization: `Bearer ${tokenCookie.value}` }
        })
      } catch {
        // Ignore errors on logout
      }
    }

    tokenCookie.value = null
    user.value = null

    navigateTo('/login')
  }

  return {
    token: readonly(tokenCookie),
    user: readonly(user),
    isAuthenticated,
    isLoading: readonly(isLoading),
    init,
    login,
    logout,
    fetchProfile
  }
}
