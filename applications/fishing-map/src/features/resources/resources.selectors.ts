import { createSelector } from 'reselect'
import { resolveDataviewsResourceQueries } from '@globalfishingwatch/dataviews-client'
import { selectDataviewInstancesResolved } from 'features/dataviews/dataviews.selectors'
import { isGuestUser } from 'features/user/user.selectors'
import { selectDebugOptions } from 'features/debug/debug.slice'
import { selectVisibleEvents } from 'features/app/app.selectors'
import { selectResources } from './resources.slice'

export const selectVisibleResources = createSelector(
  [selectResources, selectVisibleEvents],
  (resources, visibleEvents) => {
    if (visibleEvents === 'all') {
      return resources
    }
    return Object.fromEntries(
      Object.entries(resources).filter(([url, resource]) => {
        return url.includes('events') && resource.dataset?.configuration?.type
          ? visibleEvents.includes(resource.dataset.configuration.type)
          : true
      })
    )
  }
)

export const selectDataviewsResourceQueries = createSelector(
  [selectDataviewInstancesResolved, isGuestUser, selectDebugOptions],
  (dataviewInstances, guestUser, { thinning }) =>
    resolveDataviewsResourceQueries(dataviewInstances ?? [])
)
