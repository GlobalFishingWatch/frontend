import { createSelector } from '@reduxjs/toolkit'
import { selectFilteredEvents } from 'features/vessel/activity/vessels-activity.selectors'

export const selectEventsByType = createSelector([selectFilteredEvents], (eventsList) => {
  return eventsList.reduce((acc, event) => {
    const type = event.type
    if (!acc[type]) {
      acc[type] = {
        group: true,
        type,
        events: [event],
        quantity: 1,
        loading: false, // TODO
      }
    } else {
      acc[type].quantity++
      acc[type].events.push(event)
    }
    return acc
  }, {})
})
