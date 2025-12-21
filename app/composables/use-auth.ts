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

  // State - using useState for SSR safety
  const token = useState<string | null>('auth_token', () => null)
  const user = useState<User | null>('auth_user', () => null)
  const isLoading = useState('auth_loading', () => false)

  const isAuthenticated = computed(() => !!token.value)

  // Restore token from localStorage (client only)
  function init() {
    if (import.meta.client) {
      const stored = localStorage.getItem(TOKEN_KEY)
      if (stored && stored.length > 10) {
        token.value = stored
        fetchProfile()
      }
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

      token.value = res.data.token
      await fetchProfile()

      if (import.meta.client) {
        localStorage.setItem(TOKEN_KEY, res.data.token)
      }

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
    if (!token.value) return
    try {
      const res = await $fetch<ApiResponse<User>>('/auth', {
        baseURL: config.public.apiBase,
        headers: { Authorization: `Bearer ${token.value}` }
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
    if (token.value) {
      try {
        await $fetch('/auth', {
          baseURL: config.public.apiBase,
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token.value}` }
        })
      } catch {
        // Ignore errors on logout
      }
    }

    token.value = null
    user.value = null
    if (import.meta.client) {
      localStorage.removeItem(TOKEN_KEY)
    }

    navigateTo('/login')
  }

  return {
    token: readonly(token),
    user: readonly(user),
    isAuthenticated,
    isLoading: readonly(isLoading),
    init,
    login,
    logout,
    fetchProfile
  }
}
