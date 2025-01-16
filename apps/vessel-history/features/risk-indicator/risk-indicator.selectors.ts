import { createSelector } from '@reduxjs/toolkit'
import { memoize } from 'lodash'
import { DateTime, Interval } from 'luxon'
import type { ValueItem} from 'types';

import { RISK_SUMMARY_SETTINGS } from 'data/config'
import { getEventsWithMainPortVisit } from 'features/activity-by-type/activity-by-type.selectors'
import type { RenderedEvent} from 'features/vessels/activity/vessels-activity.selectors';
import { selectEvents } from 'features/vessels/activity/vessels-activity.selectors'
import { selectUrlAkaVesselQuery, selectVesselProfileId } from 'routes/routes.selectors'
import { VesselAPISource } from 'types'
import type { MOU, VesselIdentityIndicators } from 'types/risk-indicator'
import { getUTCDateTime } from 'utils/dates'

import { getMergedVesselsUniqueId, selectIndicators } from './risk-indicator.slice'

const selectEventsForRiskSummaryInPeriod = createSelector([selectEvents], (events) => {
  const endDate = DateTime.utc()
  const startDate = endDate.minus(RISK_SUMMARY_SETTINGS.timeRange)
  const interval = Interval.fromDateTimes(startDate, endDate)
  // Aggregate main port visit event as well to display it grouped by port visit too
  const result = getEventsWithMainPortVisit(events)
  return result.filter((event: RenderedEvent) => {
    if (
      !interval.contains(getUTCDateTime(event.start as number)) &&
      !interval.contains(getUTCDateTime(event.end as number))
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
        ...(indicators?.gaps?.intentionalDisabling || []),
      ])
    )
    // Given that por visits ids have suffixes now we should check only the start of it
    return events.filter(
      (event) =>
        indicatorsEvents.filter((indicatorEvent) => event.id.startsWith(indicatorEvent)).length > 0
    )
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

export const selectCoverage = createSelector(
  [selectCurrentMergedVesselsIndicators],
  (indicators) => {
    return indicators?.coverage
  }
)

export const selectPortVisitsToNonPSMAPortState = createSelector(
  [selectCurrentMergedVesselsIndicators, selectEventsForRiskSummary],
  (indicators, events) => {
    return events.filter((event) =>
      (indicators?.portVisits?.nonPSMAPortState || []).includes(event.id.split('-')[0])
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

const selectRiskVesselIndentityFieldHistory = memoize(
  (field: keyof Omit<VesselIdentityIndicators, 'mou'>) =>
    createSelector([selectCurrentMergedVesselsIndicators], (indicators): ValueItem[] => {
      const values = (indicators?.vesselIdentity && indicators?.vesselIdentity[field]) ?? []
      return (
        Array.isArray(values) &&
        values.map((f) => ({
          value: f.value,
          firstSeen: f.from,
          endDate: f.to,
          source: (f.source as any) === 'AIS' ? VesselAPISource.GFW : f.source,
        }))
      )
    })
)

export const selectRiskVesselIndentityFlagsHistory = selectRiskVesselIndentityFieldHistory('flags')

export const selectRiskVesselIndentityNamesHistory = selectRiskVesselIndentityFieldHistory('names')

export const selectRiskVesselIndentityOwnersHistory =
  selectRiskVesselIndentityFieldHistory('owners')

export const selectRiskVesselIndentityOperatorsHistory =
  selectRiskVesselIndentityFieldHistory('operators')

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

export const selectEncountersRFMOsAreasWithoutAuthorization = createSelector(
  [selectEncountersInRFMOWithoutAuthorization],
  (events) => {
    return Array.from(
      new Set(
        events
          .filter((event) => event.vessel?.authorizations)
          .map((event) => event.vessel?.authorizations)
          .flat()
          .map((eventAuth) => eventAuth.rfmo)
      )
    )
  }
)

export const selectFishingRFMOsAreasWithoutAuthorization = createSelector(
  [selectFishingInRFMOWithoutAuthorization],
  (events) => {
    return Array.from(
      new Set(
        events
          .filter((event) => event.vessel?.authorizations)
          .map((event) => event.vessel?.authorizations)
          .flat()
          .map((eventAuth) => eventAuth.rfmo)
      )
    )
  }
)

export const selectGapsIntentionalDisabling = createSelector(
  [selectCurrentMergedVesselsIndicators, selectEventsForRiskSummary],
  (indicators, events) => {
    return events.filter((event) =>
      (indicators?.gaps?.intentionalDisabling || []).includes(event.id)
    )
  }
)
