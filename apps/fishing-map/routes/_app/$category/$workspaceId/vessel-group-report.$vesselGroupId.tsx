import { createFileRoute } from '@tanstack/react-router'

import VesselGroupReport from 'features/reports/report-vessel-group/VesselGroupReport'
import { getRouteHead, getTFunction } from 'router/router.meta'
import { validateReportSearchParams } from 'router/routes.search'

export const Route = createFileRoute(
  '/_app/$category/$workspaceId/vessel-group-report/$vesselGroupId'
)({
  component: VesselGroupReport,
  validateSearch: validateReportSearchParams,
  head: ({ matches }) => {
    const t = getTFunction(matches)
    return getRouteHead({ category: t('analysis.title'), t })
  },
})
