import { createSelector } from 'reselect'
import { resolveResourceEndpoint } from '@globalfishingwatch/dataviews-client'
import { selectDataviewInstancesResolved } from 'features/dataviews/dataviews.selectors'

export const selectDataviewsResourceQueries = createSelector(
  [selectDataviewInstancesResolved],
  (dataviewInstances) => resolveResourceEndpoint(dataviewInstances ?? [])
)
