import type { User } from './user'
import type { Manga } from './manga'

/**
 * Chapter interface - đại diện cho một chapter trong manga
 * Sử dụng trong admin panel để quản lý chapters
 */
export interface Chapter {
  id: string
  name: string
  slug: string
  order: number // Thứ tự chapter (chapter 1, 2, 3...)
  views: number // Số lượt xem
  manga_id: string
  user_id: string
  created_at: string
  updated_at: string

  // Relations - có thể được include từ API qua query param 'include'
  user?: User
  manga?: Manga
}
