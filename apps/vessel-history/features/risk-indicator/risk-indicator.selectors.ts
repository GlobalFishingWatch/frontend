import { createSelector } from '@reduxjs/toolkit'
import { DateTime, Interval } from 'luxon'
import { selectUrlAkaVesselQuery, selectVesselProfileId } from 'routes/routes.selectors'
import { RISK_SUMMARY_SETTINGS } from 'data/config'
import { RenderedEvent, selectEvents } from 'features/vessels/activity/vessels-activity.selectors'
import { getMergedVesselsUniqueId, selectIndicators } from './risk-indicator.slice'

export const selectEventsForRiskSummary = createSelector([selectEvents], (events) => {
  const endDate = DateTime.now()
  const startDate = endDate.minus(RISK_SUMMARY_SETTINGS.timeRange)
  const interval = Interval.fromDateTimes(startDate, endDate)
  return events.filter((event: RenderedEvent) => {
    if (
      !interval.contains(DateTime.fromMillis(event.start as number)) &&
      !interval.contains(DateTime.fromMillis(event.end as number))
    ) {
      return false
    }

    return true
  })
})

export const selectCurrentMergedVesselsId = createSelector(
  [selectVesselProfileId, selectUrlAkaVesselQuery],
  (vesselProfileId, akaVesselProfileIds) => {
    const idData = [vesselProfileId, ...akaVesselProfileIds].map((vesselProfileId) => {
      const [datasetId, vesselId, tmtId] = vesselProfileId.split('_')
      return { datasetId, vesselId, tmtId }
    })
    return getMergedVesselsUniqueId(idData)
  }
)

export const selectCurrentMergedVesselsIndicators = createSelector(
  [selectCurrentMergedVesselsId, selectIndicators],
  (id, indicators) => indicators[id]
)

export const selectEncountersInMPA = createSelector(
  [selectCurrentMergedVesselsIndicators, selectEventsForRiskSummary],
  (indicators, events) => {
    return events.filter((event) => (indicators?.encounters?.eventsInMPA || []).includes(event.id))
  }
)

export const selectFishingInMPA = createSelector(
  [selectCurrentMergedVesselsIndicators, selectEventsForRiskSummary],
  (indicators, events) => {
    return events.filter((event) => (indicators?.fishing?.eventsInMPA || []).includes(event.id))
  }
)
