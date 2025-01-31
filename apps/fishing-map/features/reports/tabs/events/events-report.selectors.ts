import { createSelector } from '@reduxjs/toolkit'
import { groupBy } from 'es-toolkit'
import type {
  ReportEventsVesselsParams,
  ReportEventsVesselsResponseItem,
} from 'queries/report-events-stats-api'
import {
  selectReportEventsStatsApiSlice,
  selectReportEventsVessels,
} from 'queries/report-events-stats-api'

import { DatasetTypes } from '@globalfishingwatch/api-types'
import { getDataviewFilters } from '@globalfishingwatch/dataviews-client'

import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import {
  getVesselsFiltered,
  normalizeVesselProperties,
} from 'features/reports/report-area/area-reports.utils'
import type { EventsStatsVessel } from 'features/reports/report-port/ports-report.slice'
import { REPORT_FILTER_PROPERTIES } from 'features/reports/report-vessel-group/vessel-group-report.config'
import { selectVGREventsSubsectionDataview } from 'features/reports/report-vessel-group/vessel-group-report.selectors'
import { selectVGRData } from 'features/reports/report-vessel-group/vessel-group-report.slice'
import { MAX_CATEGORIES, OTHERS_CATEGORY_LABEL } from 'features/reports/reports.config'
import {
  selectReportVesselFilter,
  selectReportVesselGraph,
  selectReportVesselPage,
  selectReportVesselResultsPerPage,
} from 'features/reports/reports.config.selectors'
import { getSearchIdentityResolved } from 'features/vessel/vessel.utils'
import { selectReportVesselGroupId } from 'routes/routes.selectors'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField } from 'utils/info'

export const selectFetchVGREventsVesselsParams = createSelector(
  [selectTimeRange, selectReportVesselGroupId, selectVGREventsSubsectionDataview],
  ({ start, end }, reportVesselGroupId, eventsDataview) => {
    if (!eventsDataview) {
      return
    }

    const dataset = eventsDataview.datasets?.find((d) => d.type === DatasetTypes.Events)?.id
    return {
      dataset: dataset,
      filters: {
        vesselGroupId: reportVesselGroupId,
        ...getDataviewFilters(eventsDataview),
      },
      start,
      end,
    } as ReportEventsVesselsParams
  }
)

export const selectVGREventsVesselsData = createSelector(
  [selectReportEventsStatsApiSlice, selectFetchVGREventsVesselsParams],
  (reportEventsStatsApi, params) => {
    if (!params) {
      return
    }
    return selectReportEventsVessels(params)({ reportEventsStatsApi })?.data
  }
)

export const selectVGREventsVessels = createSelector(
  [selectVGREventsVesselsData, selectVGRData],
  (data, vesselGroup) => {
    if (!data || !vesselGroup) {
      return
    }

    const eventsByVesel: Record<string, ReportEventsVesselsResponseItem> = {}

    data.forEach((eventsStat) => {
      const vessel = vesselGroup.vessels.find((v) => v.vesselId === eventsStat.vesselId)
      if (vessel) {
        if (!eventsByVesel[vessel.relationId]) {
          eventsByVesel[vessel.relationId] = { ...eventsStat }
        } else {
          eventsByVesel[vessel.relationId].numEvents += eventsStat.numEvents
        }
      }
    })

    const insightVessels = vesselGroup.vessels?.flatMap((vessel) => {
      const vesselWithEvents = eventsByVesel[vessel.vesselId]
      if (!vesselWithEvents) {
        return []
      }
      const identity = getSearchIdentityResolved(vessel.identity!)
      const shipName = formatInfoField(identity.shipname, 'shipname') as string
      return {
        ...vesselWithEvents,
        ...identity,
        ...normalizeVesselProperties(identity),
        shipName,
      } as EventsStatsVessel
    })
    return insightVessels.sort((a, b) => b.numEvents - a.numEvents)
  }
)

export const selectVGREventsVesselsFiltered = createSelector(
  [selectVGREventsVessels, selectReportVesselFilter],
  (vessels, filter) => {
    if (!vessels?.length) return null
    return getVesselsFiltered(vessels, filter, REPORT_FILTER_PROPERTIES)
  }
)

export const selectVGREventsVesselsPaginated = createSelector(
  [selectVGREventsVesselsFiltered, selectReportVesselPage, selectReportVesselResultsPerPage],
  (vessels, page, resultsPerPage) => {
    if (!vessels?.length) return []
    return vessels.slice(resultsPerPage * page, resultsPerPage * (page + 1))
  }
)

type GraphDataGroup = {
  name: string
  value: number
}

export const selectVGREventsVesselsGrouped = createSelector(
  [selectVGREventsVesselsFiltered, selectReportVesselGraph],
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
        group.name.toLowerCase() === OTHERS_CATEGORY_LABEL.toLowerCase() ||
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
              name: OTHERS_CATEGORY_LABEL,
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
        name: OTHERS_CATEGORY_LABEL,
        value: restOfGroups.reduce((acc, group) => acc + group.value, 0),
      },
    ] as GraphDataGroup[]
  }
)

export const selectVGREventsVesselsFlags = createSelector([selectVGREventsVessels], (vessels) => {
  if (!vessels?.length) return null
  const flags = new Set<string>()
  vessels.forEach((vessel) => {
    if (vessel.flagTranslated && vessel.flagTranslated !== 'null') {
      flags.add(vessel.flagTranslated as string)
    }
  })
  return flags
})

export type VesselsPagination = {
  page: number
  offset: number
  resultsPerPage: number
  resultsNumber: number
  totalFiltered: number
  total: number
}
export const selectVGREventsVesselsPagination = createSelector(
  [
    selectVGREventsVesselsPaginated,
    selectVGREventsVessels,
    selectVGREventsVesselsFiltered,
    selectReportVesselPage,
    selectReportVesselResultsPerPage,
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
