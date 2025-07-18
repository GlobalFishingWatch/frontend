import { useCallback, useEffect, useRef } from 'react'

import type { FilterByPolygomParams, FilteredPolygons } from './reports-activity-geo.utils'

type Request = {
  resolve: (result: FilteredPolygons[]) => void
  reject: (error: any) => void
}

let worker: Worker | undefined
let idCounter = 0
const requests = new Map<number, Request>()

function getWorker() {
  if (worker === undefined) {
    worker = new Worker(new URL('./reports-activity-geo.utils.workers.ts', import.meta.url))
    worker.onmessage = ({ data }: MessageEvent<{ id: number; result: FilteredPolygons[] }>) => {
      const request = requests.get(data.id)
      if (request) {
        request.resolve(data.result)
        requests.delete(data.id)
      }
    }
    worker.onerror = (ev: ErrorEvent) => {
      requests.forEach((request) => request.reject(ev.error))
      requests.clear()
    }
  }
  return worker
}

export function useFilterCellsByPolygonWorker() {
  const workerRef = useRef<Worker>(undefined)
  if (!workerRef.current) {
    workerRef.current = getWorker()
  }

  useEffect(() => {
    const workerInstance = workerRef.current
    return () => {
      if (workerInstance) {
        requests.clear()
      }
    }
  }, [])

  const filterByPolygon = useCallback((params: FilterByPolygomParams) => {
    const promise: Promise<FilteredPolygons[]> = new Promise((resolve, reject) => {
      const id = idCounter++
      requests.set(id, { resolve, reject })
      workerRef.current?.postMessage({ id, params })
    })
    return promise
  }, [])

  return filterByPolygon
}
