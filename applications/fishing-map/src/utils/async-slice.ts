import {
  createSlice,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
  ActionReducerMapBuilder,
  createEntityAdapter,
  Dictionary,
} from '@reduxjs/toolkit'
import { AsyncReducerStatus } from 'types'

export type AsyncError = {
  status?: number // HHTP error codes
  message?: string
}

export type AsyncReducer<T = any> = {
  ids: (number | string)[]
  entities: Dictionary<T>
  error: AsyncError
  status: AsyncReducerStatus
  statusId: number | string | null
}

export const asyncInitialState: AsyncReducer = {
  status: AsyncReducerStatus.Idle,
  statusId: null,
  error: {},
  ids: [],
  entities: {},
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createAsyncSlice = <T, U>({
  name = '',
  initialState = {} as T,
  reducers = {},
  extraReducers,
  thunks = {},
}: {
  name: string
  initialState?: T
  reducers?: ValidateSliceCaseReducers<T, SliceCaseReducers<T>>
  extraReducers?: (builder: ActionReducerMapBuilder<T>) => void
  thunks?: {
    fetchThunk?: any
    fetchByIdThunk?: any
  }
}) => {
  const { fetchThunk, fetchByIdThunk } = thunks
  const entityAdapter = createEntityAdapter<U>()
  const slice = createSlice({
    name,
    initialState: entityAdapter.getInitialState({
      status: 'idle',
      error: '',
      ids: [],
      entities: {},
      ...initialState,
    }),
    reducers,
    extraReducers: (builder) => {
      if (extraReducers) {
        extraReducers(builder)
      }
      if (fetchThunk) {
        builder.addCase(fetchThunk.pending, (state: any) => {
          state.status = AsyncReducerStatus.Loading
        })
        builder.addCase(fetchThunk.fulfilled, (state: any, action) => {
          state.status = AsyncReducerStatus.Finished
          entityAdapter.upsertMany(state, action.payload)
        })
        builder.addCase(fetchThunk.rejected, (state: any, action) => {
          state.status = AsyncReducerStatus.Error
          state.error = action.payload
        })
      }
      if (fetchByIdThunk) {
        builder.addCase(fetchByIdThunk.pending, (state: any, action) => {
          state.status = AsyncReducerStatus.Loading
          state.statusId = action.meta.arg
        })
        builder.addCase(fetchByIdThunk.fulfilled, (state: any, action) => {
          state.status = AsyncReducerStatus.Finished
          state.statusId = null
          entityAdapter.upsertOne(state, action.payload)
        })
        builder.addCase(fetchByIdThunk.rejected, (state: any, action) => {
          state.status = AsyncReducerStatus.Error
          state.statusId = null
          state.error = action.payload
        })
      }
    },
  })
  return { entityAdapter, slice }
}
