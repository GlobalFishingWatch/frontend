import { createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import GFWAPI from '@globalfishingwatch/api-client'
import { Dataset } from '@globalfishingwatch/dataviews-client'
import { RootState } from 'store'
import { AsyncReducer, createAsyncSlice } from 'features/api/api.slice'
import { getUserId } from 'features/user/user.slice'

export const fetchDatasetsThunk = createAsyncThunk('datasets/fetch', async () => {
  const data = await GFWAPI.fetch<Dataset[]>('/datasets')
  return data
})

// export const createDatasetThunk = createAsyncThunk(
//   'datasets/create',
//   async (datasetData: Partial<Dataset>, { rejectWithValue }) => {
//     try {
//       const dataset = await GFWAPI.fetch<Dataset>(`/datasets`, {
//         method: 'POST',
//         body: datasetData as Body,
//       })
//       return { dataset }
//     } catch (e) {
//       return rejectWithValue(datasetData.label)
//     }
//   }
// )

export type DatasetsState = AsyncReducer<Dataset>

const { slice: datasetsSlice, entityAdapter } = createAsyncSlice<DatasetsState, Dataset>({
  name: 'datasets',
  reducers: {},
  // extraReducers: (builder) => {
  // builder.addCase(createDatasetThunk.fulfilled, (state, action) => {
  //   entityAdapter.addOne(state, action.payload.dataset)
  // })
  // builder.addCase(createDatasetThunk.rejected, (state, action) => {
  //   state.error = `Error adding dataset ${action.payload}`
  // })
  // },
  thunk: fetchDatasetsThunk,
})

export const { selectAll, selectById } = entityAdapter.getSelectors<RootState>(
  (state) => state.datasets
)

export const selectShared = createSelector([selectAll, getUserId], (workspaces, userId) =>
  // TODO: make this real when editors in workspaces API
  workspaces.filter((w: any) => w.editors?.includes(userId))
)

export default datasetsSlice.reducer
