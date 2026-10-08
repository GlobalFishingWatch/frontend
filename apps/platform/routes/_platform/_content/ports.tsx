import { createFileRoute } from '@tanstack/react-router'

import { ROUTE_PATHS } from '@platform/config/routes'

import { getPlacesLoaderDeps, loadPlaces } from 'features/_places/places.loaders'
import Ports from 'features/_places/ports/Ports'
import { t } from 'features/i18n/i18n'
import { getPlacesHead } from 'router/router.meta'
import { validatePlacesSearchParams } from 'router/routes.search'

export const Route = createFileRoute('/_platform/_content/ports')({
  component: Ports,
  validateSearch: validatePlacesSearchParams,
  loaderDeps: getPlacesLoaderDeps,
  loader: ({ deps }) => loadPlaces('ports', deps),
  head: ({ loaderData }) =>
    getPlacesHead({
      category: t((s) => s.nav.ports),
      description: t((s) => s.places.siteDescription.ports),
      pathname: ROUTE_PATHS.PORTS,
      // ponytail: only ports have a stable profile URL; area reports carry workspace search params
      items: loaderData?.places.map(({ id, name }) => ({ name, pathname: `/ports/${id}` })),
    }),
})
