import { createAsyncThunk, createSelector, PayloadAction } from '@reduxjs/toolkit'
import { uniqBy, memoize } from 'lodash'
import { Dataview } from '@globalfishingwatch/api-types'
import GFWAPI from '@globalfishingwatch/api-client'
import { AsyncReducer, createAsyncSlice } from 'utils/async-slice'
import { RootState } from 'store'

export const fetchDataviewByIdThunk = createAsyncThunk(
  'dataviews/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const dataview = await GFWAPI.fetch<Dataview>(`/v1/dataviews/${id}`)
      return dataview
    } catch (e) {
      return rejectWithValue({ status: e.status || e.code, message: `${id} - ${e.message}` })
    }
  }
)

export const fetchDataviewsByIdsThunk = createAsyncThunk(
  'dataviews/fetch',
  async (ids: number[], { signal, rejectWithValue, getState }) => {
    const existingIds = selectIds(getState() as RootState) as number[]
    const uniqIds = ids.filter((id) => !existingIds.includes(id))
    try {
      let dataviews = await GFWAPI.fetch<Dataview[]>(`/v1/dataviews?ids=${uniqIds.join(',')}`, {
        signal,
      })
      if (
        process.env.NODE_ENV === 'development' ||
        process.env.REACT_APP_USE_LOCAL_DATAVIEWS === 'true'
      ) {
        const mockedDataviews = await import('./dataviews.mock')
        dataviews = uniqBy([...mockedDataviews.default, ...dataviews], 'id')
      }
      return dataviews
    } catch (e) {
      return rejectWithValue({ status: e.status || e.code, message: e.message })
    }
  }
)
export type ResourcesState = AsyncReducer<Dataview>

const { slice: dataviewsSlice, entityAdapter } = createAsyncSlice<ResourcesState, Dataview>({
  name: 'dataview',
  thunks: {
    fetchThunk: fetchDataviewsByIdsThunk,
    fetchByIdThunk: fetchDataviewByIdThunk,
  },
  reducers: {
    addDataviewEntity: (state, action: PayloadAction<Dataview>) => {
      entityAdapter.addOne(state, action.payload)
    },
  },
})

export const { addDataviewEntity } = dataviewsSlice.actions
export const {
  selectAll: selectAllDataviews,
  selectById,
  selectIds,
} = entityAdapter.getSelectors<RootState>((state) => state.dataviews)

export const selectDataviewById = memoize((id: number) =>
  createSelector([(state: RootState) => state], (state) => selectById(state, id))
)

export const selectDataviewsStatus = (state: RootState) => state.dataviews.status

export default dataviewsSlice.reducer
