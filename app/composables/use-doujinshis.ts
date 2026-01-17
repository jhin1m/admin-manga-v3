import type { Doujinshi } from '~/types/manga'
import type { PaginatedApiResponse, ApiResponse } from '~/utils/api'

export function useDoujinshis() {
  const api = useApi()

  async function fetchDoujinshis(params?: Record<string, any>) {
    return await api<PaginatedApiResponse<Doujinshi>>('/doujinshis', {
      method: 'GET',
      params
    })
  }

  async function fetchDoujinshi(id: string) {
    return await api<ApiResponse<Doujinshi>>(`/doujinshis/${id}`, {
      method: 'GET'
    })
  }

  async function createDoujinshi(data: { name: string }) {
    return await api<ApiResponse<Doujinshi>>('/doujinshis', {
      method: 'POST',
      body: data
    })
  }

  async function updateDoujinshi(id: string, data: Partial<Doujinshi>) {
    return await api<ApiResponse<Doujinshi>>(`/doujinshis/${id}`, {
      method: 'PUT',
      body: data
    })
  }

  async function deleteDoujinshi(id: string) {
    return await api<ApiResponse<null>>(`/doujinshis/${id}`, {
      method: 'DELETE'
    })
  }

  return {
    fetchDoujinshis,
    fetchDoujinshi,
    createDoujinshi,
    updateDoujinshi,
    deleteDoujinshi
  }
}
