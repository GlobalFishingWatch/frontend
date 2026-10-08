import { createFileRoute, redirect } from '@tanstack/react-router'

import { ROUTE_PATHS } from '@platform/config/routes'

import { getPort } from 'features/_places/places.functions'
import { getPlacePortReportSearch } from 'features/_places/places.links'
import { getPlacesLocale } from 'features/_places/places.loaders'
import PortsReport from 'features/_reports/report-port/PortsReport'
import { t } from 'features/i18n/i18n'
import { getRouteHead } from 'router/router.meta'
import { validateReportSearchParams } from 'router/routes.search'

export const Route = createFileRoute('/_platform/_map/ports/$portId')({
  component: PortsReport,
  validateSearch: validateReportSearchParams,
  // PortsReport reads name, country and its layers from the URL. A bare /ports/$portId (shared,
  // typed, crawled) gets them once from the port data; an unknown id renders without redirecting
  beforeLoad: async ({ params, search }) => {
    if (search.portsReportName) return
    const port = await getPort({ data: { id: params.portId, locale: getPlacesLocale() } })
    if (!port) return
    throw redirect({
      to: ROUTE_PATHS.PORT,
      params,
      search: { ...search, ...getPlacePortReportSearch(port) },
      replace: true,
    })
  },
  head: () => getRouteHead({ category: t((s) => s.analysis.title) }),
})
