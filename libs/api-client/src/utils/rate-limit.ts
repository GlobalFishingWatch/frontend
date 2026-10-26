import type { RateLimit } from '@globalfishingwatch/api-types'

export type RateLimitDebug = (message: string, data?: Record<string, unknown>) => void

/** Path only, track urls carry long query strings */
export const getRateLimitLogUrl = (url: string) => {
  try {
    return new URL(url, 'http://localhost').pathname
  } catch {
    return url
  }
}

// Turnstile action the reset endpoint must check in the siteverify result
export const RATE_LIMIT_CHALLENGE_ACTION = 'rate-limit-reset'

export const parseRateLimit = (response: Response): RateLimit => ({
  remaining: parseInt(response.headers?.get('Ratelimit-Remaining') || ''),
  limit: parseInt(response.headers?.get('Ratelimit-Limit') || '10'),
  retryAfter: parseInt(response.headers?.get('Retry-After') || '0'),
  reset: response.headers?.get('Ratelimit-Reset') ?? undefined,
})

// ponytail: matched by url, switch to a RateLimit-Policy header if the API adds one
const VISUALIZATION_RATE_LIMITED_URL = /\/vessels\/[^/?]+\/tracks(\?|$)|\/events(\?|$)/

export const isVisualizationRateLimitedUrl = (url: string) =>
  VISUALIZATION_RATE_LIMITED_URL.test(url)
