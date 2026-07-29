import { createFileRoute } from '@tanstack/react-router'

import Search from 'features/vessels/search/Search'
import { getSearchHead } from 'router/router.meta'
import { validateSearchQueryParams } from 'router/routes.search'

export const Route = createFileRoute('/_platform/_content/vessel-search')({
  component: Search,
  validateSearch: validateSearchQueryParams,
  head: () => getSearchHead(),
})
