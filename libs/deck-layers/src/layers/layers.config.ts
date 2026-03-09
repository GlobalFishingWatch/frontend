export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const IS_TEST_ENV =
  typeof process !== 'undefined' &&
  (process.env?.NODE_ENV === 'test' || process.env?.VITEST === 'true')
export const PATH_BASENAME = process.env.NEXT_PUBLIC_URL || '/map'
export const MAX_FILTER_VALUE = 999999999999999
export const PREVIEW_BUFFER_GENERATOR_ID = 'report-area-preview-buffer'
