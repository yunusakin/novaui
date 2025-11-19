import HmacSHA256 from 'crypto-js/hmac-sha256'
import encBase64 from 'crypto-js/enc-base64'
import encUtf8 from 'crypto-js/enc-utf8'
import type { AuthTokenPayload, AuthUser } from '@/types/auth'

const base64Encode = (value: string) => {
  const words = encUtf8.parse(value)
  return encBase64.stringify(words)
}

const base64Decode = (value: string) => {
  try {
    const words = encBase64.parse(value)
    return encUtf8.stringify(words)
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
  // JWT exp claim should be in seconds, not milliseconds
  const expiry = Math.floor(Date.now() / 1000) + expiresInMinutes * 60
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

const parsePayload = (payload: string): AuthTokenPayload | null => {
  const decoded = base64Decode(payload)
  if (!decoded) return null

  try {
    return JSON.parse(decoded) as AuthTokenPayload
  } catch {
    return null
  }
}

export const decodeToken = (token: string): AuthTokenPayload | null => {
  const [, payload] = token.split('.')
  if (!payload) return null

  return parsePayload(payload)
}

export const isTokenValid = (token: string, secret: string): boolean => {
  const [header, payload, signature] = token.split('.')
  if (!header || !payload || !signature) return false

  const payloadData = parsePayload(payload)
  if (!payloadData) return false

  const expectedSignature = signSegments(header, payload, secret)
  if (!timingSafeEqual(signature, expectedSignature)) {
    return false
  }

  // Compare against current time in seconds
  return payloadData.exp > Math.floor(Date.now() / 1000)
}
