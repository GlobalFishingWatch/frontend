/// <reference types="vite/client" />

export function getEnv(key: string, fallback?: string): string | undefined {
  const val = (import.meta.env as Record<string, string | undefined>)?.[key]
  if (val !== undefined) return val
  if (typeof process !== 'undefined') {
    const val = process.env?.[key]
    if (val !== undefined) return val
  }
  return fallback
}

export const IS_PRODUCTION = getEnv('NODE_ENV') === 'production' || getEnv('MODE') === 'production'

const DEFAULT_PATH_BASENAME =
  getEnv('VITE_PUBLIC_URL') || getEnv('NEXT_PUBLIC_URL') || IS_PRODUCTION ? '/map/' : '/'
export const PATH_BASENAME = DEFAULT_PATH_BASENAME.endsWith('/')
  ? DEFAULT_PATH_BASENAME
  : DEFAULT_PATH_BASENAME + '/'
