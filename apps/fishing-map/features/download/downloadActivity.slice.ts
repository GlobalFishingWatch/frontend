import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import { saveAs } from 'file-saver'
import { stringify } from 'qs'
import type { RootState } from 'reducers'

import {
  getIsConcurrentError,
  getIsTimeoutError,
  GFWAPI,
  parseAPIError,
} from '@globalfishingwatch/api-client'
import type { Dataview, DownloadActivity } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import type { AreaKeyId, AreaKeys } from 'features/areas/areas.slice'
import type { BufferOperation, BufferUnit } from 'types'
import type { AsyncError } from 'utils/async-slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import { getUTCDateTime } from 'utils/dates'

import type { GroupBy, SpatialResolution, TemporalResolution } from './downloadActivity.config'
import { HeatmapDownloadFormat,HeatmapDownloadTab } from './downloadActivity.config'

export type DateRange = {
  start: string
  end: string
}

interface DownloadActivityState {
  areaKey: AreaKeys | undefined
  areaDataview: Dataview | UrlDataviewInstance | undefined
  error: AsyncError | undefined
  status: AsyncReducerStatus
  hadTimeoutError: boolean
  fileName: string
  activeTabId: HeatmapDownloadTab
}

const initialState: DownloadActivityState = {
  areaKey: undefined,
  areaDataview: undefined,
  error: undefined,
  status: AsyncReducerStatus.Idle,
  hadTimeoutError: false,
  fileName: '',
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

export const downloadActivityLastReportThunk = createAsyncThunk(
  'downloadActivity/last-report',
  async (_, { getState, rejectWithValue }) => {
    const fileName = (getState() as RootState)?.downloadActivity?.fileName || 'activity-download'
    try {
      const response = await GFWAPI.fetch<Response>(`/4wings/last-report`, {
        responseType: 'default',
      })

      if (response.ok) {
        const contentType = response.headers.get('content-type')
        if (contentType?.includes('application/json')) {
          const data = (await response.json()) as { status: string }
          return data.status
        } else {
          const data = await response.blob()
          saveAs(data as any, fileName)
          return 'finished'
        }
      }
    } catch (error: any) {
      return rejectWithValue(parseAPIError(error))
    }
  },
  {
    condition: (_, { getState }) => {
      const { downloadActivity } = getState() as RootState
      return downloadActivity?.hadTimeoutError
    },
  }
)

export const downloadActivityThunk = createAsyncThunk<
  DownloadActivity,
  DownloadActivityParams,
  {
    rejectValue: AsyncError
  }
>(
  'downloadActivity/create',
  async (params: DownloadActivityParams, { dispatch, rejectWithValue }) => {
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
      dispatch(setFileName(fileName))
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
  },
  {
    condition: (_, { getState }) => {
      const { downloadActivity } = getState() as RootState
      return downloadActivity?.status !== AsyncReducerStatus.Loading
    },
  }
)

const downloadActivitySlice = createSlice({
  name: 'downloadActivity',
  initialState,
  reducers: {
    setFileName: (state, action: PayloadAction<string>) => {
      state.fileName = action.payload
    },
    setDownloadActiveTab: (state, action: PayloadAction<HeatmapDownloadTab>) => {
      state.activeTabId = action.payload
    },
    setDownloadActivityAreaKey: (state, action: PayloadAction<AreaKeys>) => {
      state.areaKey = action.payload
    },
    resetDownloadActivityState: (state) => {
      state.areaKey = undefined
      state.status = AsyncReducerStatus.Idle
      state.fileName = ''
      state.hadTimeoutError = false
    },
  },
  extraReducers: (builder) => {
    builder.addCase(downloadActivityLastReportThunk.pending, (state) => {
      state.status = AsyncReducerStatus.Loading
      state.error = undefined
    })
    builder.addCase(downloadActivityLastReportThunk.fulfilled, (state, action) => {
      if (action.payload === 'finished') {
        state.status = AsyncReducerStatus.Finished
        state.hadTimeoutError = false
        state.fileName = ''
      }
    })
    builder.addCase(downloadActivityLastReportThunk.rejected, (state, action) => {
      state.status = AsyncReducerStatus.Finished
      state.hadTimeoutError = false
    })
    builder.addCase(downloadActivityThunk.pending, (state) => {
      state.status = AsyncReducerStatus.Loading
      state.error = undefined
    })
    builder.addCase(downloadActivityThunk.fulfilled, (state) => {
      state.status = AsyncReducerStatus.Finished
      state.hadTimeoutError = false
    })
    builder.addCase(downloadActivityThunk.rejected, (state, action) => {
      if (action.error.message === 'Aborted') {
        state.status = AsyncReducerStatus.Aborted
      } else {
        state.status = AsyncReducerStatus.Error
        if (action.payload?.message) {
          const isTimeoutError = getIsTimeoutError(action.payload)
          if (isTimeoutError) {
            state.hadTimeoutError = true
          }
          state.error = action.payload
        }
      }
    })
  },
})

export const {
  setFileName,
  setDownloadActiveTab,
  setDownloadActivityAreaKey,
  resetDownloadActivityState,
} = downloadActivitySlice.actions

const selectDownloadActivityStatus = (state: RootState) => state.downloadActivity.status
export const selectDownloadActivityError = (state: RootState) => state.downloadActivity.error
export const selectHadDownloadActivityTimeoutError = (state: RootState) =>
  state.downloadActivity.hadTimeoutError
export const selectDownloadActivityErrorMsg = (state: RootState) =>
  state.downloadActivity.error?.message
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
  [selectDownloadActivityError],
  (downloadError) => downloadError?.message === 'Geometry too large'
)

export const selectIsDownloadActivityTimeoutError = createSelector(
  [selectDownloadActivityError],
  (downloadError) => getIsTimeoutError(downloadError)
)

export const selectIsDownloadActivityConcurrentError = createSelector(
  [selectDownloadActivityError],
  (downloadError) => getIsConcurrentError(downloadError)
)

export default downloadActivitySlice.reducer
