import type { AuthRole } from '@/types/auth'

export type NavigationItem = {
  to: string
  label: string
  roles?: AuthRole[]
}

export const navigationItems: NavigationItem[] = [
  { to: '/', label: 'Dashboard', roles: ['ADMIN', 'STAFF'] },
  { to: '/users', label: 'Users', roles: ['ADMIN'] },
  { to: '/products', label: 'Products', roles: ['ADMIN', 'STAFF'] },
  { to: '/orders', label: 'Orders', roles: ['ADMIN', 'STAFF', 'COURIER'] },
  { to: '/payment', label: 'Payment', roles: ['ADMIN', 'STAFF'] },
  { to: '/profile', label: 'Profile' },
]
