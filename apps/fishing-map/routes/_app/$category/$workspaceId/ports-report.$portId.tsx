import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { getRouteHead, getTFuntion } from 'router/router.meta'
import { validateReportSearchParams } from 'router/routes.search'

const PortsReport = lazy(() => import('features/reports/report-port/PortsReport'))

export const Route = createFileRoute('/_app/$category/$workspaceId/ports-report/$portId')({
  component: PortsReport,
  validateSearch: validateReportSearchParams,
  head: ({ matches }) => {
    const t = getTFuntion(matches)
    return getRouteHead({ category: t('analysis.title'), t })
  },
})
