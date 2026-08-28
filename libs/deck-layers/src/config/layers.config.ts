/// <reference types="vite/client" />

export function getEnv(key: string, fallback?: string): string | undefined {
  if (typeof import.meta !== 'undefined') {
    const val = (import.meta.env as Record<string, string | undefined>)?.[key]
    if (val !== undefined) return val
  }
  if (typeof process !== 'undefined') {
    const val = process.env?.[key]
    if (val !== undefined) return val
  }
  return fallback
}

export const IS_TEST_ENV = getEnv('NODE_ENV') === 'test' || getEnv('VITEST') === 'true'

const DEFAULT_PATH_BASENAME = getEnv('VITE_PUBLIC_URL') || getEnv('NEXT_PUBLIC_URL') || '/platform/'
export const PATH_BASENAME = DEFAULT_PATH_BASENAME.endsWith('/')
  ? DEFAULT_PATH_BASENAME
  : DEFAULT_PATH_BASENAME + '/'

/* Layers that exist only to be picked so we can skip in the draw pass */
export const PICK_ONLY_LAYER_ID_SUFFIX = '-interactive'

/*
 * Width of the hover target, in pixels (Shared by vessel tracks and user tracks)
 * The track is drawn at `getWidth`; then the vertex shader widens it to this only during the picking pass
 */
export const TRACK_PICK_WIDTH = 15
/** Default drawn width, in pixels. */
export const TRACK_VISIBLE_WIDTH = 1.5

export const MAX_FILTER_VALUE = 999999999999999
export const PREVIEW_BUFFER_GENERATOR_ID = 'report-area-preview-buffer'
export const DEFAULT_ID_PROPERTY = 'gfw_id'
