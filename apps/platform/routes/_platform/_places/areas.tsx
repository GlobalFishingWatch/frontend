import { createFileRoute } from '@tanstack/react-router'

import {
  EEZ_DATAVIEW_INSTANCE_ID,
  EEZ_DATAVIEW_SLUG,
  FAO_AREAS_DATAVIEW_INSTANCE_ID,
  FAO_AREAS_DATAVIEW_SLUG,
  MPA_DATAVIEW_INSTANCE_ID,
  MPA_DATAVIEW_SLUG,
  RFMO_DATAVIEW_INSTANCE_ID,
  RFMO_DATAVIEW_SLUG,
} from '@platform/config/map/dataviews'

import Areas from 'features/_places/areas/Areas'
import { getPlacesLocale, PLACE_TYPES, searchPlaces } from 'features/_places/places.loaders'
import { SATELLITE_BASEMAP_DATAVIEW_INSTANCE } from 'features/_places/places-map.config'
import { t } from 'features/i18n/i18n'
import { getRouteHead } from 'router/router.meta'

export const Route = createFileRoute('/_platform/_places/areas')({
  component: Areas,
  staticData: {
    placesMapDataviews: {
      eez: [
        SATELLITE_BASEMAP_DATAVIEW_INSTANCE,
        { id: EEZ_DATAVIEW_INSTANCE_ID, dataviewId: EEZ_DATAVIEW_SLUG },
      ],
      fao: [
        SATELLITE_BASEMAP_DATAVIEW_INSTANCE,
        { id: FAO_AREAS_DATAVIEW_INSTANCE_ID, dataviewId: FAO_AREAS_DATAVIEW_SLUG },
      ],
      mpa: [
        SATELLITE_BASEMAP_DATAVIEW_INSTANCE,
        { id: MPA_DATAVIEW_INSTANCE_ID, dataviewId: MPA_DATAVIEW_SLUG },
      ],
      rfmo: [
        SATELLITE_BASEMAP_DATAVIEW_INSTANCE,
        { id: RFMO_DATAVIEW_INSTANCE_ID, dataviewId: RFMO_DATAVIEW_SLUG },
      ],
    },
  },
  loaderDeps: () => ({ locale: getPlacesLocale() }),
  loader: ({ deps }) =>
    searchPlaces({ data: { category: 'areas', type: PLACE_TYPES.areas[0], locale: deps.locale } }),
  head: () => getRouteHead({ category: t((s) => s.nav.areas) }),
})
