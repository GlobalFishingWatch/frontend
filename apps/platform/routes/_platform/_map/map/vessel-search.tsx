import { createFileRoute, redirect } from '@tanstack/react-router'

import { ROUTE_PATHS } from '@platform/config/routes'

/** Legacy `/map/vessel-search` -> `/vessel-search` */
export const Route = createFileRoute('/_platform/_map/map/vessel-search')({
  beforeLoad: ({ search }) => {
    throw redirect({
      to: ROUTE_PATHS.SEARCH,
      search,
      replace: true,
      statusCode: 308,
    })
  },
})
