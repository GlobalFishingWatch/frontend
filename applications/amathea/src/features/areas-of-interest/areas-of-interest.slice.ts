import { createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { RootState } from 'store'
import memoize from 'lodash/memoize'
import GFWAPI from '@globalfishingwatch/api-client'
import { AOI } from '@globalfishingwatch/api-types'
import { AsyncReducer, createAsyncSlice } from 'features/api/api.slice'

export const fetchAOIThunk = createAsyncThunk('aoi/fetch', async () => {
  const data = await GFWAPI.fetch<AOI[]>('/v1/aoi')
  return data
})

export const deleteAOIThunk = createAsyncThunk(
  'aoi/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      const aoi = await GFWAPI.fetch<AOI>(`/v1/aoi/${id}`, {
        method: 'DELETE',
      })
      return { ...aoi, id }
    } catch (e) {
      return rejectWithValue(id)
    }
  }
)

type AOIState = AsyncReducer<AOI>

const { slice: aoiSlice, entityAdapter } = createAsyncSlice<AOIState, AOI>({
  name: 'aoi',
  reducers: {},
  thunks: { fetchThunk: fetchAOIThunk, deleteThunk: deleteAOIThunk },
})

export const { selectAll: selectAllAOI, selectById } = entityAdapter.getSelectors<RootState>(
  (state) => state.aoi
)

export const selectAllAOIOptions = createSelector([selectAllAOI], (aois) =>
  aois.map(({ id, name }) => ({ id, label: name }))
)

export const selectAOIById = memoize((id: string) =>
  createSelector([(state: RootState) => state], (state) => selectById(state, id))
)

export const selectAOIStatus = (state: RootState) => state.aoi.status
export const selectAOIStatusId = (state: RootState) => state.aoi.statusId

export default aoiSlice.reducer
