import { createFileRoute, redirect } from '@tanstack/react-router'

import { ROUTE_PATHS } from '@platform/config/routes'

/** Legacy `/map/vessel/$vesselId` -> `/vessel/$vesselId` */
export const Route = createFileRoute('/_platform/_map/map/vessel/$vesselId')({
  beforeLoad: ({ params, search }) => {
    throw redirect({
      to: ROUTE_PATHS.VESSEL,
      params,
      search,
      replace: true,
      statusCode: 308,
    })
  },
})
