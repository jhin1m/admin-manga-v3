export interface User {
  id: string
  name: string
  email: string
  google_id?: string | null
  email_verified_at?: string | null
  total_points: number
  used_points: number
  achievements_points: number
  exp: number
  level: number
  last_reading_check?: string | null
  pet_id?: string | null
  achievement_id?: string | null
  banned_until?: string | null
  limit_pet_points: number
  limit_achievement_points: number
  created_at: string
  updated_at: string
  avatar_full_url: string
}
