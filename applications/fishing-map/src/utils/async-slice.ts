import {
  createSlice,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
  ActionReducerMapBuilder,
  createEntityAdapter,
  Dictionary,
} from '@reduxjs/toolkit'

export enum AsyncReducerStatus {
  Idle = 'idle',
  Aborted = 'aborted',
  Loading = 'loading',
  LoadingItem = 'loading.item',
  LoadingCreate = 'loading.create',
  LoadingUpdate = 'loading.update',
  LoadingDelete = 'loading.delete',
  Finished = 'finished',
  Error = 'error',
}

export type AsyncError = {
  status?: number // HHTP error codes
  message?: string
}

export type AsyncReducer<T = any> = {
  ids: (number | string)[]
  entities: Dictionary<T>
  error: AsyncError
  status: AsyncReducerStatus
  currentRequestIds: string[]
  statusId: number | string | null
}

export const asyncInitialState: AsyncReducer = {
  status: AsyncReducerStatus.Idle,
  statusId: null,
  error: {},
  ids: [],
  currentRequestIds: [],
  entities: {},
}

const getRequestIdsOnStart = (currentRequestIds: string[], action: any) => {
  const currentRequests = currentRequestIds || []
  return action.meta?.requestId ? [...currentRequests, action.meta?.requestId] : currentRequests
}
const getRequestIdsOnFinish = (currentRequestIds: string[], action: any) => {
  return currentRequestIds.filter((id: string) => id !== action.meta?.requestId)
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
    createThunk?: any
    updateThunk?: any
    deleteThunk?: any
  }
}) => {
  const { fetchThunk, fetchByIdThunk, createThunk, updateThunk, deleteThunk } = thunks
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
        builder.addCase(fetchThunk.pending, (state: any, action) => {
          state.status = AsyncReducerStatus.Loading
          state.currentRequestIds = getRequestIdsOnStart(state.currentRequestIds, action)
        })
        builder.addCase(fetchThunk.fulfilled, (state: any, action) => {
          state.currentRequestIds = getRequestIdsOnFinish(state.currentRequestIds, action)
          if (state.currentRequestIds.length === 0) {
            state.status = AsyncReducerStatus.Finished
          }
          entityAdapter.upsertMany(state, action.payload)
        })
        builder.addCase(fetchThunk.rejected, (state: any, action) => {
          state.currentRequestIds = getRequestIdsOnFinish(state.currentRequestIds, action)
          if (state.currentRequestIds.length === 0) {
            state.status = AsyncReducerStatus.Error
          }
          state.error = action.payload
        })
      }
      if (fetchByIdThunk) {
        builder.addCase(fetchByIdThunk.pending, (state: any, action) => {
          state.status = AsyncReducerStatus.LoadingItem
          state.currentRequestIds = getRequestIdsOnStart(state.currentRequestIds, action)
          state.statusId = action.meta.arg
        })
        builder.addCase(fetchByIdThunk.fulfilled, (state: any, action) => {
          state.currentRequestIds = getRequestIdsOnFinish(state.currentRequestIds, action)
          if (state.currentRequestIds.length === 0) {
            state.status = AsyncReducerStatus.Finished
          }
          state.statusId = null
          entityAdapter.upsertOne(state, action.payload)
        })
        builder.addCase(fetchByIdThunk.rejected, (state: any, action) => {
          state.currentRequestIds = getRequestIdsOnFinish(state.currentRequestIds, action)
          if (state.currentRequestIds.length === 0) {
            state.status = AsyncReducerStatus.Error
          }
          state.statusId = null
          state.error = action.payload
        })
      }

      if (createThunk) {
        builder.addCase(createThunk.pending, (state: any, action) => {
          state.status = AsyncReducerStatus.LoadingCreate
          state.currentRequestIds = getRequestIdsOnStart(state.currentRequestIds, action)
        })
        builder.addCase(createThunk.fulfilled, (state: any, action) => {
          state.currentRequestIds = getRequestIdsOnFinish(state.currentRequestIds, action)
          if (state.currentRequestIds.length === 0) {
            state.status = AsyncReducerStatus.Finished
          }
          entityAdapter.upsertOne(state, action.payload)
        })
        builder.addCase(createThunk.rejected, (state: any, action) => {
          state.currentRequestIds = getRequestIdsOnFinish(state.currentRequestIds, action)
          if (state.currentRequestIds.length === 0) {
            state.status = AsyncReducerStatus.Error
          }
          state.error = action.payload
        })
      }
      if (updateThunk) {
        builder.addCase(updateThunk.pending, (state: any, action) => {
          state.status = AsyncReducerStatus.LoadingUpdate
          state.currentRequestIds = getRequestIdsOnStart(state.currentRequestIds, action)
          state.statusId = action.meta.arg.id
        })
        builder.addCase(updateThunk.fulfilled, (state: any, action) => {
          state.currentRequestIds = getRequestIdsOnFinish(state.currentRequestIds, action)
          if (state.currentRequestIds.length === 0) {
            state.status = AsyncReducerStatus.Finished
          }
          state.statusId = null
          entityAdapter.upsertOne(state, action.payload)
        })
        builder.addCase(updateThunk.rejected, (state: any, action) => {
          state.currentRequestIds = getRequestIdsOnFinish(state.currentRequestIds, action)
          if (state.currentRequestIds.length === 0) {
            state.status = AsyncReducerStatus.Error
          }
          state.statusId = null
          state.error = action.payload
        })
      }
      if (deleteThunk) {
        builder.addCase(deleteThunk.pending, (state: any, action) => {
          state.status = AsyncReducerStatus.LoadingDelete
          state.currentRequestIds = getRequestIdsOnStart(state.currentRequestIds, action)
          state.statusId = action.meta.arg
        })
        builder.addCase(deleteThunk.fulfilled, (state: any, action) => {
          state.currentRequestIds = getRequestIdsOnFinish(state.currentRequestIds, action)
          if (state.currentRequestIds.length === 0) {
            state.status = AsyncReducerStatus.Finished
          }
          state.statusId = null
          entityAdapter.removeOne(state, action.payload.id)
        })
        builder.addCase(deleteThunk.rejected, (state: any, action) => {
          state.currentRequestIds = getRequestIdsOnFinish(state.currentRequestIds, action)
          if (state.currentRequestIds.length === 0) {
            state.status = AsyncReducerStatus.Error
          }
          state.statusId = null
          state.error = action.payload
        })
      }
    },
  })
  return { entityAdapter, slice }
}
