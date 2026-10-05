import { createFileRoute } from '@tanstack/react-router'

import Areas from 'features/_places/areas/Areas'
import { getPlacesLocale, PLACE_TYPES, searchPlaces } from 'features/_places/places.loaders'
import { t } from 'features/i18n/i18n'
import { getRouteHead } from 'router/router.meta'

export const Route = createFileRoute('/_platform/_places/areas')({
  component: Areas,
  loaderDeps: () => ({ locale: getPlacesLocale() }),
  loader: ({ deps }) =>
    searchPlaces({ data: { category: 'areas', type: PLACE_TYPES.areas[0], locale: deps.locale } }),
  head: () => getRouteHead({ category: t((s) => s.nav.areas) }),
})
