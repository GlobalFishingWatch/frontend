import { createSelector } from '@reduxjs/toolkit'
import { DateTime, Interval } from 'luxon'

import type { EventTypes } from '@globalfishingwatch/api-types'

import { RISK_SUMMARY_SETTINGS } from 'data/config'
import type { RenderedEvent} from 'features/vessels/activity/vessels-activity.selectors';
import { selectEvents } from 'features/vessels/activity/vessels-activity.selectors'
import { getUTCDateTime } from 'utils/dates'

const selectEventsForRiskSummary = createSelector([selectEvents], (events) => {
  const endDate = DateTime.utc()
  const startDate = endDate.minus(RISK_SUMMARY_SETTINGS.timeRange)
  const interval = Interval.fromDateTimes(startDate, endDate)
  return events.filter((event: RenderedEvent) => {
    if (
      !interval.contains(getUTCDateTime(event.start as number)) &&
      !interval.contains(getUTCDateTime(event.end as number))
    ) {
      return false
    }

    return true
  })
})

export const selectEventsInsideMPA = createSelector([selectEventsForRiskSummary], (events) =>
  events.filter((event) => event.regions?.mpa?.length > 0)
)

// @TODO Read this from the indicators endpoint when implemented
export const selectEventsInsideMPAByType = (type: EventTypes) =>
  createSelector([selectEventsInsideMPA], (events) => events.filter((event) => event.type === type))
