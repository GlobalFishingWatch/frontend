import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { t } from 'features/i18n/i18n'
import { getRouteHead } from 'router/router.meta'
import { validateReportSearchParams } from 'router/routes.search'

const AreaReport = lazy(() => import('features/reports/report-area/AreaReport'))

export const Route = createFileRoute('/_app/report/$reportId')({
  component: AreaReport,
  validateSearch: validateReportSearchParams,
  head: () => getRouteHead({ category: t((tr) => tr.analysis.title) }),
})
