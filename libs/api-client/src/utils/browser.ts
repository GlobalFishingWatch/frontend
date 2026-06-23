export const getIsBrowser = () => typeof window !== 'undefined'

const DEBUG_URL_COLLAPSE_LENGTH = 80

/** Log a URL; long ones use a collapsed console group with the full URL inside. */
export function logDebugUrl(prefix: string, url: string) {
  if (url.length <= DEBUG_URL_COLLAPSE_LENGTH) {
    console.log(`${prefix}${url}`)
    return
  }
  console.groupCollapsed(
    `${prefix}${decodeURIComponent(url.slice(0, DEBUG_URL_COLLAPSE_LENGTH - 1))} ...`
  )
  console.log(decodeURIComponent(url))
  console.groupEnd()
}
