import { createFileRoute } from '@tanstack/react-router'

import { AREA_REPORT_LAYERS } from '@platform/config/map/dataviews'

import Areas from 'features/_places/areas/Areas'
import { getPlacesLoaderDeps, loadPlaces } from 'features/_places/places.loaders'
import { SATELLITE_BASEMAP_DATAVIEW_INSTANCE } from 'features/_places/places-map.config'
import { t } from 'features/i18n/i18n'
import { getRouteHead } from 'router/router.meta'
import { validatePlacesSearchParams } from 'router/routes.search'

export const Route = createFileRoute('/_platform/_content/areas')({
  component: Areas,
  staticData: {
    placesMapDataviews: Object.fromEntries(
      Object.entries(AREA_REPORT_LAYERS).map(([type, { dataviewInstanceId, dataviewSlug }]) => [
        type,
        [SATELLITE_BASEMAP_DATAVIEW_INSTANCE, { id: dataviewInstanceId, dataviewId: dataviewSlug }],
      ])
    ),
  },
  validateSearch: validatePlacesSearchParams,
  loaderDeps: getPlacesLoaderDeps,
  loader: ({ deps }) => loadPlaces('areas', deps),
  head: () => getRouteHead({ category: t((s) => s.nav.areas) }),
})
