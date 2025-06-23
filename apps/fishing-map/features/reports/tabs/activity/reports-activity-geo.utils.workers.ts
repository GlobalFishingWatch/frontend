import type { FilterByPolygomParams } from './reports-activity-geo.utils'
import { filterByPolygon } from './reports-activity-geo.utils'

addEventListener(
  'message',
  (event: MessageEvent<{ id: number; params: FilterByPolygomParams }>) => {
    const { id, params } = event.data
    const result = filterByPolygon(params)
    postMessage({ id, result })
  }
)
