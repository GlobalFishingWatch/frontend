import { createSelector } from '@reduxjs/toolkit'
import { selectVisibleEvents } from 'features/event-filters/filters.selectors'
import { selectResources } from './resources.slice'

export const selectVisibleResources = createSelector(
  [selectResources, selectVisibleEvents],
  (resources, visibleEvents) => {
    if (visibleEvents === 'all') {
      return resources
    }

    const resourcesEntries = Object.entries(resources).filter(([url, resource]) => {
      return url.includes('events') && resource.dataset?.configuration?.type
        ? visibleEvents.includes(resource.dataset.configuration.type)
        : true
    })
    return Object.fromEntries(resourcesEntries)
  }
)
