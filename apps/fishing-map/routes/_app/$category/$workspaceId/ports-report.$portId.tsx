import { createFileRoute } from '@tanstack/react-router'

import { t } from 'features/i18n/i18n'
import PortsReport from 'features/reports/report-port/PortsReport'
import { getRouteHead } from 'router/router.meta'
import { validateReportSearchParams } from 'router/routes.search'

export const Route = createFileRoute('/_app/$category/$workspaceId/ports-report/$portId')({
  component: PortsReport,
  validateSearch: validateReportSearchParams,
  head: () => getRouteHead({ category: t((s) => s.analysis.title) }),
})
