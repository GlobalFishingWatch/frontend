import { createSelector } from '@reduxjs/toolkit'
import { DateTime, Interval } from 'luxon'
import { selectUrlAkaVesselQuery, selectVesselProfileId } from 'routes/routes.selectors'
import { RISK_SUMMARY_SETTINGS } from 'data/config'
import { RenderedEvent, selectEvents } from 'features/vessels/activity/vessels-activity.selectors'
import { MOU } from 'types/risk-indicator'
import { ValueItem, VesselAPISource } from 'types'
import { getMergedVesselsUniqueId, selectIndicators } from './risk-indicator.slice'

const selectEventsForRiskSummaryInPeriod = createSelector([selectEvents], (events) => {
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
  (vesselProfileId, akaVesselProfileIds) =>
    [vesselProfileId, ...(akaVesselProfileIds ?? [])].map((vesselProfileId) => {
      const [datasetId, vesselId, tmtId] = vesselProfileId.split('_')
      return { datasetId, vesselId, tmtId }
    })
)

export const selectCurrentMergedVesselsIndicators = createSelector(
  [selectCurrentMergedVesselsId, selectIndicators],
  (id, indicators) => indicators[getMergedVesselsUniqueId(id)]
)

const selectEventsForRiskSummary = createSelector(
  [selectCurrentMergedVesselsIndicators, selectEventsForRiskSummaryInPeriod],
  (indicators, events) => {
    const indicatorsEvents = Array.from(
      new Set([
        ...(indicators?.encounters?.eventsInForeignEEZ || []),
        ...(indicators?.encounters?.eventsInMPA || []),
        ...(indicators?.encounters?.eventsInRFMO || []),
        ...(indicators?.fishing?.eventsInForeignEEZ || []),
        ...(indicators?.fishing?.eventsInMPA || []),
        ...(indicators?.fishing?.eventsInRFMO || []),
        ...(indicators?.loitering?.eventsInForeignEEZ || []),
        ...(indicators?.loitering?.eventsInMPA || []),
        ...(indicators?.loitering?.eventsInRFMO || []),
        ...(indicators?.portVisits?.nonPSMAPortState || []),
      ])
    )
    return events.filter((event) => indicatorsEvents.includes(event.id))
  }
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

export const selectEncountersInForeignEEZ = createSelector(
  [selectCurrentMergedVesselsIndicators, selectEventsForRiskSummary],
  (indicators, events) => {
    return events.filter((event) =>
      (indicators?.encounters?.eventsInForeignEEZ || []).includes(event.id)
    )
  }
)

export const selectPortVisitsToNonPSMAPortState = createSelector(
  [selectCurrentMergedVesselsIndicators, selectEventsForRiskSummary],
  (indicators, events) => {
    return events.filter((event) =>
      (indicators?.portVisits?.nonPSMAPortState || []).includes(event.id)
    )
  }
)

export const selectVesselIdentityMouIndicators = createSelector(
  [selectCurrentMergedVesselsIndicators],
  (indicators) => {
    const mou = indicators?.vesselIdentity?.mou ?? {}
    return Object.entries(mou as MOU)
      .map(([name, typeList]) => {
        return Object.entries(typeList)
          .map(([type, flags]) => ({ type, flags }))
          .map((typeFlags) => ({
            name,
            ...typeFlags,
          }))
      })
      .flat()
      .filter((item) => item.flags.length > 0)
  }
)

export const selectRiskVesselIndentityFlagsHistory = createSelector(
  [selectCurrentMergedVesselsIndicators],
  (indicators): ValueItem[] => {
    const flagValues = indicators?.vesselIdentity?.flags ?? []
    return flagValues.map((f) => ({
      value: f.value,
      firstSeen: f.from,
      endDate: f.to,
      source: (f.source as any) === 'AIS' ? VesselAPISource.GFW : f.source,
    }))
  }
)

export const selectEncountersInRFMOWithoutAuthorization = createSelector(
  [selectCurrentMergedVesselsIndicators, selectEventsForRiskSummary],
  (indicators, events) => {
    return events.filter((event) =>
      (indicators?.encounters?.eventsInRFMOWithoutAuthorization || []).includes(event.id)
    )
  }
)

export const selectFishingInRFMOWithoutAuthorization = createSelector(
  [selectCurrentMergedVesselsIndicators, selectEventsForRiskSummary],
  (indicators, events) => {
    return events.filter((event) =>
      (indicators?.fishing?.eventsInRFMOWithoutAuthorization || []).includes(event.id)
    )
  }
)
