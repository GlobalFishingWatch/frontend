import { createSelector } from '@reduxjs/toolkit'
import { groupBy } from 'es-toolkit'

import { EndpointId } from '@globalfishingwatch/api-types'
import { getDataviewFilters } from '@globalfishingwatch/dataviews-client'

import {
  CLUSTER_PORT_VISIT_EVENTS_DATAVIEW_SLUG,
  PORTS_FOOTPRINT_DATAVIEW_SLUG,
  TEMPLATE_VESSEL_DATAVIEW_SLUG,
} from 'data/workspaces'
import { selectAreas } from 'features/areas/areas.slice'
import { selectAllDataviews } from 'features/dataviews/dataviews.slice'
import { selectEventsDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { MAX_CATEGORIES } from 'features/reports/areas/area-reports.config'
import { getVesselsFiltered } from 'features/reports/areas/area-reports.utils'
import { selectReportPortId } from 'routes/routes.selectors'
import { EMPTY_FIELD_PLACEHOLDER } from 'utils/info'

import { getVesselIndividualGroupedData } from '../shared/reports.utils'
import {
  OTHER_CATEGORY_LABEL,
  REPORT_FILTER_PROPERTIES,
} from '../vessel-groups/vessel-group-report.config'

import {
  selectPortReportVesselsFilter,
  selectPortReportVesselsPage,
  selectPortReportVesselsProperty,
  selectPortReportVesselsResultsPerPage,
} from './ports-report.config.selectors'
import { selectPortsReportVessels } from './ports-report.slice'

export const selectPortReportsDataview = createSelector([selectEventsDataviews], (dataviews) => {
  if (!dataviews?.length) {
    return
  }
  return dataviews.find(({ dataviewId }) => dataviewId === CLUSTER_PORT_VISIT_EVENTS_DATAVIEW_SLUG)
})

export const selectVesselDataviewTemplate = createSelector([selectAllDataviews], (dataviews) => {
  if (!dataviews?.length) {
    return
  }
  return dataviews.find(({ slug }) => slug === TEMPLATE_VESSEL_DATAVIEW_SLUG)
})

export const selectPortReportsConfidences = createSelector(
  [selectPortReportsDataview, selectVesselDataviewTemplate],
  (portReportDataview, vesselDataviewTemplate) => {
    if (!portReportDataview && !vesselDataviewTemplate) {
      return
    }
    let confidences: number[] = portReportDataview
      ? getDataviewFilters(portReportDataview)?.confidences
      : undefined
    if (confidences) {
      return confidences
    }
    confidences = vesselDataviewTemplate?.datasetsConfig
      ?.find((d) => d.datasetId.includes('port-visits'))
      ?.query?.find((q) => q.id === 'confidences')?.value as number[]
    return confidences
  }
)

export const selectPortReportFootprintDatasetId = createSelector(
  [selectAllDataviews],
  (dataviews) => {
    if (!dataviews?.length) return null
    const footprintDataview = dataviews.find((d) => d.slug === PORTS_FOOTPRINT_DATAVIEW_SLUG)
    if (!footprintDataview) return null
    return footprintDataview.datasetsConfig?.find((d) => d.endpoint === EndpointId.ContextTiles)
      ?.datasetId
  }
)

export const selectPortReportFootprintArea = createSelector(
  [selectPortReportFootprintDatasetId, selectReportPortId, selectAreas],
  (datasetId, areaId, areas) => {
    if (!datasetId || !areaId || !areas) return null
    return areas?.[datasetId]?.detail?.[areaId]
  }
)

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
        return property === 'flag' ? vessel.flagTranslated : (vessel[property] as string)
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

export const selectPortReportVesselsIndividualData = createSelector(
  [selectPortReportVesselsFiltered, selectPortReportVesselsProperty],
  (vessels, groupBy) => {
    if (!vessels || !groupBy) return []
    return getVesselIndividualGroupedData(vessels, groupBy)
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
      totalFiltered: allVesselsFiltered?.length || 0,
      total: allVessels?.length || 0,
    }
  }
)
