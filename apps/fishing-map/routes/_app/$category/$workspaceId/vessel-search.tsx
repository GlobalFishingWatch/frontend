import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { getSearchHead, getTFuntion } from 'router/router.meta'
import { validateSearchQueryParams } from 'router/routes.search'

const Search = lazy(() => import('features/search/Search'))

export const Route = createFileRoute('/_app/$category/$workspaceId/vessel-search')({
  component: Search,
  validateSearch: validateSearchQueryParams,
  head: ({ matches }) => getSearchHead(getTFuntion(matches)),
})
