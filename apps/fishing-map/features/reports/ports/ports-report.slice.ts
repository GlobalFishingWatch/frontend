import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { stringify } from 'qs'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { APIPagination, IdentityVessel, VesselGroup } from '@globalfishingwatch/api-types'
import { AsyncError, AsyncReducerStatus } from 'utils/async-slice'
import { INCLUDES_RELATED_SELF_REPORTED_INFO_ID } from 'features/vessel/vessel.config'

interface ReportState {
  status: AsyncReducerStatus
  statusId: string
  error: AsyncError | null
  data: IdentityVessel[] | null
}

type PortsReportSliceState = { vesselGroupReport: ReportState }

const initialState: ReportState = {
  status: AsyncReducerStatus.Idle,
  statusId: '',
  error: null,
  data: null,
}

type FetchPortsReportThunkParams = {
  portId: string
}

export const fetchPortsReportThunk = createAsyncThunk(
  'vessel-group-report/vessels',
  async ({ portId }: FetchPortsReportThunkParams, { rejectWithValue, signal }) => {
    try {
      const portVesselsIds = await GFWAPI.fetch<VesselGroup>(`/vessel-groups/${portId}`)
      const params = {
        'vessel-groups': [portId],
        includes: [INCLUDES_RELATED_SELF_REPORTED_INFO_ID],
      }
      const vesselGroupVessels = await GFWAPI.fetch<APIPagination<IdentityVessel>>(
        `/vessels?${stringify(params)}`,
        { cache: 'reload', signal }
      )
      return vesselGroupVessels.entries
    } catch (e) {
      console.warn(e)
      return rejectWithValue(e)
    }
  },
  {
    condition: (params: FetchPortsReportThunkParams, { getState }) => {
      const { status, statusId } = (getState() as PortsReportSliceState)?.vesselGroupReport
      if (
        status === AsyncReducerStatus.Error ||
        status === AsyncReducerStatus.Loading ||
        status === AsyncReducerStatus.Finished
      ) {
        return statusId !== params.portId
      }
      return true
    },
  }
)

const portsReportSlice = createSlice({
  name: 'portsReport',
  initialState,
  reducers: {
    resetPortsReportData: (state) => {
      state.status = AsyncReducerStatus.Idle
      state.data = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPortsReportThunk.pending, (state, action) => {
      state.status = AsyncReducerStatus.Loading
      state.statusId = action.meta.arg.portId
    })
    builder.addCase(fetchPortsReportThunk.fulfilled, (state, action) => {
      state.status = AsyncReducerStatus.Finished
      state.data = action.payload
    })
    builder.addCase(fetchPortsReportThunk.rejected, (state, action) => {
      state.status = AsyncReducerStatus.Error
      state.error = action.payload as AsyncError
    })
  },
})

export const { resetPortsReportData } = portsReportSlice.actions

export const selectPortsReportStatus = (state: PortsReportSliceState) =>
  state.vesselGroupReport.status
export const selectPortsReportError = (state: PortsReportSliceState) =>
  state.vesselGroupReport.error
export const selectPortsReportData = (state: PortsReportSliceState) => state.vesselGroupReport.data

export default portsReportSlice.reducer
