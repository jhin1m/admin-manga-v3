import type { Chapter } from '~/types/chapter'
import type { PaginatedApiResponse, ApiResponse } from '~/utils/api'

/**
 * Composable để tương tác với Chapters API
 *
 * Cung cấp các methods:
 * - fetchChapters: Lấy danh sách chapters (có pagination, filter, sort)
 * - deleteChapter: Xóa một chapter
 * - deleteChapters: Xóa nhiều chapters cùng lúc
 *
 * Usage example:
 * ```ts
 * const { fetchChapters, deleteChapter } = useChapters()
 * const chapters = await fetchChapters({ 'filter[manga_id]': mangaId, include: 'user,manga' })
 * await deleteChapter(chapterId)
 * ```
 */
export function useChapters() {
  const api = useApi()

  /**
   * Fetch chapters với pagination, filtering và sorting
   * @param params - Query parameters (page, per_page, filter, sort, include)
   */
  async function fetchChapters(params?: Record<string, unknown>) {
    return await api<PaginatedApiResponse<Chapter>>('/chapters', {
      method: 'GET',
      params
    })
  }

  /**
   * Xóa một chapter theo ID
   * @param id - Chapter ID
   */
  async function deleteChapter(id: string) {
    return await api<ApiResponse<null>>(`/chapters/${id}`, {
      method: 'DELETE'
    })
  }

  /**
   * Xóa nhiều chapters cùng lúc
   * @param ids - Mảng các chapter IDs cần xóa
   */
  async function deleteChapters(ids: string[]) {
    return await api<ApiResponse<null>>('/chapters/delete-many', {
      method: 'PUT',
      body: { ids }
    })
  }

  return {
    fetchChapters,
    deleteChapter,
    deleteChapters
  }
}
