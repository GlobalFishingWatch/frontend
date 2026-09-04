import { handleWorkerRequests } from '@globalfishingwatch/data-transforms/worker'

import type { FilterByPolygomParams, FilteredPolygons } from './reports-geo.utils'
import { filterByPolygon } from './reports-geo.utils'

handleWorkerRequests<FilterByPolygomParams, FilteredPolygons[]>((params) => filterByPolygon(params))
