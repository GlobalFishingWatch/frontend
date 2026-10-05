import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { BasemapType } from '@globalfishingwatch/deck-layers'
import type { OceanAreaType } from '@globalfishingwatch/ocean-areas'

import { DEFAULT_BASEMAP_DATAVIEW_INSTANCE } from 'data/map/dataviews'

export type PlacesMapDataviews = Partial<Record<OceanAreaType, UrlDataviewInstance[]>>

declare module '@tanstack/react-router' {
  interface StaticDataRouteOption {
    placesMapDataviews?: PlacesMapDataviews
  }
}

export const SATELLITE_BASEMAP_DATAVIEW_INSTANCE: UrlDataviewInstance = {
  ...DEFAULT_BASEMAP_DATAVIEW_INSTANCE,
  config: { ...DEFAULT_BASEMAP_DATAVIEW_INSTANCE.config, basemap: BasemapType.Satellite },
}
