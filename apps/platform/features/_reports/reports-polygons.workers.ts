import { handleWorkerRequests } from '@globalfishingwatch/data-transforms/worker'

import type { FilteredPolygons } from './reports-geo.utils'
import type { FilterPolygonsByAreaParams } from './reports-polygons.utils'
import { filterPolygonsByArea } from './reports-polygons.utils'

handleWorkerRequests<FilterPolygonsByAreaParams, FilteredPolygons[]>((params) =>
  filterPolygonsByArea(params)
)
