import { parse } from '@loaders.gl/core'

import { GFWAPI } from '@globalfishingwatch/api-client'

type FetchWithGFWAPIContext = {
  signal?: AbortSignal
  loadOptions?: Record<string, unknown>
  layer?: {
    props?: {
      loaders?: unknown
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

export async function fetchWithGFWAPI(
  url: string,
  { signal, loadOptions, layer }: FetchWithGFWAPIContext = {}
): Promise<unknown> {
  const response = await GFWAPI.fetch<Response>(url, {
    method: 'GET',
    signal,
    responseType: 'default',
  })

  const loaders = Array.isArray(layer?.props?.loaders) ? (layer.props.loaders as any[]) : undefined
  if (loaders?.length) {
    return parse(response, loaders, loadOptions)
  }

  return response
}
