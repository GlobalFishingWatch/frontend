import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'
import { stringify } from 'qs'
import { saveAs } from 'file-saver'
import { DownloadActivity } from '@globalfishingwatch/api-types'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { RootState } from 'store'
import { selectVersion } from 'routes/routes.selectors'
import { AsyncError, AsyncReducerStatus } from 'utils/async-slice'
import { DateRange } from 'features/download/downloadActivity.slice'
import { Format } from './downloadTrack.config'

type VesselParams = {
  name: string
  id: string
  datasets: string
}

export interface DownloadTrackState {
  name: string
  id: string
  datasets: string
  status: AsyncReducerStatus
}

const initialState: DownloadTrackState = {
  name: '',
  id: '',
  datasets: '',
  status: AsyncReducerStatus.Idle,
}

export type DownloadTrackParams = {
  vesselId: string
  vesselName: string
  dateRange: DateRange
  datasets: string
  format: Format | 'lines'
}

export const downloadTrackThunk = createAsyncThunk<
  DownloadActivity,
  DownloadTrackParams,
  {
    rejectValue: AsyncError
  }
>('downloadTrack/create', async (params: DownloadTrackParams, { getState, rejectWithValue }) => {
  const state = getState() as RootState
  const version = selectVersion(state)
  try {
    const { dateRange, datasets, format, vesselId, vesselName } = params
    const fromDate = DateTime.fromISO(dateRange.start).toUTC().toString()
    const toDate = DateTime.fromISO(dateRange.end).toUTC().toString()

    const downloadTrackParams = {
      startDate: fromDate,
      endDate: toDate,
      datasets,
      format: format === Format.GeoJson ? 'lines' : format,
      fields: 'lonlat,timestamp,speed,course',
    }

    const fileName = `${vesselName || vesselId} - ${downloadTrackParams.startDate},${
      downloadTrackParams.endDate
    }.${format}`

    const createdDownload: any = await GFWAPI.fetch<DownloadActivity>(
      `/${version}/vessels/${vesselId}/tracks?${stringify(downloadTrackParams)}`,
      {
        method: 'GET',
        responseType: 'blob',
      }
    ).then((blob) => {
      saveAs(blob as any, fileName)
    })
    return createdDownload
  } catch (e: any) {
    return rejectWithValue({ status: e.status || e.code, message: e.message })
  }
})

const downloadTrackSlice = createSlice({
  name: 'downloadTrack',
  initialState,
  reducers: {
    resetDownloadTrackStatus: (state) => {
      state.status = AsyncReducerStatus.Idle
    },
    clearDownloadTrackVessel: (state) => {
      state.id = ''
      state.name = ''
      state.datasets = ''
      state.status = AsyncReducerStatus.Idle
    },
    setDownloadTrackVessel: (state, action: PayloadAction<VesselParams>) => {
      state.id = action.payload.id
      state.name = action.payload.name
      state.datasets = action.payload.datasets
    },
  },
  extraReducers: (builder) => {
    builder.addCase(downloadTrackThunk.pending, (state) => {
      state.status = AsyncReducerStatus.Loading
    })
    builder.addCase(downloadTrackThunk.fulfilled, (state) => {
      state.status = AsyncReducerStatus.Finished
    })
    builder.addCase(downloadTrackThunk.rejected, (state, action) => {
      if (action.error.message === 'Aborted') {
        state.status = AsyncReducerStatus.Aborted
      } else {
        state.status = AsyncReducerStatus.Error
      }
    })
  },
})

export const { resetDownloadTrackStatus, clearDownloadTrackVessel, setDownloadTrackVessel } =
  downloadTrackSlice.actions

export const selectDownloadTrackId = (state: RootState) => state.downloadTrack.id
export const selectDownloadTrackName = (state: RootState) => state.downloadTrack.name
export const selectDownloadTrackDataset = (state: RootState) => state.downloadTrack.datasets
export const selectDownloadTrackStatus = (state: RootState) => state.downloadTrack.status

export default downloadTrackSlice.reducer
