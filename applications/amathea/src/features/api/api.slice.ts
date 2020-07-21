import {
  createSlice,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
  ActionReducerMapBuilder,
  createEntityAdapter,
  Dictionary,
} from '@reduxjs/toolkit'

export type AsyncReducerStatus = 'idle' | 'loading' | 'finished' | 'error'
export type AsyncReducer<T> = {
  ids: (number | string)[]
  entities: Dictionary<T>
  error: string
  status: AsyncReducerStatus
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createAsyncSlice = <T, U>({
  name = '',
  initialState = {} as T,
  reducers,
  extraReducers,
  thunk,
}: {
  name: string
  initialState?: T
  reducers: ValidateSliceCaseReducers<T, SliceCaseReducers<T>>
  extraReducers?: (builder: ActionReducerMapBuilder<T>) => void
  thunk: any
}) => {
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
      builder.addCase(thunk.pending, (state: any) => {
        state.status = 'loading'
      })
      builder.addCase(thunk.fulfilled, (state: any, action) => {
        state.status = 'finished'
        entityAdapter.setAll(state, action.payload)
      })
      builder.addCase(thunk.rejected, (state: any) => {
        state.status = 'error'
      })
      if (extraReducers) {
        extraReducers(builder)
      }
    },
  })
  return { entityAdapter, slice }
}
