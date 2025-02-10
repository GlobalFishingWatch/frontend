import { createSelector } from '@reduxjs/toolkit'
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
import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { normalizeVesselProperties } from 'features/reports/report-area/area-reports.utils'
import type { EventsStatsVessel } from 'features/reports/report-port/ports-report.slice'
import { selectVGRData } from 'features/reports/report-vessel-group/vessel-group-report.slice'
import { getSearchIdentityResolved } from 'features/vessel/vessel.utils'
import { selectReportPortId, selectReportVesselGroupId } from 'routes/routes.selectors'
import { formatInfoField } from 'utils/info'

export const selectFetchEventsVesselsParams = createSelector(
  [selectTimeRange, selectReportVesselGroupId, selectReportPortId, selectActiveReportDataviews],
  ({ start, end }, reportVesselGroupId, portId, eventsDataviews) => {
    if (!eventsDataviews?.[0]) {
      return
    }
    const eventsDataview = eventsDataviews?.[0]

    const dataset = eventsDataview?.datasets?.find((d) => d.type === DatasetTypes.Events)?.id
    return {
      dataset: dataset,
      filters: {
        portId,
        vesselGroupId: reportVesselGroupId,
        ...getDataviewFilters(eventsDataview),
      },
      start,
      end,
    } as ReportEventsVesselsParams
  }
)

export const selectEventsVessels = createSelector(
  [selectReportEventsStatsApiSlice, selectFetchEventsVesselsParams],
  (reportEventsStatsApi, params) => {
    if (!params) {
      return
    }
    return selectReportEventsVessels(params)({ reportEventsStatsApi })?.data
  }
)

// TODO:CVP decide if we use this selector for events vessels in vessel-group report as we have all the identities
// export const selectEventsVessels = createSelector(
//   [selectEventsVesselsData, selectVGRData],
//   (data, vesselGroup) => {
//     if (!data || !vesselGroup) {
//       return
//     }

//     const eventsByVesel: Record<string, ReportEventsVesselsResponseItem> = {}

//     data.forEach((eventsStat) => {
//       const vessel = vesselGroup.vessels.find((v) => v.vesselId === eventsStat.vesselId)
//       if (vessel) {
//         if (!eventsByVesel[vessel.relationId]) {
//           eventsByVesel[vessel.relationId] = { ...eventsStat }
//         } else {
//           eventsByVesel[vessel.relationId].numEvents += eventsStat.numEvents
//         }
//       }
//     })

//     const insightVessels = vesselGroup.vessels?.flatMap((vessel) => {
//       const vesselWithEvents = eventsByVesel[vessel.vesselId]
//       if (!vesselWithEvents) {
//         return []
//       }
//       const identity = getSearchIdentityResolved(vessel.identity!)
//       const shipName = formatInfoField(identity.shipname, 'shipname') as string
//       return {
//         ...vesselWithEvents,
//         ...identity,
//         ...normalizeVesselProperties(identity),
//         shipName,
//       } as EventsStatsVessel
//     })
//     return insightVessels.sort((a, b) => b.numEvents - a.numEvents)
//   }
// )
