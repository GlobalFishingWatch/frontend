import { createSelector } from '@reduxjs/toolkit'
import { groupBy } from 'es-toolkit'
import { IdentityVessel } from '@globalfishingwatch/api-types'
import { OTHER_CATEGORY_LABEL } from 'features/vessel-group-report/vessel-group-report.config'
import { getVesselProperty } from 'features/vessel/vessel.utils'
import {
  selectVesselGroupReportResultsPerPage,
  selectVesselGroupReportVesselPage,
} from 'features/vessel-group-report/vessel-group.config.selectors'
import { formatInfoField, getVesselShipNameLabel, getVesselShipTypeLabel } from 'utils/info'
import {
  selectVesselGroupReportVesselsOrderDirection,
  selectVesselGroupReportVesselsOrderProperty,
  selectVesselGroupReportVesselsSubsection,
} from '../vessel-group.config.selectors'
import { selectVesselGroupReportVessels } from '../vessel-group-report.slice'

export const selectVesselGroupReportVesselsOrdered = createSelector(
  [
    selectVesselGroupReportVessels,
    selectVesselGroupReportVesselsOrderProperty,
    selectVesselGroupReportVesselsOrderDirection,
  ],
  (vessels, property, direction) => {
    if (!vessels?.length) return []
    return vessels.toSorted((a, b) => {
      let aValue = ''
      let bValue = ''
      if (property === 'flag') {
        aValue = formatInfoField(getVesselProperty(a, 'flag'), 'flag') as string
        bValue = formatInfoField(getVesselProperty(b, 'flag'), 'flag') as string
      } else if (property === 'shiptype') {
        aValue = getVesselShipTypeLabel({ shiptypes: getVesselProperty(a, 'shiptypes') })
        bValue = getVesselShipTypeLabel({ shiptypes: getVesselProperty(b, 'shiptypes') })
      } else {
        aValue = getVesselShipNameLabel(a)
        bValue = getVesselShipNameLabel(b)
      }
      if (aValue === bValue) {
        return 0
      }
      if (direction === 'asc') {
        return aValue > bValue ? 1 : -1
      }
      return aValue > bValue ? -1 : 1
    })
  }
)

export const selectVesselGroupReportVesselsPaginated = createSelector(
  [
    selectVesselGroupReportVesselsOrdered,
    selectVesselGroupReportVesselPage,
    selectVesselGroupReportResultsPerPage,
  ],
  (vessels, page, resultsPerPage) => {
    if (!vessels?.length) return []
    return vessels.slice(resultsPerPage * page, resultsPerPage * (page + 1))
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
