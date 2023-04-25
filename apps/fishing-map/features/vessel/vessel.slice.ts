import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { Vessel } from '@globalfishingwatch/api-types'
import { AsyncReducerStatus } from 'utils/async-slice'

interface VesselState {
  status: AsyncReducerStatus
  data: Vessel | null
}

const initialState: VesselState = {
  status: AsyncReducerStatus.Idle,
  data: null,
}

type VesselSliceState = { vessel: VesselState }

type FetchVesselThunkParams = { vesselId: string; datasetId }
export const fetchVesselThunk = createAsyncThunk(
  'vessel/fetch',
  async ({ vesselId, datasetId }: FetchVesselThunkParams = {} as FetchVesselThunkParams) => {
    const vessel = await GFWAPI.fetch<Vessel>(`/vessels/${vesselId}?datasets=${datasetId}`)
    return vessel
  },
  {
    condition: (params, { getState }) => {
      const { vessel } = getState() as VesselSliceState
      return vessel.status !== AsyncReducerStatus.Loading
    },
  }
)

const vesselSlice = createSlice({
  name: 'vessel',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchVesselThunk.pending, (state) => {
      state.status = AsyncReducerStatus.Loading
    })
    builder.addCase(fetchVesselThunk.fulfilled, (state, action) => {
      state.status = AsyncReducerStatus.Finished
      state.data = action.payload
    })
    builder.addCase(fetchVesselThunk.rejected, (state) => {
      state.status = AsyncReducerStatus.Error
    })
  },
})

export const selectVesselData = (state: VesselSliceState) => state.vessel.data
export const selectUserStatus = (state: VesselSliceState) => state.vessel.status

export default vesselSlice.reducer
