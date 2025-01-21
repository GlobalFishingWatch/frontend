import type { Bbox,BufferOperation, BufferUnit } from 'types'

import {
  REPORT_ACTIVITY_GRAPH_EVOLUTION,
  REPORT_VESSELS_GRAPH_FLAG,
  REPORT_VESSELS_PER_PAGE,
} from 'data/config'
import type { Area, AreaGeometry } from 'features/areas/areas.slice'

import type { AreaReportState } from './area-reports.types'

export const REPORT_BUFFER_FEATURE_ID: string = 'buffer'
export const DEFAULT_BUFFER_VALUE: number = 50
export const NAUTICAL_MILES: BufferUnit = 'nauticalmiles'
export const KILOMETERS: BufferUnit = 'kilometers'

export const DISSOLVE: BufferOperation = 'dissolve'
export const DIFFERENCE: BufferOperation = 'difference'
export const DEFAULT_BUFFER_OPERATION: BufferOperation = DISSOLVE

export const DEFAULT_POINT_BUFFER_UNIT: BufferUnit = NAUTICAL_MILES
export const DEFAULT_POINT_BUFFER_VALUE: number = 5
export type LastReportStorage = { reportUrl: string; workspaceUrl: string }
export const LAST_REPORTS_STORAGE_KEY = 'lastReports'

export const EMPTY_API_VALUES = ['NULL', undefined, '']
export const MAX_CATEGORIES = 5
export const OTHERS_CATEGORY_LABEL = 'OTHERS'

export const MAX_DAYS_TO_COMPARE = 100
export const MAX_MONTHS_TO_COMPARE = 12

export const DEFAULT_AREA_REPORT_STATE: AreaReportState = {
  reportActivityGraph: REPORT_ACTIVITY_GRAPH_EVOLUTION,
  reportCategory: undefined,
  reportVesselFilter: '',
  reportVesselGraph: REPORT_VESSELS_GRAPH_FLAG,
  reportVesselPage: 0,
  reportResultsPerPage: REPORT_VESSELS_PER_PAGE,
  reportAreaBounds: undefined,
  reportTimeComparison: undefined,
  reportBufferValue: undefined,
  reportBufferUnit: undefined,
  reportBufferOperation: undefined,
}

export const ENTIRE_WORLD_REPORT_AREA_ID = 'world'
export const ENTIRE_WORLD_REPORT_AREA_BOUNDS = [-180, -90, 180, 90] as Bbox

export const ENTIRE_WORLD_REPORT_AREA: Area<AreaGeometry> = {
  id: ENTIRE_WORLD_REPORT_AREA_ID,
  name: 'Entire World',
  type: 'Feature',
  bounds: ENTIRE_WORLD_REPORT_AREA_BOUNDS,
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [-180, -90],
        [180, -90],
        [180, 90],
        [-180, 90],
        [-180, -90],
      ],
    ],
  },
  properties: {},
}
