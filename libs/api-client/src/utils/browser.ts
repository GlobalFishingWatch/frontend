export const getIsBrowser = () => typeof window !== 'undefined'

// `typeof window !== 'undefined'` is not enough to reach localStorage: Android WebViews expose
// it as null when DOM storage is disabled, and a blocked-storage context (sandboxed iframe,
// third-party storage restrictions) throws SecurityError on the property access itself.
export const safeLocalStorage = {
  get: (key: string): string | null => {
    try {
      return globalThis.localStorage?.getItem(key) ?? null
    } catch {
      return null
    }
  },
  set: (key: string, value: string): void => {
    try {
      globalThis.localStorage?.setItem(key, value)
    } catch {
      // storage unavailable — nothing to persist
    }
  },
  remove: (key: string): void => {
    try {
      globalThis.localStorage?.removeItem(key)
    } catch {
      // storage unavailable — nothing to remove
    }
  },
}

const DEBUG_URL_COLLAPSE_LENGTH = 80

export function logDebugUrl(prefix: string, url: string) {
  let decodedUrl = url
  try {
    decodedUrl = decodeURIComponent(url)
  } catch {
    // leave the raw url as-is
  }
  if (decodedUrl.length <= DEBUG_URL_COLLAPSE_LENGTH) {
    console.log(`${prefix}${decodedUrl}`)
    return
  }
  console.groupCollapsed(`${prefix}${decodedUrl.slice(0, DEBUG_URL_COLLAPSE_LENGTH - 1)} ...`)
  console.log(decodedUrl)
  console.groupEnd()
}
