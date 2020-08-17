import { createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from 'store'
import GFWAPI from '@globalfishingwatch/api-client'
import { AOI } from '@globalfishingwatch/dataviews-client/dist/types'
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

export const { selectAll: selectAllAOI, selectById: selectAOIById } = entityAdapter.getSelectors<
  RootState
>((state) => state.aoi)

export const selectAOIStatus = (state: RootState) => state.aoi.status
export const selectAOIStatusId = (state: RootState) => state.aoi.statusId

export default aoiSlice.reducer
