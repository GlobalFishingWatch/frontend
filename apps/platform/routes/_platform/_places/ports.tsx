import { createFileRoute } from '@tanstack/react-router'

import { getPlacesLocale, searchPlaces } from 'features/_places/places.loaders'
import Ports from 'features/_places/ports/Ports'
import { t } from 'features/i18n/i18n'
import { getRouteHead } from 'router/router.meta'

export const Route = createFileRoute('/_platform/_places/ports')({
  component: Ports,
  loaderDeps: () => ({ locale: getPlacesLocale() }),
  loader: ({ deps }) => searchPlaces({ data: { category: 'ports', locale: deps.locale } }),
  head: () => getRouteHead({ category: t((s) => s.nav.ports) }),
})
