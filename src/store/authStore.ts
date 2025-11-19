import { create } from 'zustand'
import { authApi } from '@/api/authApi'
import { appEnv } from '@/config/env'
import { decodeToken, isTokenValid } from '@/utils/auth'
import type { AuthRole, AuthTokenPayload, AuthUser, LoginPayload } from '@/types/auth'

type AuthState = {
  user: AuthUser | null
  token: string | null
  isInitialized: boolean
  isLoading: boolean
  error: string | null
  login: (payload: LoginPayload) => Promise<AuthUser>
  logout: () => Promise<void>
  initialize: () => void
  hasRole: (roles?: AuthRole[]) => boolean
}

const mapPayloadToUser = (payload: AuthTokenPayload): AuthUser => ({
  id: payload.sub,
  name: payload.name,
  email: payload.email,
  role: payload.role,
})

const readStoredToken = () => {
  try {
    return window.localStorage.getItem(appEnv.authTokenKey)
  } catch {
    return null
  }
}

const storeToken = (token: string | null) => {
  try {
    if (token) {
      window.localStorage.setItem(appEnv.authTokenKey, token)
    } else {
      window.localStorage.removeItem(appEnv.authTokenKey)
    }
  } catch {
    // no-op in environments without storage access
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isInitialized: false,
  isLoading: false,
  error: null,
  async login(payload) {
    set({ isLoading: true, error: null })
    try {
      const { user, token } = await authApi.login(payload)
      storeToken(token)
      set({
        user,
        token,
        isLoading: false,
        error: null,
        isInitialized: true,
      })
      return user
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to log in.'
      set({ error: message, isLoading: false })
      throw new Error(message)
    }
  },
  async logout() {
    set({ isLoading: true })
    try {
      await authApi.logout()
    } finally {
      storeToken(null)
      set({
        user: null,
        token: null,
        isLoading: false,
        error: null,
        isInitialized: true,
      })
    }
  },
  initialize() {
    const { isInitialized } = get()
    if (isInitialized) {
      return
    }

    const token = readStoredToken()
    if (token && isTokenValid(token, appEnv.authTokenSecret)) {
      const payload = decodeToken(token)
      if (payload) {
        set({
          user: mapPayloadToUser(payload),
          token,
          isInitialized: true,
        })
        return
      }
    }

    storeToken(null)
    set({
      user: null,
      token: null,
      isInitialized: true,
    })
  },
  hasRole(roles) {
    if (!roles?.length) return true
    const { user } = get()
    if (!user) return false
    return roles.includes(user.role)
  },
}))
