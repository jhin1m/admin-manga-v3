import type { Group } from '~/types/manga'
import type { PaginatedApiResponse, ApiResponse } from '~/utils/api'

export function useGroups() {
  const api = useApi()

  async function fetchGroups(params?: Record<string, any>) {
    return await api<PaginatedApiResponse<Group>>('/groups', {
      method: 'GET',
      params
    })
  }

  async function fetchGroup(id: string) {
    return await api<ApiResponse<Group>>(`/groups/${id}`, {
      method: 'GET'
    })
  }

  async function createGroup(data: { name: string }) {
    return await api<ApiResponse<Group>>('/groups', {
      method: 'POST',
      body: data
    })
  }

  async function updateGroup(id: string, data: Partial<Group>) {
    return await api<ApiResponse<Group>>(`/groups/${id}`, {
      method: 'PUT',
      body: data
    })
  }

  async function deleteGroup(id: string) {
    return await api<ApiResponse<null>>(`/groups/${id}`, {
      method: 'DELETE'
    })
  }

  return {
    fetchGroups,
    fetchGroup,
    createGroup,
    updateGroup,
    deleteGroup
  }
}
