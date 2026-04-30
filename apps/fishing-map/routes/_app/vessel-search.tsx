import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'

import { getSearchHead, getTFuntion } from 'router/router.meta'
import { validateSearchQueryParams } from 'router/routes.search'

export const Route = createFileRoute('/_app/vessel-search')({
  component: lazyRouteComponent(() => import('features/search/Search')),
  validateSearch: validateSearchQueryParams,
  head: ({ matches }) => getSearchHead(getTFuntion(matches)),
})
