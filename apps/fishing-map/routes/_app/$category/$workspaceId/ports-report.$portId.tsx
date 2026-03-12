import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { t } from 'features/i18n/i18n'
import { getRouteHead } from 'router/router.meta'
import { validateReportSearchParams } from 'router/routes.search'

const PortsReport = lazy(() => import('features/reports/report-port/PortsReport'))

export const Route = createFileRoute('/_app/$category/$workspaceId/ports-report/$portId')({
  component: PortsReport,
  validateSearch: validateReportSearchParams,
  head: () => getRouteHead({ category: t((tr) => tr.analysis.title) }),
})
