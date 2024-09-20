import { filterByPolygon, FilterByPolygomParams } from './reports-geo.utils'

// eslint-disable-next-line no-restricted-globals
addEventListener('message', (event: MessageEvent<FilterByPolygomParams>) => {
  postMessage(filterByPolygon(event.data))
})
