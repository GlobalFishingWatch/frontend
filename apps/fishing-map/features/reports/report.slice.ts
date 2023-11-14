import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { stringify } from 'qs'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { APIPagination, ReportVesselsByDataset } from '@globalfishingwatch/api-types'
import { AsyncError, AsyncReducerStatus } from 'utils/async-slice'
import { getUTCDateTime } from 'utils/dates'
import {
  Format,
  GroupBy,
  SpatialResolution,
  TemporalResolution,
} from 'features/download/downloadActivity.config'
import { BufferOperation, BufferUnit } from 'types'
import { DateRange } from '../download/downloadActivity.slice'

type ReportStateError = AsyncError<{ currentReportUrl: string }>
interface ReportState {
  status: AsyncReducerStatus
  error: ReportStateError | null
  data: ReportVesselsByDataset[] | null
  dateRangeHash: string
  previewBuffer: PreviewBuffer
}

type ReportSliceState = { report: ReportState }
type PreviewBuffer = {
  value: number | null
  unit: BufferUnit | null
  operation: BufferOperation | null
}
const initialState: ReportState = {
  status: AsyncReducerStatus.Idle,
  error: null,
  data: null,
  dateRangeHash: '',
  previewBuffer: { value: null, unit: null, operation: null },
}
type ReportRegion = {
  dataset: string
  id: number
}

type FetchReportVesselsThunkParams = {
  region: ReportRegion
  datasets: string[]
  filters: Record<string, any>[]
  vesselGroups: string[]
  dateRange: DateRange
  temporalResolution?: TemporalResolution
  groupBy?: GroupBy
  spatialResolution?: SpatialResolution
  format?: Format.Csv | Format.Json
  spatialAggregation?: boolean
  reportBufferUnit?: BufferUnit
  reportBufferValue?: number
  reportBufferOperation?: BufferOperation
}

export const getReportQuery = (params: FetchReportVesselsThunkParams) => {
  const {
    region,
    datasets,
    filters,
    vesselGroups,
    dateRange,
    temporalResolution = TemporalResolution.Full,
    groupBy = GroupBy.Vessel,
    spatialResolution = SpatialResolution.Low,
    spatialAggregation = true,
    format = Format.Json,
    reportBufferUnit,
    reportBufferValue,
    reportBufferOperation,
  } = params
  const query = stringify(
    {
      datasets,
      filters,
      'vessel-groups': vesselGroups,
      'temporal-resolution': temporalResolution,
      'date-range': [
        getUTCDateTime(dateRange?.start)?.toString(),
        getUTCDateTime(dateRange?.end)?.toString(),
      ].join(','),
      'group-by': groupBy,
      'spatial-resolution': spatialResolution,
      'spatial-aggregation': spatialAggregation,
      format: format,
      'region-id': region.id,
      'region-dataset': region.dataset,
      'buffer-unit': reportBufferUnit?.toUpperCase(),
      'buffer-value': reportBufferValue,
      'buffer-operation': reportBufferOperation?.toUpperCase(),
    },
    { arrayFormat: 'indices' }
  )
  return query
}
export const fetchReportVesselsThunk = createAsyncThunk(
  'report/vessels',
  async (params: FetchReportVesselsThunkParams, { rejectWithValue }) => {
    try {
      const query = getReportQuery(params)
      const vessels = await GFWAPI.fetch<APIPagination<ReportVesselsByDataset>>(
        `/4wings/report?${query}`
      )
      return vessels.entries
    } catch (e) {
      console.warn(e)
      return rejectWithValue(e)
    }
  },
  {
    condition: (params: FetchReportVesselsThunkParams, { getState }) => {
      const { status } = (getState() as ReportSliceState)?.report
      if (status === AsyncReducerStatus.Loading) {
        return false
      }
      return true
    },
  }
)

export function getDateRangeHash(dateRange: DateRange) {
  return [dateRange.start, dateRange.end].join('-')
}

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    resetReportData: (state) => {
      state.status = AsyncReducerStatus.Idle
      state.data = null
      state.error = null
      state.dateRangeHash = ''
      state.previewBuffer = { value: null, unit: null, operation: null }
    },
    setDateRangeHash: (state, action: PayloadAction<string>) => {
      state.dateRangeHash = action.payload
    },
    setPreviewBuffer: (state, action: PayloadAction<PreviewBuffer>) => {
      state.previewBuffer = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchReportVesselsThunk.pending, (state) => {
      state.status = AsyncReducerStatus.Loading
    })
    builder.addCase(fetchReportVesselsThunk.fulfilled, (state, action) => {
      state.status = AsyncReducerStatus.Finished
      state.data = action.payload
      state.dateRangeHash = getDateRangeHash(action.meta.arg.dateRange)
    })
    builder.addCase(fetchReportVesselsThunk.rejected, (state, action) => {
      state.status = AsyncReducerStatus.Error
      state.error = action.payload as ReportStateError
    })
  },
})

export const { resetReportData, setDateRangeHash, setPreviewBuffer } = reportSlice.actions

export const selectReportSummary = (state: ReportSliceState) => state.report
export const selectReportVesselsStatus = (state: ReportSliceState) => state.report.status
export const selectReportVesselsError = (state: ReportSliceState) => state.report.error
export const selectReportVesselsData = (state: ReportSliceState) => state.report.data
export const selectReportPreviewBuffer = (state: ReportSliceState) => state.report.previewBuffer
export const selectReportVesselsDateRangeHash = (state: ReportSliceState) =>
  state.report.dateRangeHash

export default reportSlice.reducer
