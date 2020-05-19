import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'
import { stats, statsByZoom } from './types'

type ExtendedPromise<T> = Promise<T> & {
  resolved?: boolean
  error?: boolean
}

const controllerCache: { [key: string]: AbortController } = {}
export const fetchStats = (url: string, serverSideFilters?: string, singleFrame = false) => {
  const statsUrl = new URL(url)
  if (singleFrame) {
    statsUrl.searchParams.set('temporal-aggregation', 'true')
  }
  if (serverSideFilters) {
    statsUrl.searchParams.set('filters', serverSideFilters)
  }
  if (controllerCache[url]) {
    controllerCache[url].abort()
  }
  controllerCache[url] = new AbortController()
  const promise: ExtendedPromise<statsByZoom> = fetch(statsUrl.toString(), {
    signal: controllerCache[url].signal,
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

export const getServerSideFilters = (start: string, end: string, serverSideFilter = '') => {
  const serverSideFiltersList = serverSideFilter ? [serverSideFilter] : []
  serverSideFiltersList.push(`timestamp >= '${start.slice(0, 19).replace('T', ' ')}'`)
  serverSideFiltersList.push(`timestamp <= '${end.slice(0, 19).replace('T', ' ')}'`)

  return serverSideFiltersList.join(' AND ')
}
