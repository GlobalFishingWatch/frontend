import { createSelector } from 'reselect'
import { resolveDataviewsResourceQueries } from '@globalfishingwatch/dataviews-client'
import { selectDataviewInstancesResolved } from 'features/dataviews/dataviews.selectors'

export const selectDataviewsResourceQueries = createSelector(
  [selectDataviewInstancesResolved],
  (dataviewInstances) => resolveDataviewsResourceQueries(dataviewInstances ?? [])
)
