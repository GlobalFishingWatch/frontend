import { linkOptions } from '@tanstack/react-router'

import type { AreaReportType } from '@platform/config/map/dataviews'
import {
  AREA_REPORT_LAYERS,
  getAreaReportDataviewInstance,
  PORT_VISITS_EVENTS_SOURCE_ID,
} from '@platform/config/map/dataviews'
import { DEFAULT_WORKSPACE_CATEGORY, DEFAULT_WORKSPACE_ID } from '@platform/config/map/workspaces'

import type { Place } from 'features/_places/places.types'
import { getPortReportSearch } from 'features/_reports/report-port/ports-report.utils'
import { ROUTE_PATHS } from 'router/routes.utils'
import type { QueryParams } from 'types'

/** Port report search for a place: no current layers, so it adds the port visits one. */
export const getPlacePortReportSearch = ({ id, name, flag }: Place) =>
  getPortReportSearch({
    portId: String(id),
    name,
    country: flag,
    dataviewInstances: [{ id: PORT_VISITS_EVENTS_SOURCE_ID }],
  })

const getAreaReportSearch = (type: AreaReportType): QueryParams => ({
  dataviewInstances: [getAreaReportDataviewInstance(type)],
})

export const getPlaceLinkOptions = (place: Place) =>
  place.type === 'port'
    ? linkOptions({
        to: ROUTE_PATHS.PORT,
        params: { portId: String(place.id) },
        search: getPlacePortReportSearch(place),
      })
    : linkOptions({
        to: ROUTE_PATHS.WORKSPACE_REPORT,
        params: {
          category: DEFAULT_WORKSPACE_CATEGORY,
          workspaceId: DEFAULT_WORKSPACE_ID,
          datasetId: AREA_REPORT_LAYERS[place.type].datasetId,
          areaId: String(place.id),
        },
        search: getAreaReportSearch(place.type),
      })
