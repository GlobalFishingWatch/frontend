import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'
import { Geometry } from 'geojson'
import { stringify } from 'qs'
import { saveAs } from 'file-saver'
import { DownloadActivity } from '@globalfishingwatch/api-types'
import GFWAPI from '@globalfishingwatch/api-client'
import { TooltipEventFeature } from 'features/map/map.hooks'
import { RootState } from 'store'
import { AsyncError, AsyncReducerStatus } from 'utils/async-slice'
import { transformFilters } from 'features/analysis/analysis.utils'
import { DateRange } from 'features/analysis/analysis.slice'
import { Format, GroupBy, SpatialResolution, TemporalResolution } from './download.config'

export interface DownloadState {
  geometry: Geometry | undefined
  name: string
  id: string
  status: AsyncReducerStatus
}

const initialState: DownloadState = {
  geometry: undefined,
  name: '',
  id: '',
  status: AsyncReducerStatus.Idle,
}

export type DownloadActivityParams = {
  dateRange: DateRange
  dataviews: {
    filters: Record<string, any>
    datasets: string[]
  }[]
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
>('download/create', async (params: DownloadActivityParams, { rejectWithValue }) => {
  try {
    const {
      dateRange,
      dataviews,
      geometry,
      areaName,
      format,
      spatialResolution,
      temporalResolution,
      groupBy,
    } = params
    const fromDate = DateTime.fromISO(dateRange.start).toUTC().toISODate()
    const toDate = DateTime.fromISO(dateRange.end).toUTC().toISODate()

    const downloadParams = {
      datasets: dataviews.map(({ datasets }) => datasets.join(',')),
      filters: dataviews.map(({ filters }) => transformFilters(filters)),
      'date-range': [fromDate, toDate].join(','),
      format,
      spatialResolution,
      temporalResolution,
      groupBy,
    }

    const fileName = `${areaName} - ${downloadParams['date-range']}.zip`

    const createdDownload: any = await GFWAPI.fetch<DownloadActivity>(
      `/v1/4wings/report?${stringify(downloadParams, { arrayFormat: 'indices' })}`,
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

const downloadSlice = createSlice({
  name: 'download',
  initialState,
  reducers: {
    resetDownloadStatus: (state) => {
      state.status = AsyncReducerStatus.Idle
    },
    clearDownloadGeometry: (state) => {
      state.geometry = undefined
      state.name = ''
      state.status = AsyncReducerStatus.Idle
    },
    setDownloadGeometry: (state, action: PayloadAction<TooltipEventFeature>) => {
      state.geometry = action.payload.geometry as Geometry
      state.name = action.payload.value
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
      if (action.error.message === 'Aborted') {
        state.status = AsyncReducerStatus.Aborted
      } else {
        state.status = AsyncReducerStatus.Error
      }
    })
  },
})

export const { resetDownloadStatus, clearDownloadGeometry, setDownloadGeometry } =
  downloadSlice.actions

export const selectDownloadGeometry = (state: RootState) => state.download.geometry
export const selectDownloadAreaName = (state: RootState) => state.download.name
export const selectDownloadAreaId = (state: RootState) => state.download.id
export const selectDownloadStatus = (state: RootState) => state.download.status

export default downloadSlice.reducer
