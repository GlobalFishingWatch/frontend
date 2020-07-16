import {
  createSlice,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
  CaseReducers,
  ActionReducerMapBuilder,
} from '@reduxjs/toolkit'

export interface AsyncReducer<T> {
  data?: T
  error?: ''
  status?: 'idle' | 'loading' | 'finished' | 'error'
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createAsyncSlice = <T, Reducers extends SliceCaseReducers<T>>({
  name = '',
  initialState = {} as T,
  reducers,
  extraReducers = {},
  thunk,
}: {
  name: string
  initialState?: T
  reducers: ValidateSliceCaseReducers<T, Reducers>
  extraReducers?: CaseReducers<T, any> | ((builder: ActionReducerMapBuilder<T>) => void)
  thunk: any
}) => {
  return createSlice({
    name,
    initialState: { status: 'idle', ...initialState },
    reducers: reducers,
    extraReducers: (builder) => {
      builder.addCase(thunk.pending, (state) => {
        ;(state as AsyncReducer<T>).status = 'loading'
      })
      builder.addCase(thunk.fulfilled, (state, action) => {
        ;(state as AsyncReducer<T>).status = 'finished'
        ;(state as AsyncReducer<T>).data = action.payload
      })
      builder.addCase(thunk.rejected, (state) => {
        ;(state as AsyncReducer<T>).status = 'error'
      })
    },
    ...extraReducers,
  })
}
