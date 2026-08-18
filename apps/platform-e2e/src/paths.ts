/** Matches platform `VITE_PUBLIC_URL` / router basename. */
export const PATH_BASENAME = (process.env.PLAYWRIGHT_PATH_BASENAME || '/platform').replace(
  /\/$/,
  ''
)

/** App-rooted path: `appPath('/map')` → `/platform/map`. */
export function appPath(path = '/'): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  if (normalized === '/') {
    return PATH_BASENAME || '/'
  }
  return `${PATH_BASENAME}${normalized}`
}

export const MAP_PATH = appPath('/map')
