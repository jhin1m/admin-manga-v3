import type { Manga } from '~/types/manga'
import type { PaginatedApiResponse, ApiResponse } from '~/utils/api'

export function useManga() {
  const api = useApi()

  async function fetchMangas(params?: Record<string, any>) {
    return await api<PaginatedApiResponse<Manga>>('/mangas', {
      method: 'GET',
      params
    })
  }

  async function deleteManga(id: string) {
    return await api<ApiResponse<null>>(`/mangas/${id}`, {
      method: 'DELETE'
    })
  }

  return {
    fetchMangas,
    deleteManga
  }
}
