import type { Artist, Group } from '~/types/manga'
import type { PaginatedApiResponse } from '~/utils/api'

export function useArtists() {
  const api = useApi()

  async function fetchArtists(params?: Record<string, any>) {
    return await api<PaginatedApiResponse<Artist>>('/artists', {
      method: 'GET',
      params
    })
  }

  return {
    fetchArtists
  }
}

export function useGroups() {
  const api = useApi()

  async function fetchGroups(params?: Record<string, any>) {
    return await api<PaginatedApiResponse<Group>>('/groups', {
      method: 'GET',
      params
    })
  }

  return {
    fetchGroups
  }
}

export function useDoujinshis() {
  const api = useApi()

  async function fetchDoujinshis(params?: Record<string, any>) {
    return await api<PaginatedApiResponse<{ id: string; name: string }>>('/doujinshis', {
      method: 'GET',
      params
    })
  }

  return {
    fetchDoujinshis
  }
}
