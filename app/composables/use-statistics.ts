import type { ApiResponse } from '~/utils/api'

interface DashboardStats {
  user_count: number
  manga_count: number
  chapter_count: number
  pet_count: number
}

export function useStatistics() {
  const config = useRuntimeConfig()
  const auth = useAuth()

  const stats = useState<DashboardStats | null>('dashboard_stats', () => null)
  const isLoading = useState('stats_loading', () => false)
  const error = useState<string | null>('stats_error', () => null)

  async function fetchStats() {
    if (!auth.token.value) return

    isLoading.value = true
    error.value = null

    try {
      const res = await $fetch<ApiResponse<DashboardStats>>('/statics/basic', {
        baseURL: config.public.apiBase,
        headers: { Authorization: `Bearer ${auth.token.value}` }
      })
      stats.value = res.data
    } catch (e: unknown) {
      error.value = 'Failed to load statistics'
      console.error('Stats fetch error:', e)
    } finally {
      isLoading.value = false
    }
  }

  return {
    stats: readonly(stats),
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchStats
  }
}
