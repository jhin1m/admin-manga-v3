import type { Genre } from '~/types/manga'
import type { PaginatedApiResponse, ApiResponse } from '~/utils/api'

export function useGenres() {
  const api = useApi()

  async function fetchGenres(params?: Record<string, any>) {
    return await api<ApiResponse<Genre[]>>('/genres', {
      method: 'GET',
      params
    })
  }

  async function fetchGenre(id: number) {
    return await api<ApiResponse<Genre>>(`/genres/${id}`, {
      method: 'GET'
    })
  }

  return {
    fetchGenres,
    fetchGenre
  }
}
