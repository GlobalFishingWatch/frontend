import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { stringify } from 'qs'
import { GFWAPI, parseAPIError } from '@globalfishingwatch/api-client'
import { APIPagination, Dataview } from '@globalfishingwatch/api-types'
import { RootState } from 'store'
import { AsyncError, AsyncReducerStatus } from 'utils/async-slice'
import { APP_NAME, DEFAULT_PAGINATION_PARAMS } from 'data/config'
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
>('editor/fetchAllDataviews', async (_, { rejectWithValue }) => {
  try {
    const dataviewsParams = {
      app: APP_NAME,
      ...DEFAULT_PAGINATION_PARAMS,
    }
    const dataviews = await GFWAPI.fetch<APIPagination<Dataview>>(
      `/dataviews?${stringify(dataviewsParams, { arrayFormat: 'comma' })}`
    )
    const filteredDataviews = dataviews.entries.filter(
      ({ id, category }) =>
        !TEMPLATE_DATAVIEW_IDS.includes(id) && id !== BASEMAP_DATAVIEW_ID && category !== 'vessels'
    )
    return filteredDataviews
  } catch (e: any) {
    console.warn(e)
    return rejectWithValue(parseAPIError(e))
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
