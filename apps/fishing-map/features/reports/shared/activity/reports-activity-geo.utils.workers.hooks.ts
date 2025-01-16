import { useCallback, useEffect, useRef } from 'react'

import type { FilterByPolygomParams, FilteredPolygons } from './reports-activity-geo.utils'

export function useFilterCellsByPolygonWorker() {
  const workerRef = useRef<Worker>(undefined)

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('./reports-activity-geo.utils.workers.ts', import.meta.url)
    )
    return () => {
      workerRef.current?.terminate()
    }
  }, [])

  const filterByPolygon = useCallback((params: FilterByPolygomParams) => {
    const promise: Promise<FilteredPolygons[]> = new Promise((resolve, reject) => {
      if (workerRef.current) {
        workerRef.current?.postMessage(params)
        if (workerRef.current) {
          workerRef.current.onmessage = ({ data }: MessageEvent<FilteredPolygons[]>) => {
            resolve(data)
          }
          workerRef.current.onerror = (ev: ErrorEvent) => {
            reject(ev.error)
          }
        }
      } else {
        reject('Worker not ready')
      }
    })
    return promise
  }, [])

  return filterByPolygon
}
