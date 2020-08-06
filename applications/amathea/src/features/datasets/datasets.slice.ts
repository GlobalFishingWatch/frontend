import { createAsyncThunk, createSelector, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'store'
import GFWAPI, { UploadResponse } from '@globalfishingwatch/api-client'
import { Dataset } from '@globalfishingwatch/dataviews-client'
import { AsyncReducer, createAsyncSlice, asyncInitialState } from 'features/api/api.slice'

export const fetchDatasetsThunk = createAsyncThunk('datasets/fetch', async () => {
  const data = await GFWAPI.fetch<Dataset[]>('/v1/datasets?cache=false')
  return data
})

export const createDatasetThunk = createAsyncThunk(
  'datasets/uploadFile',
  async ({ dataset, file }: { dataset: Partial<Dataset>; file: File }) => {
    const { url, path } = await GFWAPI.fetch<UploadResponse>('/v1/upload')
    try {
      await fetch(url, { method: 'PUT', body: file })
      const datasetWithFilePath = {
        ...dataset,
        configuration: {
          filePath: path,
        },
      }
      const createdDataset = await GFWAPI.fetch<Dataset>('/v1/datasets', {
        method: 'POST',
        body: datasetWithFilePath as any,
      })
      return createdDataset
    } catch (e) {
      console.error(e.message)
    }
  }
)

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

export type DatasetTypes = 'context_areas' | 'track' | '4wings' | undefined
export type DatasetDraftSteps = 'info' | 'data' | 'parameters'
export type DatasetDraftData = Partial<Dataset> & { type?: DatasetTypes }

export type DatasetDraft = {
  step: DatasetDraftSteps
  data: DatasetDraftData
}

export interface DatasetsState extends AsyncReducer<Dataset> {
  draft: DatasetDraft
}

const draftInitialState: DatasetDraft = { step: 'info', data: {} }
const initialState: DatasetsState = {
  ...asyncInitialState,
  draft: draftInitialState,
}

const { slice: datasetsSlice, entityAdapter } = createAsyncSlice<DatasetsState, Dataset>({
  name: 'datasets',
  initialState,
  reducers: {
    resetDraftDataset: (state) => {
      state.draft = draftInitialState
    },
    setDraftDatasetStep: (state, action: PayloadAction<DatasetDraftSteps>) => {
      state.draft.step = action.payload
    },
    setDraftDatasetData: (state, action: PayloadAction<DatasetDraftData>) => {
      state.draft.data = { ...state.draft.data, ...action.payload }
    },
  },
  // extraReducers: (builder) => {
  // builder.addCase(createDatasetThunk.fulfilled, (state, action) => {
  //   entityAdapter.addOne(state, action.payload.dataset)
  // })
  // builder.addCase(createDatasetThunk.rejected, (state, action) => {
  //   state.error = `Error adding dataset ${action.payload}`
  // })
  // },
  thunks: { fetchThunk: fetchDatasetsThunk },
})

export const { resetDraftDataset, setDraftDatasetStep, setDraftDatasetData } = datasetsSlice.actions

export const { selectAll, selectById } = entityAdapter.getSelectors<RootState>(
  (state) => state.datasets
)

export const selectDraftDataset = (state: RootState) => state.datasets.draft

export const selectDraftDatasetStep = createSelector([selectDraftDataset], ({ step }) => step)
export const selectDraftDatasetData = createSelector([selectDraftDataset], ({ data }) => data)

export default datasetsSlice.reducer
