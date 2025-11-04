import type { AuthTokenPayload, AuthUser } from '@/types/auth'

const getBuffer = () => {
  if (typeof globalThis === 'undefined') return undefined
  const maybeBuffer = (globalThis as typeof globalThis & { Buffer?: typeof import('buffer').Buffer })
    .Buffer
  return maybeBuffer
}

const base64Encode = (value: string) => {
  if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
    return window.btoa(value)
  }

  const BufferCtor = getBuffer()
  if (BufferCtor) {
    return BufferCtor.from(value, 'utf-8').toString('base64')
  }

  throw new Error('Unable to encode value as base64.')
}

const base64Decode = (value: string) => {
  try {
    if (typeof window !== 'undefined' && typeof window.atob === 'function') {
      return window.atob(value)
    }

    const BufferCtor = getBuffer()
    if (BufferCtor) {
      return BufferCtor.from(value, 'base64').toString('utf-8')
    }

    return null
  } catch {
    return null
  }
}

const createJwtPart = (payload: unknown) => base64Encode(JSON.stringify(payload))

export const createMockToken = (user: AuthUser, expiresInMinutes = 60) => {
  const header = { alg: 'HS256', typ: 'JWT' }
  const expiry = Date.now() + expiresInMinutes * 60 * 1000
  const body: AuthTokenPayload = {
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    exp: expiry,
  }

  return `${createJwtPart(header)}.${createJwtPart(body)}.mock-signature`
}

export const decodeToken = (token: string): AuthTokenPayload | null => {
  const [, payload] = token.split('.')
  if (!payload) return null

  const decoded = base64Decode(payload)
  if (!decoded) return null

  try {
    return JSON.parse(decoded) as AuthTokenPayload
  } catch {
    return null
  }
}

export const isTokenValid = (token: string): boolean => {
  const payload = decodeToken(token)
  if (!payload) return false
  return payload.exp > Date.now()
}
