import type { Feature, Geometry } from 'geojson'

// The app owns the report datasets and context layers — the workspace the report route loads
// declares its instances with them, so a literal here would silently stop matching if the app
// ever renamed one.
import type { AreaReportType } from '@platform/config/map/dataviews'
import { AREA_REPORT_LAYERS, getAreaReportDataviewInstance } from '@platform/config/map/dataviews'

import eezs from '../../data/eezs.json' with { type: 'json' }
import fao from '../../data/fao.json' with { type: 'json' }
import mpas from '../../data/mpas.json' with { type: 'json' }
import rfmos from '../../data/rfmos.json' with { type: 'json' }
import type { OceanAreaProperties } from '../../ocean-areas'

export type OceanAreaFeature = Feature<Geometry, OceanAreaProperties>

/** Area types the scripts visit reports for: data, report dataset and context layer of each. */
export type AreaType = {
  features: OceanAreaFeature[]
  /** dataset the report route resolves the area against */
  datasetId: string
  /** context layer that must be visible for the highlight to draw */
  dataviewInstance: ReturnType<typeof getAreaReportDataviewInstance>
}

const getAreaType = (type: AreaReportType, features: unknown): AreaType => ({
  features: features as OceanAreaFeature[],
  datasetId: AREA_REPORT_LAYERS[type].datasetId,
  dataviewInstance: getAreaReportDataviewInstance(type),
})

export const AREA_TYPES = {
  eez: getAreaType('eez', eezs),
  mpa: getAreaType('mpa', mpas),
  fao: getAreaType('fao', fao),
  rfmo: getAreaType('rfmo', rfmos),
} satisfies Record<AreaReportType, AreaType>

export type AreaTypeId = keyof typeof AREA_TYPES
