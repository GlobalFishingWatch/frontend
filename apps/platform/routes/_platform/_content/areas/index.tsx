import { createFileRoute, redirect } from '@tanstack/react-router'

import { ROUTE_PATHS } from '@platform/config/routes'

import { PLACE_TYPES } from 'features/_places/places.types'
import { validatePlacesSearchParams } from 'router/routes.search'

/** `/areas` -> `/areas/eez` */
export const Route = createFileRoute('/_platform/_content/areas/')({
  validateSearch: validatePlacesSearchParams,
  beforeLoad: ({ search }) => {
    throw redirect({
      to: ROUTE_PATHS.AREAS_TYPE,
      params: { placeType: PLACE_TYPES.areas[0] },
      search,
      replace: true,
      statusCode: 308,
    })
  },
})
