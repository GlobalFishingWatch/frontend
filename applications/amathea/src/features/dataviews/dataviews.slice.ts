import { createAsyncThunk, createSelector, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'store'
import GFWAPI from '@globalfishingwatch/api-client'
import { Dataview, DataviewCreation } from '@globalfishingwatch/dataviews-client'
import { SelectOption } from '@globalfishingwatch/ui-components/dist/select'
import { AsyncReducer, createAsyncSlice } from 'features/api/api.slice'
import { getUserId } from 'features/user/user.slice'

export const fetchDataviewsThunk = createAsyncThunk('dataviews/fetch', async () => {
  const data = await GFWAPI.fetch<Dataview[]>('/v1/dataviews?include=dataset')
  return data
})

export const createDataviewThunk = createAsyncThunk(
  'dataviews/create',
  async (draftDataview: DataviewDraft) => {
    const { dataset, color } = draftDataview
    const dataview: DataviewCreation = {
      name: dataset.label,
      description: dataset.description,
      datasets: [dataset.id as string],
      defaultView: {
        type: dataset.type === 'user-context-layer:v1' ? 'gl' : 'TRACK',
        color,
      },
    }
    const createdDataview = await GFWAPI.fetch<Dataview>('/v1/dataviews', {
      method: 'POST',
      body: dataview as any,
    })
    return createdDataview
  },
  {
    condition: (draftDataview) => {
      if (!draftDataview || !draftDataview.dataset) return false
    },
  }
)

export const updateDataviewThunk = createAsyncThunk(
  'dataviews/update',
  async (draftDataview: DataviewDraft) => {
    const updatedDataview = await GFWAPI.fetch<Dataview>(`/v1/dataviews/${draftDataview.id}`, {
      method: 'PATCH',
      body: draftDataview as any,
    })
    return updatedDataview
  },
  {
    condition: (draftDataview) => {
      if (!draftDataview || !draftDataview.id) return false
    },
  }
)

export const deleteDataviewThunk = createAsyncThunk(
  'dataviews/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      const dataview = await GFWAPI.fetch<Dataview>(`/v1/dataviews/${id}`, {
        method: 'DELETE',
      })
      return { ...dataview, id }
    } catch (e) {
      return rejectWithValue(id)
    }
  }
)

export type DataviewDraftDataset = SelectOption & { type: string; description: string }

export type DataviewDraft = {
  id?: number // used when needs update
  source?: SelectOption
  dataset: DataviewDraftDataset
  color?: string
}

export interface DataviewsState extends AsyncReducer<Dataview> {
  draft?: DataviewDraft
}

const { slice: dataviewsSlice, entityAdapter } = createAsyncSlice<DataviewsState, Dataview>({
  name: 'dataviews',
  reducers: {
    setDraftDataview: (state, action: PayloadAction<DataviewDraft>) => {
      state.draft = { ...state.draft, ...action.payload }
    },
    resetDraftDataview: (state, action: PayloadAction<undefined>) => {
      state.draft = action.payload
    },
  },
  thunks: {
    fetchThunk: fetchDataviewsThunk,
    createThunk: createDataviewThunk,
    updateThunk: updateDataviewThunk,
    deleteThunk: deleteDataviewThunk,
  },
})

export const { setDraftDataview, resetDraftDataview } = dataviewsSlice.actions

export const {
  selectAll: selectAllDataviews,
  selectById: selectDataviewById,
} = entityAdapter.getSelectors<RootState>((state) => state.dataviews)

export const selectDraftDataview = (state: RootState) => state.dataviews.draft
export const selectDataviewStatus = (state: RootState) => state.dataviews.status
export const selectDataviewStatusId = (state: RootState) => state.dataviews.statusId

export const selectDrafDataviewSource = createSelector(
  [selectDraftDataview],
  (draftDataview) => draftDataview?.source
)

export const selectDrafDataviewDataset = createSelector(
  [selectDraftDataview],
  (draftDataview) => draftDataview?.dataset
)

export const selectDrafDataviewColor = createSelector(
  [selectDraftDataview],
  (draftDataview) => draftDataview?.dataset
)

export const selectShared = createSelector([selectAllDataviews, getUserId], (workspaces, userId) =>
  // TODO: make this real when editors in workspaces API
  workspaces.filter((w: any) => w.editors?.includes(userId))
)

export default dataviewsSlice.reducer
