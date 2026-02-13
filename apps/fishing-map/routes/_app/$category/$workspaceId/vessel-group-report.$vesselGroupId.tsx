import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { t } from 'features/i18n/i18n'
import { getRouteHead } from 'router/router.meta'
import { validateReportSearchParams } from 'router/routes.search'

const VesselGroupReport = lazy(
  () => import('features/reports/report-vessel-group/VesselGroupReport')
)

export const Route = createFileRoute(
  '/_app/$category/$workspaceId/vessel-group-report/$vesselGroupId'
)({
  component: VesselGroupReport,
  validateSearch: validateReportSearchParams,
  head: () => getRouteHead({ category: t((tr) => tr.analysis.title) }),
})
