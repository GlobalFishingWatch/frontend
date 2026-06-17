import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'

import { getRouteHead, getTFunction } from 'router/router.meta'
import { validateReportSearchParams } from 'router/routes.search'

export const Route = createFileRoute('/_app/report/$reportId')({
  component: lazyRouteComponent(() => import('features/reports/report-area/AreaReport')),
  validateSearch: validateReportSearchParams,
  head: ({ matches }) => {
    const t = getTFunction(matches)
    return getRouteHead({ category: t('analysis.title'), t })
  },
})
