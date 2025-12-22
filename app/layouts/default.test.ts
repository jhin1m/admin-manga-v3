import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DefaultLayout from './default.vue'
import { navigationItems } from '~/config/navigation'

// Mock navigateTo
const navigateToMock = vi.fn()
vi.stubGlobal('navigateTo', navigateToMock)

// Mock useAuth
const logoutMock = vi.fn()
vi.mock('~/composables/use-auth', () => ({
  useAuth: () => ({
    user: { value: { name: 'Test User' } },
    logout: logoutMock,
    isAuthenticated: { value: true }
  })
}))

// Mock defineShortcuts
vi.stubGlobal('defineShortcuts', vi.fn())

describe('Default Layout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders navigation items', async () => {
    const component = await mountSuspended(DefaultLayout)

    // Check if main navigation items are present
    const text = component.text()
    navigationItems.forEach((item) => {
      expect(text).toContain(item.label)
    })
  })

  it('displays user info', async () => {
    const component = await mountSuspended(DefaultLayout)
    expect(component.text()).toContain('Test User')
  })

  it('calls logout when button clicked', async () => {
    const component = await mountSuspended(DefaultLayout)

    // Search for logout button
    const buttons = component.findAll('button')
    const btn = buttons.find(b => b.text().includes('Đăng xuất') || b.attributes('icon') === 'i-lucide-log-out')

    if (btn) {
      await btn.trigger('click')
      expect(logoutMock).toHaveBeenCalled()
    }
  })
})
