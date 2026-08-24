import { createFileRoute, redirect } from '@tanstack/react-router'

import { ROUTE_PATHS } from '@platform/config/routes'

/** Legacy `/map/user` -> `/user` */
export const Route = createFileRoute('/_platform/_map/map/user')({
  beforeLoad: ({ search }) => {
    throw redirect({
      to: ROUTE_PATHS.USER,
      search,
      replace: true,
      statusCode: 308,
    })
  },
})
