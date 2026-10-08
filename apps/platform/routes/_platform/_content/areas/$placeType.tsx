import { createFileRoute, redirect } from '@tanstack/react-router'

import type { OceanAreaType } from '@globalfishingwatch/ocean-areas'
import { ROUTE_PATHS } from '@platform/config/routes'

import Areas from 'features/_places/areas/Areas'
import { getPlacesLoaderDeps, loadPlaces } from 'features/_places/places.loaders'
import { PLACE_TYPES } from 'features/_places/places.types'
import { getAreaTypeTexts } from 'features/_places/places.utils'
import { t } from 'features/i18n/i18n'
import { getPlacesHead } from 'router/router.meta'
import { validatePlacesSearchParams } from 'router/routes.search'

export const Route = createFileRoute('/_platform/_content/areas/$placeType')({
  component: Areas,
  validateSearch: validatePlacesSearchParams,
  beforeLoad: ({ params, search }) => {
    if (PLACE_TYPES.areas.includes(params.placeType as OceanAreaType)) {
      return
    }
    throw redirect({
      to: ROUTE_PATHS.AREAS_TYPE,
      params: { placeType: PLACE_TYPES.areas[0] },
      search,
      replace: true,
    })
  },
  loaderDeps: getPlacesLoaderDeps,
  loader: ({ deps, params }) =>
    loadPlaces('areas', { ...deps, placeType: params.placeType as OceanAreaType }),
  head: ({ loaderData, params }) => {
    const texts = getAreaTypeTexts(t)[params.placeType as OceanAreaType]
    return getPlacesHead({
      category: texts?.label ?? t((s) => s.nav.areas),
      description: texts?.description ?? t((s) => s.places.siteDescription.areas),
      pathname: `/areas/${params.placeType}`,
      items: loaderData?.places.map(({ name }) => ({ name })),
    })
  },
})
