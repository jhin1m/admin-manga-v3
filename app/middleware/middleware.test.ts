import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authMiddlewareLogic } from './auth.global'
import { guestMiddlewareLogic } from './guest'

describe('Middleware Logic Tests', () => {
  const mockAuth = {
    token: { value: null as string | null },
    isAuthenticated: { value: false }
  }

  const mockStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    length: 0,
    key: vi.fn()
  } as unknown as Storage

  beforeEach(() => {
    vi.clearAllMocks()
    mockAuth.token.value = null
    mockAuth.isAuthenticated.value = false
  })

  describe('Auth Global Middleware Logic', () => {
    it('should allow access to login page without token', () => {
      const result = authMiddlewareLogic(
        { path: '/login' },
        mockAuth,
        { client: true, server: false },
        mockStorage
      )
      expect(result).toBeUndefined()
    })

    it('should redirect unauthenticated users to /login (Client)', () => {
      vi.mocked(mockStorage.getItem).mockReturnValue(null)
      const result = authMiddlewareLogic(
        { path: '/' },
        mockAuth,
        { client: true, server: false },
        mockStorage
      )
      expect(result).toBe('/login')
    })

    it('should redirect unauthenticated users to /login (Server)', () => {
      mockAuth.token.value = null
      const result = authMiddlewareLogic(
        { path: '/' },
        mockAuth,
        { client: false, server: true },
        null
      )
      expect(result).toBe('/login')
    })

    it('should allow access for authenticated users (Client)', () => {
      vi.mocked(mockStorage.getItem).mockReturnValue('fake-token')
      const result = authMiddlewareLogic(
        { path: '/' },
        mockAuth,
        { client: true, server: false },
        mockStorage
      )
      expect(result).toBeUndefined()
    })

    it('should allow access for authenticated users (Server)', () => {
      mockAuth.token.value = 'fake-token'
      const result = authMiddlewareLogic(
        { path: '/' },
        mockAuth,
        { client: false, server: true },
        null
      )
      expect(result).toBeUndefined()
    })
  })

  describe('Guest Middleware Logic', () => {
    it('should redirect authenticated users from login to / (Client)', () => {
      vi.mocked(mockStorage.getItem).mockReturnValue('fake-token')
      const result = guestMiddlewareLogic(
        mockAuth,
        { client: true, server: false },
        mockStorage
      )
      expect(result).toBe('/')
    })

    it('should redirect authenticated users from login to / (State)', () => {
      mockAuth.isAuthenticated.value = true
      const result = guestMiddlewareLogic(
        mockAuth,
        { client: false, server: true },
        null
      )
      expect(result).toBe('/')
    })

    it('should allow guests on login page', () => {
      vi.mocked(mockStorage.getItem).mockReturnValue(null)
      mockAuth.isAuthenticated.value = false
      const result = guestMiddlewareLogic(
        mockAuth,
        { client: true, server: false },
        mockStorage
      )
      expect(result).toBeUndefined()
    })
  })
})
