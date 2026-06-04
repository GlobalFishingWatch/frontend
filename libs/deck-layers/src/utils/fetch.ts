import { parse } from '@loaders.gl/core'

import { GFWAPI } from '@globalfishingwatch/api-client'

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
  const basename = process.env.NEXT_PUBLIC_URL || '/map'
  const basePath = /^https?:\/\//i.test(basename)
    ? (() => {
        try {
          return new URL(basename).pathname || '/map'
        } catch {
          return '/map'
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

export async function fetchWithGFWAPI(
  url: string,
  { signal, layer }: FetchWithGFWAPIContext = {}
): Promise<unknown> {
  if (isSpriteUrl(url)) {
    return fetchLocalSprite(url, signal)
  }

  const response = await GFWAPI.fetch<Response>(url, {
    method: 'GET',
    signal,
    responseType: 'default',
  })

  const loaders = Array.isArray(layer?.props?.loaders) ? (layer.props.loaders as any[]) : []
  const loader = loaders[0]
  if (loader) {
    const buffer = await response.arrayBuffer()
    return parse(buffer, loader, layer?.props?.loadOptions as any)
  }

  return response
}
