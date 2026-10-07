import type { Feature, Geometry } from 'geojson'

// The app owns these ids — the workspace the report route loads declares its instances with them,
// so a literal here would silently stop matching if the app ever renamed one.
import {
  EEZ_DATAVIEW_INSTANCE_ID,
  FAO_AREAS_DATAVIEW_INSTANCE_ID,
  FAO_AREAS_DATAVIEW_SLUG,
  MPA_DATAVIEW_INSTANCE_ID,
  RFMO_DATAVIEW_INSTANCE_ID,
} from '@platform/config/map/dataviews'

import eezs from '../../data/eezs.json' with { type: 'json' }
import fao from '../../data/fao.json' with { type: 'json' }
import mpas from '../../data/mpas.json' with { type: 'json' }
import rfmos from '../../data/rfmos.json' with { type: 'json' }
import type { OceanAreaProperties } from '../../ocean-areas'

/** Area types the scripts visit reports for: data, report dataset and context layer of each. */
export type OceanAreaFeature = Feature<Geometry, OceanAreaProperties>

export type AreaType = {
  features: OceanAreaFeature[]
  /** dataset the report route resolves the area against */
  datasetId: string
  /** context layer that must be visible for the highlight to draw */
  dataviewInstanceId: string
  /** needed when the default workspace lacks the instance, else the URL instance resolves to nothing */
  dataviewId?: string
}

export const AREA_TYPES = {
  eez: {
    features: eezs as OceanAreaFeature[],
    datasetId: 'public-eez-areas',
    dataviewInstanceId: EEZ_DATAVIEW_INSTANCE_ID,
  },
  mpa: {
    features: mpas as OceanAreaFeature[],
    datasetId: 'public-mpa-all',
    dataviewInstanceId: MPA_DATAVIEW_INSTANCE_ID,
  },
  fao: {
    features: fao as OceanAreaFeature[],
    datasetId: 'public-fao-major',
    dataviewInstanceId: FAO_AREAS_DATAVIEW_INSTANCE_ID,
    // FAO is not in BASE_CONTEXT_LAYERS_DATAVIEW_INSTANCES, so default-public has no instance to merge into
    dataviewId: FAO_AREAS_DATAVIEW_SLUG,
  },
  rfmo: {
    features: rfmos as OceanAreaFeature[],
    datasetId: 'public-rfmo',
    dataviewInstanceId: RFMO_DATAVIEW_INSTANCE_ID,
  },
} satisfies Record<string, AreaType>

export type AreaTypeId = keyof typeof AREA_TYPES
