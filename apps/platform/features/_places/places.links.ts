import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { BasemapType } from '@globalfishingwatch/deck-layers'
import type { OceanAreaType } from '@globalfishingwatch/ocean-areas'
import {
  DEFAULT_BASEMAP_DATAVIEW_INSTANCE_ID,
  EEZ_DATAVIEW_INSTANCE_ID,
  FAO_AREAS_DATAVIEW_INSTANCE_ID,
  FAO_AREAS_DATAVIEW_SLUG,
  MPA_DATAVIEW_INSTANCE_ID,
  PORT_VISITS_EVENTS_SOURCE_ID,
  RFMO_DATAVIEW_INSTANCE_ID,
} from '@platform/config/map/dataviews'

import type { Place } from 'features/_places/places.loaders'
import { getPortClusterDataviewForReport } from 'features/_reports/report-port/ports-report.utils'
import { ReportCategory } from 'features/_reports/reports.types'
import type { QueryParams } from 'types'

export type AreaPlaceType = Exclude<OceanAreaType, 'port'>

/** Dataset each area type's report resolves against (also the thumbnails bucket folder). */
export const AREA_DATASET_IDS: Record<AreaPlaceType, string> = {
  eez: 'public-eez-areas',
  mpa: 'public-mpa-all',
  fao: 'public-fao-major',
  rfmo: 'public-rfmo',
}

// The context layer the area report draws its highlight on. FAO is not in the default workspace,
// so it also names its dataview
const AREA_DATAVIEW_INSTANCES: Record<AreaPlaceType, UrlDataviewInstance> = {
  eez: { id: EEZ_DATAVIEW_INSTANCE_ID, config: { visible: true } },
  mpa: { id: MPA_DATAVIEW_INSTANCE_ID, config: { visible: true } },
  rfmo: { id: RFMO_DATAVIEW_INSTANCE_ID, config: { visible: true } },
  fao: {
    id: FAO_AREAS_DATAVIEW_INSTANCE_ID,
    dataviewId: FAO_AREAS_DATAVIEW_SLUG,
    config: { visible: true },
  },
}

/** Search params for the default workspace area report of `type`. */
export const getAreaReportSearch = (type: AreaPlaceType): QueryParams => ({
  dataviewInstances: [AREA_DATAVIEW_INSTANCES[type]],
})

/**
 * Search params the port report reads from the URL, as PortsReportLink sets them: events tab,
 * header name and country, satellite basemap and the port visits layer filtered to the port.
 */
export const getPortReportSearch = ({ id, name, flag }: Place): QueryParams => ({
  reportCategory: ReportCategory.Events,
  portsReportName: name,
  portsReportCountry: flag,
  dataviewInstances: [
    { id: DEFAULT_BASEMAP_DATAVIEW_INSTANCE_ID, config: { basemap: BasemapType.Satellite } },
    getPortClusterDataviewForReport({ id: PORT_VISITS_EVENTS_SOURCE_ID } as UrlDataviewInstance, {
      portId: String(id),
      clusterMaxZoomLevels: { default: 20 },
      visible: true,
    }),
  ],
})
