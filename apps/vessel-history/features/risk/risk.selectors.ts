import { createSelector } from '@reduxjs/toolkit'
import { DateTime, Interval } from 'luxon'
import { EventTypes } from '@globalfishingwatch/api-types'
import { RenderedEvent, selectEvents } from 'features/vessels/activity/vessels-activity.selectors'
import { RISK_SUMMARY_SETTINGS } from 'data/config'
import { RootState } from 'store'
import { selectVesselById } from 'features/vessels/vessels.slice'
import { selectMergedVesselId } from 'routes/routes.selectors'
import { selectEEZs } from 'features/regions/regions.selectors'
import { eezInfo, EEZType, EEZTypes } from 'data/eezInfo'
import { VesselWithHistory } from 'types'

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

export const selectEventsInsideMPA = createSelector([selectEventsForRiskSummary], (events) =>
  events.filter((event) => event.regions?.mpa?.length > 0)
)

export const selectEventsInsideMPAByType = (type: EventTypes) =>
  createSelector([selectEventsInsideMPA], (events) => events.filter((event) => event.type === type))

export const selectCurrentVessel = createSelector(
  [(state: RootState) => selectVesselById(selectMergedVesselId(state))(state)],
  (vessel: VesselWithHistory) => vessel
)

const eventIsInForeingEEZ = (flag: string, eezIds: string[]) => {
  const eezRegions = eezIds.map((id) => eezInfo[`${id}`])
  return (
    eezRegions.filter(
      ({ eez_type, territory1_iso3, territory2_iso3, territory3_iso3 }) =>
        // The eez is of 200NM or joint Regine type and the vessel flag does not match the eez flag
        (([EEZTypes._200NM, EEZTypes.JointRegime] as EEZType[]).includes(eez_type) &&
          ![territory1_iso3, territory2_iso3, territory3_iso3].includes(flag)) ||
        // or the eez is disputed and the vessel flag is not of any country
        (eez_type === EEZTypes.Disputed &&
          ![territory1_iso3, territory2_iso3, territory3_iso3].includes(flag))
    ).length > 0
  )
}

export const selectEncountersInForeignEEZ = createSelector(
  [selectEventsForRiskSummary, selectCurrentVessel, selectEEZs],
  (events, vessel, eezs = []) =>
    vessel && vessel.flag
      ? events.filter(
          (event) =>
            event.type === EventTypes.Encounter &&
            eventIsInForeingEEZ(vessel.flag, event.regions.eez)
        )
      : []
)
