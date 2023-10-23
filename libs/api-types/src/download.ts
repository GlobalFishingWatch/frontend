export type DownloadRateLimit = {
  remaining: number
  limit: number
  reset?: string
  retryAfter: number
}
