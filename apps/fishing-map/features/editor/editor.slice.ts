import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { Dataview } from '@globalfishingwatch/api-types'
import { RootState } from 'store'
import { selectVersion } from 'routes/routes.selectors'
import { AsyncError, AsyncReducerStatus } from 'utils/async-slice'
import { APP_NAME } from 'data/config'
import { BASEMAP_DATAVIEW_ID, TEMPLATE_DATAVIEW_IDS } from 'data/workspaces'

interface EditorState {
  active: boolean
  dataviews: {
    status: AsyncReducerStatus
    data: Dataview[] | undefined
  }
}

const initialState: EditorState = {
  active: false,
  dataviews: {
    status: AsyncReducerStatus.Idle,
    data: undefined,
  },
}

export const fetchEditorDataviewsThunk = createAsyncThunk<
  Dataview[],
  undefined,
  {
    rejectValue: AsyncError
  }
>('editor/fetchAllDataviews', async (_, { getState, rejectWithValue }) => {
  const state = getState() as RootState
  const version = selectVersion(state)
  try {
    const dataviews = await GFWAPI.fetch<Dataview[]>(`/${version}/dataviews?app=${APP_NAME}`)
    const filteredDataviews = dataviews.filter(
      ({ id, category }) =>
        !TEMPLATE_DATAVIEW_IDS.includes(id) && id !== BASEMAP_DATAVIEW_ID && category !== 'vessels'
    )
    return filteredDataviews
  } catch (e: any) {
    return rejectWithValue({
      status: e.status || e.code,
      message: e.message,
    })
  }
})

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    toggleEditorMenu: (state) => {
      state.active = !state.active
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchEditorDataviewsThunk.pending, (state) => {
      state.dataviews.status = AsyncReducerStatus.Loading
    })
    builder.addCase(fetchEditorDataviewsThunk.fulfilled, (state, action) => {
      state.dataviews.status = AsyncReducerStatus.Finished
      if (action.payload) {
        state.dataviews.data = action.payload
      }
    })
    builder.addCase(fetchEditorDataviewsThunk.rejected, (state) => {
      state.dataviews.status = AsyncReducerStatus.Error
    })
  },
})

export const { toggleEditorMenu } = editorSlice.actions

export const selectEditorActive = (state: RootState) => state.editor.active
export const selectEditorDataviewsStatus = (state: RootState) => state.editor.dataviews.status
export const selectEditorDataviews = (state: RootState) => state.editor.dataviews.data

export default editorSlice.reducer
