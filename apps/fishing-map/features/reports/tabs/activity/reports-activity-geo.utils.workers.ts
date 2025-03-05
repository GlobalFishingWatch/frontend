import type { FilterByPolygomParams } from './reports-activity-geo.utils'
import { filterByPolygon } from './reports-activity-geo.utils'

addEventListener('message', (event: MessageEvent<FilterByPolygomParams>) => {
  postMessage(filterByPolygon(event.data))
})
