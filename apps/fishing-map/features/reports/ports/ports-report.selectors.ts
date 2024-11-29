import { createSelector } from '@reduxjs/toolkit'
import { groupBy } from 'es-toolkit'
import { EMPTY_FIELD_PLACEHOLDER } from 'utils/info'
import { getVesselsFiltered } from 'features/reports/areas/area-reports.utils'
import { MAX_CATEGORIES } from 'features/reports/areas/area-reports.config'
import { selectEventsDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { CLUSTER_PORT_VISIT_EVENTS_DATAVIEW_SLUG } from 'data/workspaces'
import { REPORT_FILTER_PROPERTIES } from '../vessel-groups/vessels/vessel-group-report-vessels.selectors'
import { OTHER_CATEGORY_LABEL } from '../vessel-groups/vessel-group-report.config'
import { selectPortsReportVessels } from './ports-report.slice'
import {
  selectPortReportVesselsFilter,
  selectPortReportVesselsPage,
  selectPortReportVesselsProperty,
  selectPortReportVesselsResultsPerPage,
} from './ports-report.config.selectors'

export const selectPortReportsDataview = createSelector([selectEventsDataviews], (dataviews) => {
  if (!dataviews?.length) {
    return
  }
  return dataviews.find(({ dataviewId }) => dataviewId === CLUSTER_PORT_VISIT_EVENTS_DATAVIEW_SLUG)
})

export const selectPortReportVesselsFiltered = createSelector(
  [selectPortsReportVessels, selectPortReportVesselsFilter],
  (vessels, filter) => {
    if (!vessels?.length) return null
    return getVesselsFiltered(vessels, filter, REPORT_FILTER_PROPERTIES)
  }
)

type GraphDataGroup = {
  name: string
  value: number
}
export const selectPortReportVesselsGrouped = createSelector(
  [selectPortReportVesselsFiltered, selectPortReportVesselsProperty],
  (vessels, property) => {
    if (!vessels?.length) return []
    const orderedGroups: { name: string; value: number }[] = Object.entries(
      groupBy(vessels, (vessel) => {
        return property === 'flag' ? vessel.flagTranslated : (vessel.geartype as string)
      })
    )
      .map(([key, value]) => ({ name: key, property: key, value: value.length }))
      .sort((a, b) => b.value - a.value)

    const groupsWithoutOther: GraphDataGroup[] = []
    const otherGroups: GraphDataGroup[] = []
    orderedGroups.forEach((group) => {
      if (
        group.name === 'null' ||
        group.name.toLowerCase() === OTHER_CATEGORY_LABEL.toLowerCase() ||
        group.name === EMPTY_FIELD_PLACEHOLDER
      ) {
        otherGroups.push(group)
      } else {
        groupsWithoutOther.push(group)
      }
    })
    const allGroups =
      otherGroups.length > 0
        ? [
            ...groupsWithoutOther,
            {
              name: OTHER_CATEGORY_LABEL,
              value: otherGroups.reduce((acc, group) => acc + group.value, 0),
            },
          ]
        : groupsWithoutOther
    if (allGroups.length <= MAX_CATEGORIES) {
      return allGroups
    }
    const firstGroups = allGroups.slice(0, MAX_CATEGORIES)
    const restOfGroups = allGroups.slice(MAX_CATEGORIES)
    return [
      ...firstGroups,
      {
        name: OTHER_CATEGORY_LABEL,
        value: restOfGroups.reduce((acc, group) => acc + group.value, 0),
      },
    ] as GraphDataGroup[]
  }
)

export const selectPortReportVesselsPaginated = createSelector(
  [
    selectPortReportVesselsFiltered,
    selectPortReportVesselsPage,
    selectPortReportVesselsResultsPerPage,
  ],
  (vessels, page, resultsPerPage) => {
    if (!vessels?.length) return []
    return vessels.slice(resultsPerPage * page, resultsPerPage * (page + 1))
  }
)

export type VesselsPagination = {
  page: number
  offset: number
  resultsPerPage: number
  resultsNumber: number
  totalFiltered: number
  total: number
}
export const selectPortReportVesselsPagination = createSelector(
  [
    selectPortReportVesselsPaginated,
    selectPortsReportVessels,
    selectPortReportVesselsFiltered,
    selectPortReportVesselsPage,
    selectPortReportVesselsResultsPerPage,
  ],
  (vessels, allVessels, allVesselsFiltered, page = 0, resultsPerPage): VesselsPagination => {
    return {
      page,
      offset: resultsPerPage * page,
      resultsPerPage:
        typeof resultsPerPage === 'number' ? resultsPerPage : parseInt(resultsPerPage),
      resultsNumber: vessels?.length,
      totalFiltered: allVesselsFiltered?.length,
      total: allVessels?.length,
    }
  }
)
