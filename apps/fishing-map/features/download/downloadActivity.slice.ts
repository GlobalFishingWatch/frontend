import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Geometry } from 'geojson'
import { stringify } from 'qs'
import { saveAs } from 'file-saver'
import i18next from 'i18next'
import { RootState } from 'reducers'
import { DownloadActivity } from '@globalfishingwatch/api-types'
import { GFWAPI, parseAPIError } from '@globalfishingwatch/api-client'
import { AsyncError, AsyncReducerStatus } from 'utils/async-slice'
import { AreaKeys } from 'features/areas/areas.slice'
import { getUTCDateTime } from 'utils/dates'
import { Format, GroupBy, SpatialResolution, TemporalResolution } from './downloadActivity.config'

export type DateRange = {
  start: string
  end: string
}

export interface DownloadActivityState {
  areaKey: AreaKeys | undefined
  status: AsyncReducerStatus
}

const initialState: DownloadActivityState = {
  areaKey: undefined,
  status: AsyncReducerStatus.Idle,
}

export type DownloadActivityParams = {
  dateRange: DateRange
  dataviews: {
    datasets: string[]
    filter?: string
  }[]
  geometry: Geometry
  areaName: string
  format: Format
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
        spatialAggregation,
        dateRange,
        dataviews,
        geometry,
        areaName,
        format,
        spatialResolution,
        temporalResolution,
        groupBy,
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
        'group-by': groupBy,
      }

      const fileName = `${areaName} - ${downloadActivityParams['date-range']}.${
        format === Format.Json ? 'json' : 'zip'
      }`
      const downloadUrl = `/4wings/report?${stringify(downloadActivityParams, {
        arrayFormat: 'indices',
      })}`

      const createdDownload: any = await GFWAPI.fetch<DownloadActivity>(downloadUrl, {
        method: 'POST',
        body: { geojson: geometry } as any,
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${GFWAPI.getToken()}`,
          'Content-Language': i18next.language === 'es' ? 'es-ES' : 'en-EN',
        },
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
    setDownloadActivityAreaKey: (state, action: PayloadAction<AreaKeys>) => {
      state.areaKey = action.payload
    },
    resetDownloadActivityStatus: (state) => {
      state.status = AsyncReducerStatus.Idle
    },
    resetDownloadActivityState: (state) => {
      state.areaKey = undefined
      state.status = AsyncReducerStatus.Idle
    },
  },
  extraReducers: (builder) => {
    builder.addCase(downloadActivityThunk.pending, (state) => {
      state.status = AsyncReducerStatus.Loading
    })
    builder.addCase(downloadActivityThunk.fulfilled, (state) => {
      state.status = AsyncReducerStatus.Finished
    })
    builder.addCase(downloadActivityThunk.rejected, (state, action) => {
      state.status =
        action.error.message === 'Aborted' ? AsyncReducerStatus.Aborted : AsyncReducerStatus.Error
    })
  },
})

export const {
  setDownloadActivityAreaKey,
  resetDownloadActivityStatus,
  resetDownloadActivityState,
} = downloadActivitySlice.actions

export const selectDownloadActivityStatus = (state: RootState) => state.downloadActivity.status
export const selectDownloadActivityAreaKey = (state: RootState) => state.downloadActivity.areaKey

export const selectDownloadActivityLoading = createSelector(
  [selectDownloadActivityStatus],
  (status) => status === AsyncReducerStatus.Loading
)

export const selectDownloadActivityError = createSelector(
  [selectDownloadActivityStatus],
  (status) => status === AsyncReducerStatus.Error
)

export const selectDownloadActivityFinished = createSelector(
  [selectDownloadActivityStatus],
  (status) => status === AsyncReducerStatus.Finished
)

export default downloadActivitySlice.reducer
