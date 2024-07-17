import { createSelector } from '@reduxjs/toolkit'
import { DataviewCategory, DataviewType } from '@globalfishingwatch/api-types'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { selectDataviewInstancesResolved } from 'features/dataviews/selectors/dataviews.instances.selectors'

export const selectDataviewInstancesByCategory = (category?: DataviewCategory) => {
  return createSelector(
    [selectDataviewInstancesResolved],
    (dataviews): UrlDataviewInstance<DataviewType>[] => {
      return dataviews?.filter((dataview) => dataview.category === category)
    }
  )
}

export const selectEnvironmentalDataviews = selectDataviewInstancesByCategory(
  DataviewCategory.Environment
)
export const selectEventsDataviews = selectDataviewInstancesByCategory(DataviewCategory.Events)

export const selectActivityDataviews = selectDataviewInstancesByCategory(DataviewCategory.Activity)

export const selectDetectionsDataviews = selectDataviewInstancesByCategory(
  DataviewCategory.Detections
)

export const selectContextAreasDataviews = selectDataviewInstancesByCategory(
  DataviewCategory.Context
)

export const selectCustomUserDataviews = selectDataviewInstancesByCategory(DataviewCategory.User)
