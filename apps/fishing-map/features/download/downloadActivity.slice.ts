import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'
import { Geometry } from 'geojson'
import { stringify } from 'qs'
import { saveAs } from 'file-saver'
import { DownloadActivity } from '@globalfishingwatch/api-types'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { TooltipEventFeature } from 'features/map/map.hooks'
import { RootState } from 'store'
import { AsyncError, AsyncReducerStatus } from 'utils/async-slice'
import { transformFilters } from 'features/analysis/analysis.utils'
import { DateRange } from 'features/analysis/analysis.slice'
import { Format, GroupBy, SpatialResolution, TemporalResolution } from './downloadActivity.config'

export interface DownloadActivityState {
  geometry: Geometry | undefined
  name: string
  id: string
  requests: { id: string; status: AsyncReducerStatus }[]
}

const initialState: DownloadActivityState = {
  geometry: undefined,
  name: '',
  id: '',
  requests: [],
}

export type DownloadActivityParams = {
  dateRange: DateRange
  dataview: {
    datasets: string[]
    filters?: Record<string, any>
  }
  geometry: Geometry
  areaName: string
  format: Format
  spatialResolution: SpatialResolution
  temporalResolution: TemporalResolution
  groupBy: GroupBy
}

export const downloadActivityThunk = createAsyncThunk<
  DownloadActivity,
  DownloadActivityParams,
  {
    rejectValue: AsyncError
  }
>('downloadActivity/create', async (params: DownloadActivityParams, { rejectWithValue }) => {
  try {
    const {
      dateRange,
      dataview,
      geometry,
      areaName,
      format,
      spatialResolution,
      temporalResolution,
      groupBy,
    } = params
    const fromDate = DateTime.fromISO(dateRange.start).toUTC()
    const toDate = DateTime.fromISO(dateRange.end).toUTC()

    const downloadActivityParams = {
      datasets: [dataview.datasets.join(',')],
      filters: [dataview.filters && transformFilters(dataview.filters)],
      'date-range': [fromDate, toDate].join(','),
      format,
      spatialResolution,
      temporalResolution,
      groupBy,
    }

    const fileName = `${areaName} - ${downloadActivityParams['date-range']}.zip`

    const createdDownload: any = await GFWAPI.fetch<DownloadActivity>(
      `/v1/4wings/report?${stringify(downloadActivityParams, { arrayFormat: 'indices' })}`,
      {
        method: 'POST',
        body: { geojson: geometry } as any,
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${GFWAPI.getToken()}`,
        },
      }
    ).then((blob) => {
      saveAs(blob as any, fileName)
    })
    return createdDownload
  } catch (e: any) {
    return rejectWithValue({ status: e.status || e.code, message: e.message })
  }
})

const downloadActivitySlice = createSlice({
  name: 'downloadActivity',
  initialState,
  reducers: {
    resetDownloadActivityStatus: (state) => {
      state.requests = []
    },
    clearDownloadActivityGeometry: (state) => {
      state.geometry = undefined
      state.name = ''
      state.requests = []
    },
    setDownloadActivityGeometry: (state, action: PayloadAction<TooltipEventFeature>) => {
      state.geometry = action.payload.geometry as Geometry
      state.name = action.payload.value
    },
  },
  extraReducers: (builder) => {
    builder.addCase(downloadActivityThunk.pending, (state, action) => {
      state.requests = [
        ...state.requests,
        { id: action.meta.requestId, status: AsyncReducerStatus.Loading },
      ]
    })
    builder.addCase(downloadActivityThunk.fulfilled, (state, action) => {
      const { requestId } = action.meta
      state.requests = state.requests.map((request) => {
        return request.id === requestId
          ? { id: requestId, status: AsyncReducerStatus.Finished }
          : request
      })
    })
    builder.addCase(downloadActivityThunk.rejected, (state, action) => {
      const { requestId } = action.meta
      const status =
        action.error.message === 'Aborted' ? AsyncReducerStatus.Aborted : AsyncReducerStatus.Error
      state.requests = state.requests.map((request) => {
        return request.id === requestId ? { id: requestId, status } : request
      })
    })
  },
})

export const {
  resetDownloadActivityStatus,
  clearDownloadActivityGeometry,
  setDownloadActivityGeometry,
} = downloadActivitySlice.actions

export const selectDownloadActivityGeometry = (state: RootState) => state.downloadActivity.geometry
export const selectDownloadActivityAreaName = (state: RootState) => state.downloadActivity.name
export const selectDownloadActivityAreaId = (state: RootState) => state.downloadActivity.id
export const selectDownloadActivityRequests = (state: RootState) => state.downloadActivity.requests

export const selectDownloadActivityLoading = createSelector(
  [selectDownloadActivityRequests],
  (requests) => requests.some(({ status }) => status === AsyncReducerStatus.Loading)
)
export const selectDownloadActivityFinished = createSelector(
  [selectDownloadActivityRequests],
  (requests) =>
    requests.length > 0 && requests.every(({ status }) => status === AsyncReducerStatus.Finished)
)

export default downloadActivitySlice.reducer
