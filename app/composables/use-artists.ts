import type { Artist } from '~/types/manga'
import type { PaginatedApiResponse, ApiResponse } from '~/utils/api'

export function useArtists() {
  const api = useApi()

  async function fetchArtists(params?: Record<string, any>) {
    return await api<PaginatedApiResponse<Artist>>('/artists', {
      method: 'GET',
      params
    })
  }

  async function fetchArtist(id: string) {
    return await api<ApiResponse<Artist>>(`/artists/${id}`, {
      method: 'GET'
    })
  }

  async function createArtist(data: { name: string }) {
    return await api<ApiResponse<Artist>>('/artists', {
      method: 'POST',
      body: data
    })
  }

  async function updateArtist(id: string, data: Partial<Artist>) {
    return await api<ApiResponse<Artist>>(`/artists/${id}`, {
      method: 'PUT',
      body: data
    })
  }

  async function deleteArtist(id: string) {
    return await api<ApiResponse<null>>(`/artists/${id}`, {
      method: 'DELETE'
    })
  }

  return {
    fetchArtists,
    fetchArtist,
    createArtist,
    updateArtist,
    deleteArtist
  }
}
