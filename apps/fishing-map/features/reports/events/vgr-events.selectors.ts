import { createSelector } from '@reduxjs/toolkit'
import {
  selectVesselGroupEventsStatsApiSlice,
  selectVesselGroupEventsVessels,
  VesselGroupEventsVesselsParams,
} from 'queries/vessel-group-events-stats-api'
import { selectVGRData } from 'features/reports/vessel-groups/vessel-group-report.slice'
import { getSearchIdentityResolved } from 'features/vessel/vessel.utils'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { selectReportVesselGroupId } from 'routes/routes.selectors'
import {
  selectVGREventsResultsPerPage,
  selectVGREventsVesselFilter,
  selectVGREventsVesselPage,
} from 'features/reports/vessel-groups/vessel-group.config.selectors'
import { getVesselsFiltered } from 'features/reports/areas/area-reports.utils'
import { REPORT_FILTER_PROPERTIES } from 'features/reports/vessel-groups/vessels/vessel-group-report-vessels.selectors'
import { selectVGREventsSubsectionDataview } from 'features/reports/vessel-groups/vessel-group-report.selectors'

export const selectFetchVGREventsVesselsParams = createSelector(
  [selectTimeRange, selectReportVesselGroupId, selectVGREventsSubsectionDataview],
  ({ start, end }, reportVesselGroupId, eventsDataview) => {
    if (!eventsDataview) {
      return
    }
    return {
      dataview: eventsDataview,
      vesselGroupId: reportVesselGroupId,
      start,
      end,
    } as VesselGroupEventsVesselsParams
  }
)

export const selectVGREventsVesselsData = createSelector(
  [selectVesselGroupEventsStatsApiSlice, selectFetchVGREventsVesselsParams],
  (vesselGroupEventsStatsApi, params) => {
    if (!params) {
      return
    }
    return selectVesselGroupEventsVessels(params)({ vesselGroupEventsStatsApi })?.data
  }
)

export const selectVGREventsVessels = createSelector(
  [selectVGREventsVesselsData, selectVGRData],
  (data, vesselGroup) => {
    if (!data || !vesselGroup) {
      return
    }
    const insightVessels = vesselGroup?.vessels?.flatMap((vessel) => {
      const vesselWithEvents = data?.find((v) => v.vesselId === vessel.vesselId)
      if (!vesselWithEvents) {
        return []
      }
      const identity = getSearchIdentityResolved(vessel.identity!)
      return {
        ...vesselWithEvents,
        ...identity,
        geartype: identity.geartypes,
      }
    })
    return insightVessels.sort((a, b) => b.numEvents - a.numEvents)
  }
)

export const selectVGREventsVesselsFiltered = createSelector(
  [selectVGREventsVessels, selectVGREventsVesselFilter],
  (vessels, filter) => {
    if (!vessels?.length) return null
    return getVesselsFiltered(vessels, filter, REPORT_FILTER_PROPERTIES)
  }
)

export const selectVGREventsVesselsPaginated = createSelector(
  [selectVGREventsVesselsFiltered, selectVGREventsVesselPage, selectVGREventsResultsPerPage],
  (vessels, page, resultsPerPage) => {
    if (!vessels?.length) return []
    return vessels.slice(resultsPerPage * page, resultsPerPage * (page + 1))
  }
)

export const selectVGREventsVesselsPagination = createSelector(
  [
    selectVGREventsVesselsPaginated,
    selectVGREventsVessels,
    selectVGREventsVesselsFiltered,
    selectVGREventsVesselPage,
    selectVGREventsResultsPerPage,
  ],
  (vessels, allVessels, allVesselsFiltered, page = 0, resultsPerPage) => {
    return {
      page,
      offset: resultsPerPage * page,
      resultsPerPage:
        typeof resultsPerPage === 'number' ? resultsPerPage : parseInt(resultsPerPage),
      resultsNumber: vessels!?.length,
      totalFiltered: allVesselsFiltered!?.length,
      total: allVessels!?.length,
    }
  }
)
