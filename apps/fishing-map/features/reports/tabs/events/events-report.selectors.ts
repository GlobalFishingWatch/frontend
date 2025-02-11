import { createSelector } from '@reduxjs/toolkit'
import type { ReportEventsVesselsParams } from 'queries/report-events-stats-api'
import {
  selectReportEventsStatsApiSlice,
  selectReportEventsVessels,
} from 'queries/report-events-stats-api'

import { DatasetTypes } from '@globalfishingwatch/api-types'
import { getDataviewFilters } from '@globalfishingwatch/dataviews-client'

import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { selectReportPortId, selectReportVesselGroupId } from 'routes/routes.selectors'

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

export const selectEventsVesselsData = createSelector(
  [selectReportEventsStatsApiSlice, selectFetchEventsVesselsParams],
  (reportEventsStatsApi, params) => {
    if (!params) {
      return
    }
    return selectReportEventsVessels(params)({ reportEventsStatsApi })?.data
  }
)

export const selectEventsVessels = createSelector([selectEventsVesselsData], (eventsVessels) => {
  if (!eventsVessels) {
    return
  }
  return eventsVessels.map((vessel) => ({
    ...vessel,
    // TODO:CVP see what is needed to
    // vesselId: vessel?.vesselId,
    // shipName: vessel?.shipName,
    // mmsi: vessel?.mmsi,
    // flag: vessel?.flag,
    // geartype: vessel?.geartype,
    // vesselType: vessel?.vesselType,
    // value: vessel?.value,
    // infoDataset,
    // trackDataset,
    value: vessel.numEvents,
  }))
})

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
