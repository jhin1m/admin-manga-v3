export interface Genre {
  id: number
  name: string
  slug: string
}

export interface Artist {
  id: string
  name: string
}

export interface Group {
  id: string
  name: string
}

export interface Doujinshi {
  id: string
  name: string
  created_at?: string
  updated_at?: string
}

export interface Manga {
  id: string
  name: string
  name_alt?: string | null
  slug: string
  status: 'ongoing' | 'completed' | 'onhold' | 'canceled' | string | number
  cover: string
  cover_full_url: string
  is_reviewed: boolean
  user_id: string
  artist_id?: string | null
  group_id?: string | null
  created_at: string
  updated_at: string
  genres?: Genre[]
}
