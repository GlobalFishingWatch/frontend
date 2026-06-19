import { createFileRoute } from '@tanstack/react-router'

import AreaReport from 'features/reports/report-area/AreaReport'
import { getRouteHead, getTFunction } from 'router/router.meta'
import { validateReportSearchParams } from 'router/routes.search'

export const Route = createFileRoute('/_app/$category/$workspaceId/report/$datasetId/$areaId')({
  component: AreaReport,
  validateSearch: validateReportSearchParams,
  head: ({ matches }) => {
    const t = getTFunction(matches)
    return getRouteHead({ category: t('analysis.title'), t })
  },
})
