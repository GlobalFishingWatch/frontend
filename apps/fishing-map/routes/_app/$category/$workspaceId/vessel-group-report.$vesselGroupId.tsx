import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { getRouteHead, getTFuntion } from 'router/router.meta'
import { validateReportSearchParams } from 'router/routes.search'

const VesselGroupReport = lazy(
  () => import('features/reports/report-vessel-group/VesselGroupReport')
)

export const Route = createFileRoute(
  '/_app/$category/$workspaceId/vessel-group-report/$vesselGroupId'
)({
  component: VesselGroupReport,
  validateSearch: validateReportSearchParams,
  head: ({ matches }) => {
    const t = getTFuntion(matches)
    return getRouteHead({ category: t('analysis.title'), t })
  },
})
