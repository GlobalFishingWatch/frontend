import { createFileRoute } from '@tanstack/react-router'

import AreaReport from 'features/_reports/report-area/AreaReport'
import { t } from 'features/i18n/i18n'
import { getRouteHead } from 'router/router.meta'
import { validateReportSearchParams } from 'router/routes.search'

/**
 * One route for the three report URL shapes (`datasetId`/`areaId` are optional path params (`{-$param}`))
 * `/report`,
 * `/report/$datasetId`
 * `/report/$datasetId/$areaId`.
 */
export const Route = createFileRoute(
  '/_platform/_map/map/$category/$workspaceId/report/{-$datasetId}/{-$areaId}'
)({
  component: AreaReport,
  validateSearch: validateReportSearchParams,
  head: () => getRouteHead({ category: t((s) => s.analysis.title) }),
})
