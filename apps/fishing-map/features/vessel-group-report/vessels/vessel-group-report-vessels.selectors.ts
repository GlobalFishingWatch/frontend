import { createSelector } from '@reduxjs/toolkit'
import { groupBy } from 'es-toolkit'
import { IdentityVessel } from '@globalfishingwatch/api-types'
import { selectVesselGroupReportVesselsSubsection } from 'features/vessel-group-report/vessel-group.config.selectors'
import { OTHER_CATEGORY_LABEL } from 'features/vessel-group-report/vessel-group-report.config'
import { getVesselProperty } from 'features/vessel/vessel.utils'
import {
  selectVesselGroupReportResultsPerPage,
  selectVesselGroupReportVesselPage,
} from 'features/vessel-group-report/vessel-group.config.selectors'
import { selectVesselGroupReportVessels } from '../vessel-group-report.slice'

export const selectVesselGroupReportVesselsPaginated = createSelector(
  [
    selectVesselGroupReportVessels,
    selectVesselGroupReportVesselPage,
    selectVesselGroupReportResultsPerPage,
  ],
  (vessels, page, resultsPerPage) => {
    if (!vessels) return []
    return vessels.slice((page - 1) * resultsPerPage, page * resultsPerPage)
  }
)

export const selectVesselGroupReportVesselsPagination = createSelector(
  [
    selectVesselGroupReportVesselsPaginated,
    selectVesselGroupReportVessels,
    selectVesselGroupReportVesselPage,
    selectVesselGroupReportResultsPerPage,
  ],
  (vessels, allVessels, page = 0, resultsPerPage) => {
    return {
      page,
      offset: resultsPerPage * page,
      resultsPerPage: resultsPerPage,
      resultsNumber: vessels!?.length,
      // totalFiltered: allVesselsFiltered!?.length,
      total: allVessels!?.length,
    }
  }
)

export const selectVesselGroupReportVesselsGraphDataGrouped = createSelector(
  [selectVesselGroupReportVessels, selectVesselGroupReportVesselsSubsection],
  (vessels, subsection) => {
    if (!vessels) return []
    let vesselsGrouped = {}
    switch (subsection) {
      case 'flag':
        vesselsGrouped = groupBy(vessels, (vessel) => getVesselProperty(vessel, 'flag'))
        break
      case 'shiptypes':
        vesselsGrouped = groupBy(vessels, (vessel) => getVesselProperty(vessel, 'shiptypes')?.[0])
        break
      case 'geartypes':
        vesselsGrouped = groupBy(vessels, (vessel) => getVesselProperty(vessel, 'geartypes')?.[0])
        break
      case 'source':
        vesselsGrouped = vessels.reduce(
          (acc, vessel) => {
            if (vessel.registryInfo?.length && vessel.selfReportedInfo?.length) {
              acc.both.push(vessel)
            } else if (vessel.registryInfo?.length) {
              acc.registryOnly.push(vessel)
            } else if (vessel.selfReportedInfo?.length) {
              acc.selfReportedOnly.push(vessel)
            }
            return acc
          },
          { registryOnly: [], selfReportedOnly: [], both: [] } as Record<string, IdentityVessel[]>
        )
        break
    }
    const orderedGroups = Object.entries(vesselsGrouped)
      .map(([key, value]) => ({
        name: key,
        value: (value as any[]).length,
      }))
      .sort((a, b) => {
        if (a.name === OTHER_CATEGORY_LABEL) {
          return 1
        }
        if (b.name === OTHER_CATEGORY_LABEL) {
          return -1
        }
        return b.value - a.value
      })

    if (orderedGroups.length <= 9) {
      return orderedGroups
    }
    const firstNine = orderedGroups.slice(0, 9)
    const other = orderedGroups.slice(9)

    return [
      ...firstNine,
      {
        name: OTHER_CATEGORY_LABEL,
        value: other.reduce((acc, group) => acc + group.value, 0),
      },
    ]
  }
)
