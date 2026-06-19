import { createFileRoute } from '@tanstack/react-router'

import Search from 'features/search/Search'
import { getSearchHead, getTFunction } from 'router/router.meta'
import { validateSearchQueryParams } from 'router/routes.search'

export const Route = createFileRoute('/_app/vessel-search')({
  component: Search,
  validateSearch: validateSearchQueryParams,
  head: ({ matches }) => getSearchHead(getTFunction(matches)),
})
