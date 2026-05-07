import { GFWAPI } from '@globalfishingwatch/api-client'

type FetchWithGFWAPIContext = {
  signal?: AbortSignal
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
  { signal, layer }: FetchWithGFWAPIContext = {}
): Promise<unknown> {
  const response = await GFWAPI.fetch<Response>(url, {
    method: 'GET',
    signal,
    responseType: 'default',
  })

  const loaders = Array.isArray(layer?.props?.loaders) ? (layer.props.loaders as any[]) : []
  const loader = loaders[0]
  if (loader?.parseSync || loader?.parse) {
    const buffer = await response.arrayBuffer()
    return loader.parseSync ? loader.parseSync(buffer) : await loader.parse(buffer)
  }

  return response
}
