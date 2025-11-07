import HmacSHA256 from 'crypto-js/hmac-sha256'
import encBase64 from 'crypto-js/enc-base64'
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

const timingSafeEqual = (a: string, b: string) => {
  if (a.length !== b.length) return false
  let mismatch = 0
  for (let index = 0; index < a.length; index += 1) {
    mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index)
  }
  return mismatch === 0
}

const createJwtPart = (payload: unknown) => base64Encode(JSON.stringify(payload))

const signSegments = (header: string, body: string, secret: string) =>
  HmacSHA256(`${header}.${body}`, secret).toString(encBase64)

export const createMockToken = (
  user: AuthUser,
  secret: string,
  expiresInMinutes = 60,
) => {
  const header = { alg: 'HS256', typ: 'JWT' }
  const expiry = Date.now() + expiresInMinutes * 60 * 1000
  const body: AuthTokenPayload = {
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    exp: expiry,
  }

  const headerPart = createJwtPart(header)
  const payloadPart = createJwtPart(body)
  const signature = signSegments(headerPart, payloadPart, secret)

  return `${headerPart}.${payloadPart}.${signature}`
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

export const isTokenValid = (token: string, secret: string): boolean => {
  const [header, payload, signature] = token.split('.')
  if (!header || !payload || !signature) return false

  const payloadData = decodeToken(token)
  if (!payloadData) return false

  const expectedSignature = signSegments(header, payload, secret)
  if (!timingSafeEqual(signature, expectedSignature)) {
    return false
  }

  return payloadData.exp > Date.now()
}
