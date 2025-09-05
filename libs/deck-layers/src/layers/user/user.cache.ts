type ResponseCacheEntry = {
  response: ArrayBuffer
  timestamp: number
}

export function cloneArrayBuffer(buffer: ArrayBuffer): ArrayBuffer {
  try {
    return buffer.slice(0)
  } catch {
    // Fallback for detached ArrayBuffers
    const cloned = new ArrayBuffer(buffer.byteLength)
    new Uint8Array(cloned).set(new Uint8Array(buffer))
    return cloned
  }
}

export const responseCache = new Map<string, ResponseCacheEntry>()
const CACHE_EXPIRY_MS = 20 * 60 * 1000 // 20 minutes

export function generateCacheKey(url: string): string {
  const urlObj = new URL(url)
  urlObj.searchParams.delete('filters')
  return urlObj.toString()
}

export function isCacheValid(entry: ResponseCacheEntry): boolean {
  return Date.now() - entry.timestamp < CACHE_EXPIRY_MS
}

export function getCachedResponse(cacheKey: string): ArrayBuffer | null {
  const cachedEntry = responseCache.get(cacheKey)
  if (cachedEntry && isCacheValid(cachedEntry)) {
    return cloneArrayBuffer(cachedEntry.response)
  }
  return null
}

export function clearExpiredCache(): void {
  const now = Date.now()
  for (const [key, entry] of responseCache.entries()) {
    if (now - entry.timestamp >= CACHE_EXPIRY_MS) {
      responseCache.delete(key)
    }
  }
}

export function clearCache(): void {
  responseCache.clear()
}

// Periodic cleanup of expired cache entries
let cleanupInterval: NodeJS.Timeout | null = null
export function startCacheCleanup(): void {
  if (cleanupInterval) return
  cleanupInterval = setInterval(clearExpiredCache, CACHE_EXPIRY_MS)
}

export function stopCacheCleanup(): void {
  if (cleanupInterval) {
    clearInterval(cleanupInterval)
    cleanupInterval = null
  }
}
