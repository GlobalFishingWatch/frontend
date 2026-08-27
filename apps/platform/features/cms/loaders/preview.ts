export type CmsRequestMode = {
  useCache: boolean
  /** Left undefined outside preview, so Strapi applies its default (published). */
  status?: 'draft' | 'published'
}

const isAuthorized = (
  searchParams: URLSearchParams,
  param: string,
  secret: string | undefined,
  isDev: boolean
): boolean => {
  // presence, not value — a bare `?nocache` parses to an empty string
  if (!searchParams.has(param)) {
    return false
  }
  if (isDev) {
    return true
  }
  return !!secret && searchParams.get(param) === secret
}

export const resolveCmsRequestMode = (
  searchParams: URLSearchParams,
  secret: string | undefined,
  isDev: boolean
): CmsRequestMode => {
  if (isAuthorized(searchParams, 'preview', secret, isDev)) {
    return {
      useCache: false,
      status: searchParams.get('status') === 'published' ? 'published' : 'draft',
    }
  }
  return { useCache: !isAuthorized(searchParams, 'nocache', secret, isDev) }
}
