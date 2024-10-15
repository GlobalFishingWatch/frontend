import { filterByPolygon, FilterByPolygomParams } from './reports-activity-geo.utils'

// eslint-disable-next-line no-restricted-globals
addEventListener('message', (event: MessageEvent<FilterByPolygomParams>) => {
  postMessage(filterByPolygon(event.data))
})
