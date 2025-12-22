export interface NavItem {
  label: string
  icon: string
  to?: string
  children?: NavItem[]
}

export const navigationItems: NavItem[] = [
  {
    label: 'Dashboard',
    icon: 'i-lucide-layout-dashboard',
    to: '/'
  },
  {
    label: 'Quản lý truyện',
    icon: 'i-lucide-book-open',
    children: [
      { label: 'Danh sách', icon: 'i-lucide-list', to: '/manga' },
      { label: 'Thêm mới', icon: 'i-lucide-plus', to: '/manga/create' }
    ]
  },
  {
    label: 'Quản lý người dùng',
    icon: 'i-lucide-users',
    to: '/users'
  },
  {
    label: 'Cài đặt',
    icon: 'i-lucide-settings',
    to: '/settings'
  }
]
