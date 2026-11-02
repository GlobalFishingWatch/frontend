import { useCallback } from 'react'

import { createWorkerClient } from '@globalfishingwatch/data-transforms/worker'

import type { FilterByPolygomParams, FilteredPolygons } from './reports-geo.utils'
import type { FilterPolygonsByAreaParams } from './reports-polygons.utils'

const filterCellsClient = createWorkerClient<FilterByPolygomParams, FilteredPolygons[]>(
  () => new Worker(new URL('./reports-geo.utils.workers.ts', import.meta.url), { type: 'module' })
)

// A worker of its own so it can be terminated without killing the cells jobs of other callers
const filterPolygonsClient = createWorkerClient<FilterPolygonsByAreaParams, FilteredPolygons[]>(
  () => new Worker(new URL('./reports-polygons.workers.ts', import.meta.url), { type: 'module' })
)

export function useFilterCellsByPolygonWorker() {
  return useCallback((params: FilterByPolygomParams) => filterCellsClient.request(params), [])
}

export function filterPolygonsByAreaInWorker(params: FilterPolygonsByAreaParams) {
  return filterPolygonsClient.request(params)
}

export function terminateFilterPolygonsWorker() {
  filterPolygonsClient.terminate()
}
