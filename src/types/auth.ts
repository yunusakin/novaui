export type AuthRole = 'ADMIN' | 'STAFF' | 'COURIER'

export type AuthUser = {
  id: string
  name: string
  email: string
  role: AuthRole
}

export type AuthTokenPayload = {
  sub: string
  name: string
  email: string
  role: AuthRole
  exp: number
}

export type LoginPayload = {
  email: string
  password: string
}
