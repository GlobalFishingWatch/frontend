import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { stringify } from 'qs'
import { saveAs } from 'file-saver'
import { RootState } from 'reducers'
import { Dataview, DownloadActivity } from '@globalfishingwatch/api-types'
import { GFWAPI, parseAPIError } from '@globalfishingwatch/api-client'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { AsyncError, AsyncReducerStatus } from 'utils/async-slice'
import { AreaKeyId, AreaKeys } from 'features/areas/areas.slice'
import { getUTCDateTime } from 'utils/dates'
import { BufferOperation, BufferUnit } from 'types'
import {
  HeatmapDownloadTab,
  HeatmapDownloadFormat,
  GroupBy,
  SpatialResolution,
  TemporalResolution,
} from './downloadActivity.config'

export type DateRange = {
  start: string
  end: string
}

interface DownloadActivityState {
  areaKey: AreaKeys | undefined
  areaDataview: Dataview | UrlDataviewInstance | undefined
  error: string
  status: AsyncReducerStatus
  activeTabId: HeatmapDownloadTab
}

const initialState: DownloadActivityState = {
  areaKey: undefined,
  areaDataview: undefined,
  error: '',
  status: AsyncReducerStatus.Idle,
  activeTabId: HeatmapDownloadTab.ByVessel,
}

export type DownloadActivityParams = {
  dateRange: DateRange
  areaId: AreaKeyId
  datasetId: string
  dataviews: {
    datasets: string[]
    'vessel-groups'?: string[]
    filter?: string
  }[]
  areaName: string
  format: HeatmapDownloadFormat
  bufferUnit?: BufferUnit
  bufferValue?: number
  bufferOperation?: BufferOperation
  spatialAggregation?: boolean
  spatialResolution?: SpatialResolution
  temporalResolution?: TemporalResolution
  groupBy?: GroupBy
}

export const downloadActivityThunk = createAsyncThunk<
  DownloadActivity,
  DownloadActivityParams,
  {
    rejectValue: AsyncError
  }
>(
  'downloadActivity/create',
  async (params: DownloadActivityParams, { getState, rejectWithValue }) => {
    try {
      const {
        areaId,
        datasetId,
        spatialAggregation,
        dateRange,
        dataviews,
        areaName,
        format,
        spatialResolution,
        temporalResolution,
        groupBy,
        bufferUnit,
        bufferValue,
        bufferOperation,
      } = params
      const fromDate = getUTCDateTime(dateRange.start)
      const toDate = getUTCDateTime(dateRange.end)

      const downloadActivityParams = {
        format,
        datasets: dataviews.map(({ datasets }) => datasets.join(',')),
        filters: dataviews.map(({ filter }) => filter),
        'vessel-groups': dataviews.map((dv) => dv['vessel-groups']),
        'date-range': [fromDate, toDate].join(','),
        'spatial-aggregation': spatialAggregation,
        'spatial-resolution': spatialResolution,
        'temporal-resolution': temporalResolution,
        'region-id': areaId,
        'region-dataset': datasetId,
        'group-by': groupBy,
        'buffer-unit': bufferUnit?.toUpperCase(),
        'buffer-value': bufferValue,
        'buffer-operation': bufferOperation?.toUpperCase(),
      }

      const fileName = `${areaName} - ${downloadActivityParams['date-range']}.${
        format === HeatmapDownloadFormat.Json ? 'json' : 'zip'
      }`
      const downloadUrl = `/4wings/report?${stringify(downloadActivityParams, {
        arrayFormat: 'indices',
      })}`

      const createdDownload: any = await GFWAPI.fetch<DownloadActivity>(downloadUrl, {
        responseType: 'blob',
      }).then((blob) => {
        saveAs(blob as any, fileName)
      })

      return createdDownload
    } catch (e: any) {
      console.warn(e)
      return rejectWithValue(parseAPIError(e))
    }
  }
)

const downloadActivitySlice = createSlice({
  name: 'downloadActivity',
  initialState,
  reducers: {
    setDownloadActiveTab: (state, action: PayloadAction<HeatmapDownloadTab>) => {
      state.activeTabId = action.payload
    },
    setDownloadActivityAreaKey: (state, action: PayloadAction<AreaKeys>) => {
      state.areaKey = action.payload
    },
    resetDownloadActivityState: (state) => {
      state.areaKey = undefined
      state.status = AsyncReducerStatus.Idle
    },
  },
  extraReducers: (builder) => {
    builder.addCase(downloadActivityThunk.pending, (state) => {
      state.status = AsyncReducerStatus.Loading
      state.error = ''
    })
    builder.addCase(downloadActivityThunk.fulfilled, (state) => {
      state.status = AsyncReducerStatus.Finished
    })
    builder.addCase(downloadActivityThunk.rejected, (state, action) => {
      state.status =
        action.error.message === 'Aborted' ? AsyncReducerStatus.Aborted : AsyncReducerStatus.Error
      if (action.payload?.message) {
        state.error = action.payload?.message
      }
    })
  },
})

export const { setDownloadActiveTab, setDownloadActivityAreaKey, resetDownloadActivityState } =
  downloadActivitySlice.actions

const selectDownloadActivityStatus = (state: RootState) => state.downloadActivity.status
const selectDownloadActivityErrorMsg = (state: RootState) => state.downloadActivity.error
export const selectDownloadActivityAreaKey = (state: RootState) => state.downloadActivity.areaKey
export const selectDownloadActiveTabId = (state: RootState) => state.downloadActivity.activeTabId

export const selectIsDownloadActivityLoading = createSelector(
  [selectDownloadActivityStatus],
  (status) => status === AsyncReducerStatus.Loading
)

export const selectIsDownloadActivityError = createSelector(
  [selectDownloadActivityStatus],
  (status) => status === AsyncReducerStatus.Error
)

export const selectIsDownloadActivityFinished = createSelector(
  [selectDownloadActivityStatus],
  (status) => status === AsyncReducerStatus.Finished
)

export const selectIsDownloadAreaTooBig = createSelector(
  [selectDownloadActivityErrorMsg],
  (message) => message === 'Geometry too large'
)

export default downloadActivitySlice.reducer
