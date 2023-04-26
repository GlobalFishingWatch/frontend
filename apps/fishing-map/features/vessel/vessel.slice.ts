import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { ApiEvent, Vessel } from '@globalfishingwatch/api-types'
import { AsyncReducerStatus } from 'utils/async-slice'

interface VesselState {
  info: {
    status: AsyncReducerStatus
    data: Vessel | null
  }
  events: {
    status: AsyncReducerStatus
    data: ApiEvent[] | null
  }
}

const initialState: VesselState = {
  info: {
    status: AsyncReducerStatus.Idle,
    data: null,
  },
  events: {
    status: AsyncReducerStatus.Idle,
    data: null,
  },
}

type VesselSliceState = { vessel: VesselState }

type FetchVesselThunkParams = { vesselId: string; datasetId }
export const fetchVesselThunk = createAsyncThunk(
  'vessel/fetchInfo',
  async ({ vesselId, datasetId }: FetchVesselThunkParams = {} as FetchVesselThunkParams) => {
    const vessel = await GFWAPI.fetch<Vessel>(`/vessels/${vesselId}?datasets=${datasetId}`)
    return vessel
  },
  {
    condition: (params, { getState }) => {
      const { vessel } = getState() as VesselSliceState
      return vessel.info?.status !== AsyncReducerStatus.Loading
    },
  }
)

const vesselSlice = createSlice({
  name: 'vessel',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchVesselThunk.pending, (state) => {
      state.info.status = AsyncReducerStatus.Loading
    })
    builder.addCase(fetchVesselThunk.fulfilled, (state, action) => {
      state.info.status = AsyncReducerStatus.Finished
      state.info.data = action.payload
    })
    builder.addCase(fetchVesselThunk.rejected, (state) => {
      state.info.status = AsyncReducerStatus.Error
    })
  },
})

export const selectVesselInfoData = (state: VesselSliceState) => state.vessel.info.data
export const selectVesselInfoStatus = (state: VesselSliceState) => state.vessel.info.status
export const selectVesselEventsData = (state: VesselSliceState) => state.vessel.events?.data
export const selectVesselEventsStatus = (state: VesselSliceState) => state.vessel.events?.status

export default vesselSlice.reducer
