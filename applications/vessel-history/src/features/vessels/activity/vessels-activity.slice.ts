import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  PartialStoreResources,
  resolveDataviewDatasetResource,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import { ApiEvent, DatasetTypes, Vessel } from '@globalfishingwatch/api-types'
import { Segment } from '@globalfishingwatch/data-transforms'
import { AsyncReducerStatus } from 'utils/async-slice'
import { RootState } from 'store'
import { ActivityEvent, ActivityEventGroup } from 'types/activity'
import { selectResources, selectResourceByUrl } from 'features/resources/resources.slice'
import { selectVesselsDataviews } from 'features/dataviews/dataviews.selectors'
import { selectVesselDataview } from '../vessels.slice'
import { fetchVesselActivityThunk, groupEvents } from './vessels-activity.thunk'

export type ActivitySlice = {
  status: AsyncReducerStatus
  events: ActivityEventGroup[]
}

const initialState: ActivitySlice = {
  status: AsyncReducerStatus.Idle,
  events: [],
}

const slice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    toggleGroup: (state, action: PayloadAction<{ index: number }>) => {
      const index = action.payload.index
      state.events[index].open = !state.events[index].open
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchVesselActivityThunk.pending, (state, action) => {
      state.status = AsyncReducerStatus.Loading
    })
    builder.addCase(fetchVesselActivityThunk.fulfilled, (state, action) => {
      state.status = AsyncReducerStatus.Finished
      if (action.payload) {
        state.events = action.payload
      }
    })
    builder.addCase(fetchVesselActivityThunk.rejected, (state, action) => {})
  },
})

export const { toggleGroup } = slice.actions

export default slice.reducer

export const selectVesselActivity = (state: RootState) => state.activity.events

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
// export const selectVesselResources = createSelector(
//   [
//     // selectVesselResourceByDatasetType<Vessel>(DatasetTypes.Vessels),
//     // selectVesselResourceByDatasetType<Segment[]>(DatasetTypes.Tracks),
//     selectVesselResourceByDatasetType<ApiEvent[]>(DatasetTypes.Events),
//   ],
//   (
//     // infoResource,
//     // trackResource,
//     eventsResource
//   ) => {
//     const result = { infoResource, trackResource, eventsResource }
//     console.log(result)
//     return result
//   }
// )
