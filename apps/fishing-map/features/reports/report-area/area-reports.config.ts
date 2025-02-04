import type { Area, AreaGeometry } from 'features/areas/areas.slice'
import type { Bbox, BufferOperation, BufferUnit } from 'types'

export const REPORT_BUFFER_FEATURE_ID: string = 'buffer'
export const NAUTICAL_MILES: BufferUnit = 'nauticalmiles'
export const KILOMETERS: BufferUnit = 'kilometers'

export const DISSOLVE: BufferOperation = 'dissolve'
export const DIFFERENCE: BufferOperation = 'difference'

export const DEFAULT_BUFFER_VALUE: number = 50
export const DEFAULT_POINT_BUFFER_VALUE: number = 5

export type LastReportStorage = { reportUrl: string; workspaceUrl: string }
export const LAST_REPORTS_STORAGE_KEY = 'lastReports'

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
