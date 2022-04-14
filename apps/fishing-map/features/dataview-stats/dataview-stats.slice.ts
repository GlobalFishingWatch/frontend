import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import { stringify } from 'qs'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { Range } from 'features/timebar/timebar.slice'
import { RootState } from 'store'
import { AsyncReducerStatus } from 'utils/async-slice'

export type StatField = 'flag' | 'vessel_id' | 'geartype'

export type StatFields = {
  [key in StatField]: number
}

export type DataviewStats = {
  [key: string]: StatFields
}

export type DataviewStatsState = {
  status: AsyncReducerStatus
  dataviews: DataviewStats
}

const initialState: DataviewStatsState = {
  status: AsyncReducerStatus.Idle,
  dataviews: {},
}

export type FetchDataviewStatsParams = {
  timerange: Range
  dataviews: UrlDataviewInstance[]
  fields?: StatField[]
}

export const fetchDataviewStats = createAsyncThunk(
  'dataviewStats/fetch',
  async (
    { dataviews, timerange, fields = ['vessel_id', 'flag'] }: FetchDataviewStatsParams,
    { signal }
  ) => {
    const statsParams = {
      datasets: dataviews.map((d) => d.config?.datasets?.join(',') || []),
      filters: dataviews.map((d) => d.config?.filter || []),
      'date-range': [timerange.start, timerange.end].join(','),
    }
    const apiStats = await GFWAPI.fetch<StatFields[]>(
      `/proto/4wings/stats?fields=${fields.join(',')}&${stringify(statsParams, {
        arrayFormat: 'indices',
      })}`,
      { signal }
    )
    const stats = apiStats.reduce((acc, next, index) => {
      return { ...acc, [dataviews[index].id]: next }
    }, {} as DataviewStats)
    return stats
  }
)

const dataviewStats = createSlice({
  name: 'dataviewStats',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchDataviewStats.pending, (state, action) => {
      state.status = AsyncReducerStatus.Loading
    })
    builder.addCase(fetchDataviewStats.fulfilled, (state, action) => {
      state.status = AsyncReducerStatus.Finished
      state.dataviews = action.payload
    })
    builder.addCase(fetchDataviewStats.rejected, (state, action) => {
      if (action.error.message === 'Aborted') {
        state.status = AsyncReducerStatus.Idle
      } else {
        state.status = AsyncReducerStatus.Error
      }
    })
  },
})

export const selectDataviewStatsStatus = (state: RootState) => state.dataviewStats.status
export const selectDataviewStats = (state: RootState) => state.dataviewStats.dataviews
export const selectDataviewStatsById = (id: string) => {
  return createSelector([selectDataviewStats], (dataviews) => {
    return dataviews[id]
  })
}

export default dataviewStats.reducer
