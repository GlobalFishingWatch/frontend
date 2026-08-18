import { createFileRoute, redirect } from '@tanstack/react-router'

import { ROUTE_PATHS } from '@platform/config/routes'

/** Legacy `/map/report/$reportId` -> `/report/$reportId` */
export const Route = createFileRoute('/_platform/_map/map/report/$reportId')({
  beforeLoad: ({ params, search }) => {
    throw redirect({
      to: ROUTE_PATHS.REPORT,
      params,
      search,
      replace: true,
      statusCode: 308,
    })
  },
})
