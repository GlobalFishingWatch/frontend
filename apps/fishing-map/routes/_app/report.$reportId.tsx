import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { getRouteHead, getTFuntion } from 'router/router.meta'
import { validateReportSearchParams } from 'router/routes.search'

const AreaReport = lazy(() => import('features/reports/report-area/AreaReport'))

export const Route = createFileRoute('/_app/report/$reportId')({
  component: AreaReport,
  validateSearch: validateReportSearchParams,
  head: ({ matches }) => {
    const t = getTFuntion(matches)
    return getRouteHead({ category: t('analysis.title'), t })
  },
})
