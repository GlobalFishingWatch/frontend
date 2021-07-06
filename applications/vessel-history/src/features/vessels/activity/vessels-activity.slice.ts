import { createSelector } from '@reduxjs/toolkit'
import {
  PartialStoreResources,
  resolveDataviewDatasetResource,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import { RootState } from 'store'
import { ActivityEvent } from 'types/activity'
import { selectResourceByUrl } from 'features/resources/resources.slice'
import { selectVesselsDataviews } from 'features/dataviews/dataviews.selectors'
import { selectVesselDataview } from '../vessels.slice'
import { groupEvents } from './vessels-activity.utils'

const selectVesselResourceByDatasetType = <T>(datasetType: DatasetTypes) =>
  createSelector(
    [selectVesselDataview, selectVesselsDataviews, (state: RootState) => state],
    (currentVesselDataview, dataviews, state) => {
      const dataview = dataviews?.find((d) => currentVesselDataview?.id === d.id)
      if (!dataview) return
      const { url } = resolveDataviewDatasetResource(dataview as UrlDataviewInstance, datasetType)
      return selectResourceByUrl<T>(url)(state as PartialStoreResources)
    }
  )

export const selectVesselEvents = createSelector(
  [selectVesselResourceByDatasetType<ActivityEvent[]>(DatasetTypes.Events)],
  (eventsResource) => {
    return eventsResource?.data
  }
)

export const selectVesselActivityEvents = createSelector([selectVesselEvents], (vesselEvents) => {
  return groupEvents((vesselEvents as ActivityEvent[]) ?? [])
})
