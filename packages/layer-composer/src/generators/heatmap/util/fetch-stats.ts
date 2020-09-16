import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'
import { stats, statsByZoom } from '../types'

type ExtendedPromise<T> = Promise<T> & {
  resolved?: boolean
  error?: boolean
}

const controllerCache: { [key: string]: AbortController } = {}
export default function fetchStats(
  url: string,
  dateRange = '',
  serverSideFilters = '',
  singleFrame = false,
  token?: string
) {
  const statsUrl = new URL(url)
  if (singleFrame) {
    statsUrl.searchParams.set('temporal-aggregation', 'true')
  }
  if (dateRange) {
    statsUrl.searchParams.set('date-range', dateRange)
  }
  if (controllerCache[url]) {
    controllerCache[url].abort()
  }
  const statsUrlString = statsUrl.toString()
  const finalurl = serverSideFilters
    ? statsUrlString + `&${serverSideFilters}`
    : statsUrl.toString()
  controllerCache[url] = new AbortController()
  const promise: ExtendedPromise<statsByZoom> = fetch(finalurl, {
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
