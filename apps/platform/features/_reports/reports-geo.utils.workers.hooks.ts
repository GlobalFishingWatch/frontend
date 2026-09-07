import { useCallback } from 'react'

import { createWorkerClient } from '@globalfishingwatch/data-transforms/worker'

import type { FilterByPolygomParams, FilteredPolygons } from './reports-geo.utils'

const filterCellsClient = createWorkerClient<FilterByPolygomParams, FilteredPolygons[]>(
  new URL('./reports-geo.utils.workers.ts', import.meta.url)
)

export function useFilterCellsByPolygonWorker() {
  return useCallback((params: FilterByPolygomParams) => filterCellsClient.request(params), [])
}
