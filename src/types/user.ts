export type UserRole = 'ADMIN' | 'MANAGER' | 'CUSTOMER'

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

export type CreateUserDto = {
  name: string
  email: string
  role: UserRole
}
