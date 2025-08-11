export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const ROOT_DOM_ELEMENT = '__next'
export const APPLICATION_ID = 'api-portal'
export const APPLICATION_NAME = 'API Portal'
export const PATH_BASENAME = process.env.NEXT_PUBLIC_URL || (IS_PRODUCTION ? '/api-portal' : '')
export const GOOGLE_TAG_MANAGER_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID || 'GTM-KK5ZFST'
export const GOOGLE_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID || 'G-R3PWRQW70G'
export const GOOGLE_ANALYTICS_DEBUG_MODE =
  (process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_DEBUG_MODE || 'false').toLowerCase() === 'true'
