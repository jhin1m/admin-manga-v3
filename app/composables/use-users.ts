import type { User } from '~/types/user'
import type { PaginatedApiResponse, ApiResponse } from '~/utils/api'

export function useUsers() {
  const api = useApi()

  async function fetchUsers(params?: Record<string, any>) {
    return await api<PaginatedApiResponse<User>>('/users', {
      method: 'GET',
      params
    })
  }

  async function fetchUser(id: string) {
    return await api<ApiResponse<User>>(`/users/${id}`, {
      method: 'GET'
    })
  }

  async function updateUser(id: string, data: Partial<User>) {
    return await api<ApiResponse<User>>(`/users/${id}`, {
      method: 'PUT',
      body: data
    })
  }

  return {
    fetchUsers,
    fetchUser,
    updateUser
  }
}
