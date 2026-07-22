export const getIsBrowser = () => typeof window !== 'undefined'

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
