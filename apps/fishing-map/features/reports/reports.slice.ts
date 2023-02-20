import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { stringify } from 'qs'
import { GFWAPI, parseAPIError } from '@globalfishingwatch/api-client'
import { APIPagination, ReportVesselsByDataset } from '@globalfishingwatch/api-types'
import { RootState } from 'store'
import { AsyncError, AsyncReducerStatus } from 'utils/async-slice'
import { getUTCDateTime } from 'utils/dates'
import { DateRange } from '../download/downloadActivity.slice'

interface ReportState {
  status: AsyncReducerStatus
  error: AsyncError | null
  data: ReportVesselsByDataset[] | null
}

const initialState: ReportState = {
  status: AsyncReducerStatus.Idle,
  error: null,
  data: null,
}
type ReportRegion = {
  dataset: string
  id: number
}

type TemporalResolution = 'daily' | 'monthly' | 'yearly' | 'entire'
type FetchReportVesselsThunkParams = {
  region: ReportRegion
  datasets: string[]
  filters: Record<string, any>[]
  vesselGroups: string[]
  temporalResolution: TemporalResolution
  dateRange: DateRange
  groupBy?: 'vessel_id' | 'flag' | 'geartype' | 'flagAndGearType' | 'mmsi'
  spatialResolution?: 'low' | 'high'
  format?: 'csv' | 'json'
  spatialAggregation?: boolean
}
export const fetchReportVesselsThunk = createAsyncThunk(
  'reports/vessels',
  async (params: FetchReportVesselsThunkParams, { rejectWithValue }) => {
    try {
      const {
        region,
        datasets,
        filters,
        vesselGroups,
        dateRange,
        temporalResolution,
        groupBy = 'vessel_id',
        spatialResolution = 'low',
        spatialAggregation = true,
        format = 'json',
      } = params
      const query = stringify(
        {
          datasets,
          filters,
          'vessel-groups': vesselGroups,
          'temporal-resolution': temporalResolution,
          'date-range': [
            getUTCDateTime(dateRange?.start).toString(),
            getUTCDateTime(dateRange?.end).toString(),
          ].join(','),
          'group-by': groupBy,
          'spatial-resolution': spatialResolution,
          'spatial-aggregation': spatialAggregation,
          format: format,
        },
        { arrayFormat: 'indices' }
      )
      const vessels = await GFWAPI.fetch<APIPagination<ReportVesselsByDataset>>(
        `/4wings/report?${query}`,
        {
          method: 'POST',
          body: {
            region,
          } as any,
        }
      )
      return vessels.entries
    } catch (e) {
      console.warn(e)
      return rejectWithValue(parseAPIError(e))
    }
  },
  {
    condition: (params: FetchReportVesselsThunkParams, { getState }) => {
      const { status } = (getState() as RootState)?.reports
      if (status === AsyncReducerStatus.Loading || status === AsyncReducerStatus.Error) {
        return false
      }
      return true
    },
  }
)

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchReportVesselsThunk.pending, (state) => {
      state.status = AsyncReducerStatus.Loading
    })
    builder.addCase(fetchReportVesselsThunk.fulfilled, (state, action) => {
      state.status = AsyncReducerStatus.Finished
      state.data = action.payload
    })
    builder.addCase(
      fetchReportVesselsThunk.rejected,
      (state, action: PayloadAction<AsyncError>) => {
        state.status = AsyncReducerStatus.Error
        state.error = action.payload
      }
    )
  },
})

export const selectReportSummary = (state: RootState) => state.reports
export const selectReportVesselsStatus = (state: RootState) => state.reports.status
export const selectReportVesselsError = (state: RootState) => state.reports.error
export const selectReportVesselsData = (state: RootState) => state.reports.data

export default reportSlice.reducer
