import { createAsyncThunk, createSelector, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'store'
import GFWAPI from '@globalfishingwatch/api-client'
import { Dataview } from '@globalfishingwatch/dataviews-client'
import { SelectOption } from '@globalfishingwatch/ui-components/dist/select'
import { AsyncReducer, createAsyncSlice } from 'features/api/api.slice'
import { getUserId } from 'features/user/user.slice'

export const fetchDataviewsThunk = createAsyncThunk('dataviews/fetch', async () => {
  const data = await GFWAPI.fetch<Dataview[]>('/v1/datavews')
  return data
})

export type DataviewDraft = {
  source?: SelectOption
  dataset?: SelectOption
}

export interface DataviewsState extends AsyncReducer<Dataview> {
  draft: DataviewDraft
}

const { slice: dataviewsSlice, entityAdapter } = createAsyncSlice<DataviewsState, Dataview>({
  name: 'dataviews',
  reducers: {
    setDraftDataview: (state, action: PayloadAction<DataviewDraft>) => {
      state.draft = { ...state.draft, ...action.payload }
    },
  },
  thunks: { fetchThunk: fetchDataviewsThunk },
})

export const { setDraftDataview } = dataviewsSlice.actions

export const { selectAll, selectById } = entityAdapter.getSelectors<RootState>(
  (state) => state.dataviews
)

export const selectDraftDataview = (state: RootState) => state.dataviews.draft

export const selectDrafDataviewSource = createSelector(
  [selectDraftDataview],
  (draftDataview) => draftDataview?.source
)

export const selectDrafDataviewDataset = createSelector(
  [selectDraftDataview],
  (draftDataview) => draftDataview?.dataset
)

export const selectShared = createSelector([selectAll, getUserId], (workspaces, userId) =>
  // TODO: make this real when editors in workspaces API
  workspaces.filter((w: any) => w.editors?.includes(userId))
)

export default dataviewsSlice.reducer
