type EnvKey = 'VITE_ENV' | 'VITE_USER_API' | 'VITE_PRODUCT_API' | 'VITE_ORDER_API'

const readEnv = (key: EnvKey, fallback?: string): string => {
  const value = import.meta.env[key] as string | undefined
  if (value?.length) {
    return value
  }

  if (fallback !== undefined) {
    return fallback
  }

  throw new Error(`Missing required environment variable: ${key}`)
}

export const appEnv = {
  appEnv: readEnv('VITE_ENV', import.meta.env.MODE),
  userApi: readEnv('VITE_USER_API'),
  productApi: readEnv('VITE_PRODUCT_API'),
  orderApi: readEnv('VITE_ORDER_API'),
} as const

export type AppEnv = typeof appEnv
