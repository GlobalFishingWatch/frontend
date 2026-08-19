import { parse } from '@loaders.gl/core'
import { MVTLoader } from '@loaders.gl/mvt'

import type { FetchOptions } from '@globalfishingwatch/api-client'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { VESSEL_TRACKS_LOADER_ID } from '@globalfishingwatch/deck-loaders'

import { getEnv } from '#config/layers.config'

export const GFWMVTLoader = {
  ...MVTLoader,
  // TODO: match api response with standard to avoid this override
  mimeTypes: [...MVTLoader.mimeTypes, 'application/octet-stream'],
} as unknown as typeof MVTLoader

type FetchWithGFWAPIContext = {
  signal?: AbortSignal
  layer?: {
    props?: {
      loaders?: unknown
      loadOptions?: unknown
    }
  }
}

export function getFetchLoadOptions(extraOptions = {}) {
  return {
    fetch: {
      headers: {
        Authorization: `Bearer ${GFWAPI.token}`,
      },
      ...extraOptions,
    },
  }
}

/** Deck icon atlases served from the app public folder (e.g. vessel-sprite.png, events-color-sprite.png). */
const DECK_SPRITE_PATTERN = /-sprite\.png$/i

function isSpriteUrl(url: string): boolean {
  return DECK_SPRITE_PATTERN.test(url)
}

function getSpriteFilename(url: string): string {
  const match = url.match(/[^/]*-sprite\.png$/i)
  return match?.[0] ?? 'vessel-sprite.png'
}

function resolveLocalSpriteUrl(url: string): string {
  const filename = getSpriteFilename(url)
  const basename = getEnv('VITE_PUBLIC_URL') || getEnv('NEXT_PUBLIC_URL') || '/platform'
  const basePath = /^https?:\/\//i.test(basename)
    ? (() => {
        try {
          return new URL(basename).pathname || '/platform'
        } catch {
          return '/platform'
        }
      })()
    : basename
  const path = `${basePath.replace(/\/$/, '')}/${filename}`
  if (typeof window !== 'undefined' && window.location?.origin) {
    return new URL(path, window.location.origin).href
  }
  return path
}

async function fetchLocalSprite(url: string, signal?: AbortSignal): Promise<ImageBitmap> {
  const response = await fetch(resolveLocalSpriteUrl(url), { signal })
  if (!response.ok) {
    throw new Error(`Failed to load sprite ${getSpriteFilename(url)} (${response.status})`)
  }
  const blob = await response.blob()
  return createImageBitmap(blob)
}

function getTimestampBase(response: Response): number | null {
  const header = response.headers.get('timestamp-base')
  if (header == null) {
    return null
  }
  const base = Number(header)
  return Number.isFinite(base) && base > 0 ? base : null
}

export async function fetchWithGFWAPI(
  url: string,
  { signal, layer }: FetchWithGFWAPIContext = {}
): Promise<unknown> {
  if (isSpriteUrl(url)) {
    return fetchLocalSprite(url, signal)
  }
  const fetchOptions: FetchOptions = {
    method: 'GET',
    signal,
    responseType: 'default',
  }
  let response = await GFWAPI.fetch<Response>(url, fetchOptions)

  const loaders = Array.isArray(layer?.props?.loaders) ? (layer.props.loaders as any[]) : []
  const loader = loaders[0]
  if (!loader) {
    return response
  }

  const loadOptions = layer?.props?.loadOptions as any
  if (loader.id !== VESSEL_TRACKS_LOADER_ID) {
    return parse(await response.arrayBuffer(), loader, loadOptions)
  }

  let timestampBase = getTimestampBase(response)
  if (timestampBase === null) {
    response = await GFWAPI.fetch<Response>(url, { ...fetchOptions, cache: 'reload' })
    timestampBase = getTimestampBase(response)
  }
  if (timestampBase === null) {
    throw new Error(`Missing timestamp-base header for track chunk: ${url}`)
  }

  return parse(await response.arrayBuffer(), loader, {
    ...loadOptions,
    [VESSEL_TRACKS_LOADER_ID]: {
      ...(loadOptions?.[VESSEL_TRACKS_LOADER_ID] || {}),
      timestampBase,
    },
  })
}
