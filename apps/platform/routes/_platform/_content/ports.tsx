import { createFileRoute } from '@tanstack/react-router'

import {
  BASEMAP_LABELS_DATAVIEW_INSTANCE_ID,
  BASEMAP_LABELS_DATAVIEW_SLUG,
  PORTS_GLOBAL_DATAVIEW_SLUG,
} from '@platform/config/map/dataviews'

import { PORTS_LAYER_ID } from 'features/_map/map/map.config'
import { getPlacesLoaderDeps, loadPlaces } from 'features/_places/places.loaders'
import { SATELLITE_BASEMAP_DATAVIEW_INSTANCE } from 'features/_places/places-map.config'
import Ports from 'features/_places/ports/Ports'
import { t } from 'features/i18n/i18n'
import { getRouteHead } from 'router/router.meta'
import { validatePlacesSearchParams } from 'router/routes.search'

export const Route = createFileRoute('/_platform/_content/ports')({
  component: Ports,
  staticData: {
    placesMapDataviews: {
      port: [
        SATELLITE_BASEMAP_DATAVIEW_INSTANCE,
        { id: PORTS_LAYER_ID, dataviewId: PORTS_GLOBAL_DATAVIEW_SLUG },
        { id: BASEMAP_LABELS_DATAVIEW_INSTANCE_ID, dataviewId: BASEMAP_LABELS_DATAVIEW_SLUG },
      ],
    },
  },
  validateSearch: validatePlacesSearchParams,
  loaderDeps: getPlacesLoaderDeps,
  loader: ({ deps }) => loadPlaces('ports', deps),
  head: () => getRouteHead({ category: t((s) => s.nav.ports) }),
})
