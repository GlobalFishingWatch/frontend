import {
  createSlice,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
  ActionReducerMapBuilder,
  createEntityAdapter,
  Dictionary,
} from '@reduxjs/toolkit'

export type AsyncReducerStatus =
  | 'idle'
  | 'loading'
  | 'loading.item'
  | 'loading.create'
  | 'loading.update'
  | 'loading.delete'
  | 'finished'
  | 'error'
export type AsyncReducer<T = any> = {
  ids: (number | string)[]
  entities: Dictionary<T>
  error: string
  status: AsyncReducerStatus
}

export const asyncInitialState: AsyncReducer = {
  status: 'idle',
  error: '',
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
      if (fetchThunk) {
        builder.addCase(fetchThunk.pending, (state: any) => {
          state.status = 'loading'
        })
        builder.addCase(fetchThunk.fulfilled, (state: any, action) => {
          state.status = 'finished'
          entityAdapter.upsertMany(state, action.payload)
        })
        builder.addCase(fetchThunk.rejected, (state: any) => {
          state.status = 'error'
          state.error = 'Error fetching workspaces'
        })
      }
      if (fetchByIdThunk) {
        builder.addCase(fetchByIdThunk.pending, (state: any) => {
          state.status = 'loading.item'
        })
        builder.addCase(fetchByIdThunk.fulfilled, (state: any, action) => {
          state.status = 'finished'
          entityAdapter.upsertOne(state, action.payload)
        })
        builder.addCase(fetchByIdThunk.rejected, (state: any, action) => {
          state.status = 'error'
          state.error = `Error fetching workspace id: ${action.payload}`
        })
      }
      if (createThunk) {
        builder.addCase(createThunk.pending, (state: any) => {
          state.status = 'loading.create'
        })
        builder.addCase(createThunk.fulfilled, (state: any, action) => {
          state.status = 'finished'
          entityAdapter.upsertOne(state, action.payload)
        })
        builder.addCase(createThunk.rejected, (state: any, action) => {
          state.status = 'error'
          state.error = `Error adding resource ${action.payload}`
        })
      }
      if (updateThunk) {
        builder.addCase(updateThunk.pending, (state: any) => {
          state.status = 'loading.update'
        })
        builder.addCase(updateThunk.fulfilled, (state: any, action) => {
          state.status = 'finished'
          entityAdapter.upsertOne(state, action.payload)
        })
        builder.addCase(updateThunk.rejected, (state: any, action) => {
          state.status = 'error'
          state.error = `Error updating resource ${action.payload}`
        })
      }
      if (deleteThunk) {
        builder.addCase(deleteThunk.pending, (state: any) => {
          state.status = 'loading.delete'
        })
        builder.addCase(deleteThunk.fulfilled, (state: any, action) => {
          state.status = 'finished'
          entityAdapter.removeOne(state, action.payload.id)
        })
        builder.addCase(deleteThunk.rejected, (state: any, action) => {
          state.status = 'error'
          state.error = `Error removing resource ${action.payload}`
        })
      }
      if (extraReducers) {
        extraReducers(builder)
      }
    },
  })
  return { entityAdapter, slice }
}
