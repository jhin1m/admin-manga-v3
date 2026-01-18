// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data: T
  code: number
  status?: number
}

export interface Pagination {
  count: number
  total: number
  perPage: number
  currentPage: number
  totalPages: number
  links?: {
    next?: string | null
    prev?: string | null
  }
}

export interface Meta {
  current_page: number
  from: number
  to: number
  total: number
  per_page: number
  last_page: number
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination
}

export interface LaravelPaginatedResponse<T> extends ApiResponse<{
  data: T[]
  meta: Meta
}> {}

export interface ApiError {
  success: false
  message: string
  code: number
  errors?: Record<string, string[]>
}

// API client factory with Bearer token injection
export function useApi() {
  const config = useRuntimeConfig()
  const auth = useAuth()

  return $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      if (auth.token.value) {
        const headers = new Headers(options.headers)
        headers.set('Authorization', `Bearer ${auth.token.value}`)
        options.headers = headers
      }
    },
    onResponseError({ response }) {
      // Handle API errors
      const error = response._data as ApiError
      if (error?.message) {
        console.error('API Error:', error.message)
      }
    }
  })
}
