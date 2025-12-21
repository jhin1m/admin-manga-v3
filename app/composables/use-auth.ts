// Auth composable - minimal stub for Phase 05
// Full implementation in Phase 02
export const useAuth = () => {
  const user = useState('auth_user', () => null as { name: string } | null)
  const token = useState('auth_token', () => null as string | null)
  const isLoading = useState('auth_loading', () => false)

  const isAuthenticated = computed(() => !!token.value)

  const logout = () => {
    user.value = null
    token.value = null
    if (import.meta.client) {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
    }
    navigateTo('/login')
  }

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    logout
  }
}
