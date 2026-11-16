export type RateLimit = {
  remaining: number
  limit: number
  reset?: string
  retryAfter: number
}
