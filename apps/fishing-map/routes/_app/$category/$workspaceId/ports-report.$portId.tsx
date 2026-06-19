import { createFileRoute } from '@tanstack/react-router'

import PortsReport from 'features/reports/report-port/PortsReport'
import { getRouteHead, getTFunction } from 'router/router.meta'
import { validateReportSearchParams } from 'router/routes.search'

export const Route = createFileRoute('/_app/$category/$workspaceId/ports-report/$portId')({
  component: PortsReport,
  validateSearch: validateReportSearchParams,
  head: ({ matches }) => {
    const t = getTFunction(matches)
    return getRouteHead({ category: t('analysis.title'), t })
  },
})
