import type { Manga } from '~/types/manga'
import type { PaginatedApiResponse, ApiResponse } from '~/utils/api'

export interface MangaFormData {
  name: string
  name_alt?: string
  artist_id?: string
  doujinshi_id?: string
  group_id?: string
  status: string
  cover?: File | null
  genres?: number[]
  is_hot?: boolean
  content?: string
}

export function useManga() {
  const api = useApi()

  async function fetchMangas(params?: Record<string, any>) {
    return await api<PaginatedApiResponse<Manga>>('/mangas', {
      method: 'GET',
      params
    })
  }

  async function fetchManga(id: string, params?: Record<string, any>) {
    return await api<ApiResponse<Manga>>(`/mangas/${id}`, {
      method: 'GET',
      params
    })
  }

  async function createManga(data: MangaFormData) {
    const formData = new FormData()

    // Append basic fields
    formData.append('name', data.name)
    if (data.name_alt) formData.append('name_alt', data.name_alt)
    if (data.artist_id) formData.append('artist_id', data.artist_id)
    if (data.doujinshi_id) formData.append('doujinshi_id', data.doujinshi_id)
    if (data.group_id) formData.append('group_id', data.group_id)
    formData.append('status', data.status)
    if (data.is_hot !== undefined) formData.append('is_hot', data.is_hot ? '1' : '0')
    if (data.content) formData.append('content', data.content)

    // Append genres array
    if (data.genres && data.genres.length > 0) {
      data.genres.forEach((genreId) => {
        formData.append('genres[]', genreId.toString())
      })
    }

    // Append cover file if provided
    if (data.cover) {
      formData.append('cover', data.cover)
    }

    return await api<ApiResponse<Manga>>('/mangas', {
      method: 'POST',
      body: formData
    })
  }

  async function updateManga(id: string, data: Partial<MangaFormData>) {
    const formData = new FormData()

    // Append basic fields
    if (data.name !== undefined) formData.append('name', data.name)
    if (data.name_alt !== undefined) formData.append('name_alt', data.name_alt || '')
    if (data.artist_id !== undefined) formData.append('artist_id', data.artist_id || '')
    if (data.doujinshi_id !== undefined) formData.append('doujinshi_id', data.doujinshi_id || '')
    if (data.group_id !== undefined) formData.append('group_id', data.group_id || '')
    if (data.status !== undefined) formData.append('status', data.status)
    if (data.is_hot !== undefined) formData.append('is_hot', data.is_hot ? '1' : '0')
    if (data.content !== undefined) formData.append('content', data.content)

    // Append genres array
    if (data.genres && data.genres.length > 0) {
      data.genres.forEach((genreId) => {
        formData.append('genres[]', genreId.toString())
      })
    }

    // Append cover file if provided
    if (data.cover) {
      formData.append('cover', data.cover)
    }

    return await api<ApiResponse<Manga>>(`/mangas/${id}`, {
      method: 'PUT',
      body: formData
    })
  }

  async function deleteManga(id: string) {
    return await api<ApiResponse<null>>(`/mangas/${id}`, {
      method: 'DELETE'
    })
  }

  return {
    fetchMangas,
    fetchManga,
    createManga,
    updateManga,
    deleteManga
  }
}
