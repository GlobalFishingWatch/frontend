import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'

import { DEFAULT_WORKSPACE_CATEGORY, DEFAULT_WORKSPACE_ID } from '@platform/config/map/workspaces'

import {
  AREA_DATASET_IDS,
  getAreaReportSearch,
  getPortReportSearch,
} from 'features/_places/places.links'
import type { Place } from 'features/_places/places.loaders'
import { ROUTE_PATHS } from 'router/routes.utils'

type PlaceLinkProps = {
  place: Place
  className?: string
  children: ReactNode
}

/** Ports open the standalone /port/$portId; areas the default workspace's area report. */
function PlaceLink({ place, className, children }: PlaceLinkProps) {
  if (place.type === 'port') {
    return (
      <Link
        to={ROUTE_PATHS.PORT}
        params={{ portId: String(place.id) }}
        search={getPortReportSearch(place)}
        className={className}
      >
        {children}
      </Link>
    )
  }
  return (
    <Link
      to={ROUTE_PATHS.WORKSPACE_REPORT}
      params={{
        category: DEFAULT_WORKSPACE_CATEGORY,
        workspaceId: DEFAULT_WORKSPACE_ID,
        datasetId: AREA_DATASET_IDS[place.type],
        areaId: String(place.id),
      }}
      search={getAreaReportSearch(place.type)}
      className={className}
    >
      {children}
    </Link>
  )
}

export default PlaceLink
