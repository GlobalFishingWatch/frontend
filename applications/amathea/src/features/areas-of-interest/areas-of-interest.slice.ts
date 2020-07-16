import { createSelector, createAsyncThunk } from '@reduxjs/toolkit'
// import GFWAPI from '@globalfishingwatch/api-client'
import { RootState } from 'store'
import { AOIConfig } from 'types'
import { AsyncReducer, createAsyncSlice } from 'features/api/api.slice'

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const fetchAOI = createAsyncThunk('aoi/fetchList', async () => {
  // const data = await GFWAPI.fetch<AOIConfig[]>('/areas-of-interest')
  // return data
  await timeout(1000)
  return [
    { id: 'aoi-1', label: 'Galapagos Marine Reserve' },
    { id: 'aoi-2', label: 'Caribbean Sea' },
  ]
})

interface AOIState extends AsyncReducer<AOIConfig[]> {
  selected: string
}

const initialState: AOIState = {
  selected: '',
}

const aoiSlice = createAsyncSlice({
  name: 'aoi',
  initialState,
  reducers: {},
  thunk: fetchAOI,
})

export const selectAOIList = (state: RootState) => state.aoi.data
export const selectAOISelected = (state: RootState) => state.aoi.selected

export const getCurrentAOI = createSelector(
  [selectAOIList, selectAOISelected],
  (aoiList, selectedId) => {
    if (!aoiList) return
    aoiList.find((aoi) => aoi.id === selectedId)
  }
)
export default aoiSlice.reducer
