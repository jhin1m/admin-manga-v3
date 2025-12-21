// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data: T
  code: number
}

export interface ApiError {
  success: false
  message: string
  code: number
  errors?: Record<string, string[]>
}

// API client factory with Bearer token injection
export function useApi() {
  const config = useRuntimeConfig()

  // Note: useAuth will be created in phase 02
  // For now, create the API client without auth header injection
  return $fetch.create({
    baseURL: config.public.apiBase,
    onResponseError({ response }) {
      // Handle API errors
      const error = response._data as ApiError
      if (error?.message) {
        console.error('API Error:', error.message)
      }
    }
  })
}
