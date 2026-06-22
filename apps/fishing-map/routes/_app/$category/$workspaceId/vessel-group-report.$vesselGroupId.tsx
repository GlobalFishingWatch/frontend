import { createFileRoute } from '@tanstack/react-router'

import { t } from 'features/i18n/i18n'
import VesselGroupReport from 'features/reports/report-vessel-group/VesselGroupReport'
import { getRouteHead } from 'router/router.meta'
import { validateReportSearchParams } from 'router/routes.search'

export const Route = createFileRoute(
  '/_app/$category/$workspaceId/vessel-group-report/$vesselGroupId'
)({
  component: VesselGroupReport,
  validateSearch: validateReportSearchParams,
  head: () => getRouteHead({ category: t((s) => s.analysis.title) }),
})
