import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'

import { getRouteHead, getTFunction } from 'router/router.meta'
import { validateReportSearchParams } from 'router/routes.search'

export const Route = createFileRoute(
  '/_app/$category/$workspaceId/vessel-group-report/$vesselGroupId'
)({
  component: lazyRouteComponent(
    () => import('features/reports/report-vessel-group/VesselGroupReport')
  ),
  validateSearch: validateReportSearchParams,
  head: ({ match }) => {
    const t = getTFunction(match)
    return getRouteHead({ category: t('analysis.title'), t })
  },
})
