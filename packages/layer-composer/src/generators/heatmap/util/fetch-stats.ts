import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'
import { stats, statsByZoom } from '../types'

type ExtendedPromise<T> = Promise<T> & {
  resolved?: boolean
  error?: boolean
}

const controllerCache: { [key: string]: AbortController } = {}
export default function fetchStats(
  url: string,
  serverSideFilters = '',
  singleFrame = false,
  token?: string
) {
  const statsUrl = new URL(url)
  if (singleFrame) {
    statsUrl.searchParams.set('temporal-aggregation', 'true')
  }
  if (serverSideFilters) {
    // TODO once we support multiple datasetsConfig in same dataview
    // generate filters array
    statsUrl.searchParams.set('filters[0]', serverSideFilters)
  }
  if (controllerCache[url]) {
    controllerCache[url].abort()
  }
  controllerCache[url] = new AbortController()
  const promise: ExtendedPromise<statsByZoom> = fetch(statsUrl.toString(), {
    signal: controllerCache[url].signal,
    ...(token && {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  })
    .then((r) => {
      if (r.ok) return r.json()
      throw r
    })
    .then((statsResponse) => {
      const stats = statsResponse.reduce((acc: statsByZoom, next: stats) => {
        acc[next.zoom] = next
        return acc
      }, {})
      promise.resolved = true
      return stats
    })
    .catch((e) => {
      console.warn(e)
      promise.resolved = true
      promise.error = true
      throw e
    })
  promise.resolved = false
  promise.error = false
  return promise
}
