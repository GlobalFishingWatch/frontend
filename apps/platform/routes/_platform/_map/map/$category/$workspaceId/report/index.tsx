import { createFileRoute } from '@tanstack/react-router'

import AreaReport from 'features/_reports/report-area/AreaReport'
import { t } from 'features/i18n/i18n'
import { getRouteHead } from 'router/router.meta'
import { validateReportSearchParams } from 'router/routes.search'

export const Route = createFileRoute('/_platform/_map/map/$category/$workspaceId/report/')({
  component: AreaReport,
  validateSearch: validateReportSearchParams,
  head: () => getRouteHead({ category: t((s) => s.analysis.title) }),
})
