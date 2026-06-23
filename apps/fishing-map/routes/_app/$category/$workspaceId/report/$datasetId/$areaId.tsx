import { createFileRoute } from '@tanstack/react-router'

import { t } from 'features/i18n/i18n'
import AreaReport from 'features/reports/report-area/AreaReport'
import { getRouteHead } from 'router/router.meta'
import { validateReportSearchParams } from 'router/routes.search'

export const Route = createFileRoute('/_app/$category/$workspaceId/report/$datasetId/$areaId')({
  component: AreaReport,
  validateSearch: validateReportSearchParams,
  head: () => getRouteHead({ category: t((s) => s.analysis.title) }),
})
