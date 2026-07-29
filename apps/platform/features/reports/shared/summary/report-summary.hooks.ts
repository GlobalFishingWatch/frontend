import { useCallback } from 'react'
import { useSelector } from 'react-redux'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import type { GetFiltersInDataviewParams } from 'features/map/dataviews/dataviews.filters'
import { getFiltersInDataview } from 'features/map/dataviews/dataviews.filters'
import { showSchemaFilter } from 'features/map/workspace/shared/LayerSchemaFilter.utils'
import { useVesselGroupsOptions } from 'features/user/vessel-groups/vessel-groups.hooks'
import { selectIsVesselGroupReportLocation } from 'router/routes.selectors'

function getHasDataviewSchemaFilters(
  dataview: UrlDataviewInstance,
  { isVesselGroupReportLocation = false, vesselGroups = [] } = {} as {
    isVesselGroupReportLocation?: boolean
    vesselGroups?: GetFiltersInDataviewParams['vesselGroups']
  }
) {
  const { filtersAllowed: schemaFiltersAllowed } = getFiltersInDataview(dataview, {
    vesselGroups,
  })
  const filtersAllowed = isVesselGroupReportLocation
    ? schemaFiltersAllowed.filter((filter) => filter.id !== 'vessel-groups')
    : schemaFiltersAllowed
  return filtersAllowed.some(showSchemaFilter)
}

export function useGetHasDataviewSchemaFilters() {
  const isVesselGroupReportLocation = useSelector(selectIsVesselGroupReportLocation)
  const vesselGroupsOptions = useVesselGroupsOptions()

  return useCallback(
    (dataview: UrlDataviewInstance) => {
      return getHasDataviewSchemaFilters(dataview, {
        isVesselGroupReportLocation: isVesselGroupReportLocation,
        vesselGroups: vesselGroupsOptions,
      })
    },
    [isVesselGroupReportLocation, vesselGroupsOptions]
  )
}
