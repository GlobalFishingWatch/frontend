import { createSelector } from '@reduxjs/toolkit'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import { selectDataviewInstancesResolved } from 'features/dataviews/selectors/dataviews.instances.selectors'

export const selectDataviewInstancesByCategory = (category: DataviewCategory) => {
  return createSelector([selectDataviewInstancesResolved], (dataviews) => {
    return dataviews?.filter((dataview) => dataview.category === category)
  })
}

export const selectEnvironmentalDataviews = selectDataviewInstancesByCategory(
  DataviewCategory.Environment
)
