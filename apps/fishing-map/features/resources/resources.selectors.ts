import { createSelector } from '@reduxjs/toolkit'
import { DatasetCategory, EventType } from '@globalfishingwatch/api-types'
import { RootState } from 'store'
import { selectVisibleEvents } from 'features/app/app.selectors'
import { selectResources } from './resources.slice'

export const selectVisibleResources = createSelector(
  [selectResources, (state: RootState) => selectVisibleEvents(state)],
  (resources, visibleEvents) => {
    if (visibleEvents === 'all') {
      return resources
    }
    return Object.fromEntries(
      Object.entries(resources).filter(([url, resource]) => {
        return url.includes('events') && resource.dataset?.category === DatasetCategory.Event
          ? visibleEvents.includes(resource.dataset.subcategory as EventType)
          : true
      })
    )
  }
)
