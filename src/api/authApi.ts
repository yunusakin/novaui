import { appEnv } from '@/config/env'
import { createMockToken } from '@/utils/auth'
import type { AuthUser, LoginPayload } from '@/types/auth'

type AuthSuccessResponse = {
  token: string
  user: AuthUser
}

const mockUsers: Array<AuthUser & { password: string }> = [
  {
    id: '0001',
    name: 'Avery Admin',
    email: 'admin@nova.dev',
    role: 'ADMIN',
    password: 'novaadmin',
  },
  {
    id: '0002',
    name: 'Sam Staff',
    email: 'staff@nova.dev',
    role: 'STAFF',
    password: 'novastaff',
  },
  {
    id: '0003',
    name: 'Casey Courier',
    email: 'courier@nova.dev',
    role: 'COURIER',
    password: 'novacourier',
  },
]

const delay = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

export const authApi = {
  async login(payload: LoginPayload): Promise<AuthSuccessResponse> {
    // simulate request latency
    await delay(600)
    const user = mockUsers.find(
      (entry) =>
        entry.email.toLowerCase() === payload.email.toLowerCase() &&
        entry.password === payload.password,
    )

    if (!user) {
      throw new Error('Invalid credentials provided.')
    }

    const token = createMockToken(user, appEnv.authTokenSecret)
    return {
      token,
      user,
    }
  },
  async logout(): Promise<void> {
    await delay(200)
  },
  getBaseUrl() {
    return appEnv.authApi
  },
}

export type AuthApi = typeof authApi
