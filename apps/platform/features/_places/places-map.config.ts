import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { BasemapType } from '@globalfishingwatch/deck-layers/config'
import type { OceanAreaType } from '@globalfishingwatch/ocean-areas'
import {
  AREA_REPORT_LAYERS,
  BASEMAP_LABELS_DATAVIEW_INSTANCE_ID,
  BASEMAP_LABELS_DATAVIEW_SLUG,
  PORTS_GLOBAL_DATAVIEW_SLUG,
} from '@platform/config/map/dataviews'

import { DEFAULT_BASEMAP_DATAVIEW_INSTANCE } from 'data/map/dataviews'
import { PORTS_LAYER_ID } from 'features/_map/map/map.config'

export type PlacesMapDataviews = Partial<Record<OceanAreaType, UrlDataviewInstance[]>>

export const SATELLITE_BASEMAP_DATAVIEW_INSTANCE: UrlDataviewInstance = {
  ...DEFAULT_BASEMAP_DATAVIEW_INSTANCE,
  config: { ...DEFAULT_BASEMAP_DATAVIEW_INSTANCE.config, basemap: BasemapType.Satellite },
}

export const AREAS_MAP_DATAVIEWS: PlacesMapDataviews = Object.fromEntries(
  Object.entries(AREA_REPORT_LAYERS).map(([type, { dataviewInstanceId, dataviewSlug }]) => [
    type,
    [SATELLITE_BASEMAP_DATAVIEW_INSTANCE, { id: dataviewInstanceId, dataviewId: dataviewSlug }],
  ])
)

export const PORTS_MAP_DATAVIEWS: PlacesMapDataviews = {
  port: [
    SATELLITE_BASEMAP_DATAVIEW_INSTANCE,
    { id: PORTS_LAYER_ID, dataviewId: PORTS_GLOBAL_DATAVIEW_SLUG },
    { id: BASEMAP_LABELS_DATAVIEW_INSTANCE_ID, dataviewId: BASEMAP_LABELS_DATAVIEW_SLUG },
  ],
}
