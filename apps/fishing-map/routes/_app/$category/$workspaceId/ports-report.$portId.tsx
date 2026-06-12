import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'

import { getRouteHead, getTFunction } from 'router/router.meta'
import { validateReportSearchParams } from 'router/routes.search'

export const Route = createFileRoute('/_app/$category/$workspaceId/ports-report/$portId')({
  component: lazyRouteComponent(() => import('features/reports/report-port/PortsReport')),
  validateSearch: validateReportSearchParams,
  head: ({ match }) => {
    const t = getTFunction(match)
    return getRouteHead({ category: t('analysis.title'), t })
  },
})
