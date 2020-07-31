import { createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { RootState } from 'store'
import GFWAPI from '@globalfishingwatch/api-client'
import { Dataview } from '@globalfishingwatch/dataviews-client'
import { AsyncReducer, createAsyncSlice } from 'features/api/api.slice'
import { getUserId } from 'features/user/user.slice'

export const fetchDataviewsThunk = createAsyncThunk('dataviews/fetch', async () => {
  const data = await GFWAPI.fetch<Dataview[]>('/v1/datavews')
  return data
})

export type DataviewsState = AsyncReducer<Dataview>

const { slice: dataviewsSlice, entityAdapter } = createAsyncSlice<DataviewsState, Dataview>({
  name: 'dataviews',
  thunks: { fetchThunk: fetchDataviewsThunk },
})

export const { selectAll, selectById } = entityAdapter.getSelectors<RootState>(
  (state) => state.dataviews
)

export const selectShared = createSelector([selectAll, getUserId], (workspaces, userId) =>
  // TODO: make this real when editors in workspaces API
  workspaces.filter((w: any) => w.editors?.includes(userId))
)

export default dataviewsSlice.reducer
