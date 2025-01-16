import { createAsyncThunk,createSlice } from '@reduxjs/toolkit'
import { stringify } from 'qs'
import type { RootState } from 'reducers'

import { GFWAPI, parseAPIError } from '@globalfishingwatch/api-client'
import type { APIPagination, Dataview } from '@globalfishingwatch/api-types'

import { APP_NAME, DEFAULT_PAGINATION_PARAMS } from 'data/config'
import { BASEMAP_DATAVIEW_SLUG, TEMPLATE_DATAVIEW_SLUGS } from 'data/workspaces'
import type { AsyncError } from 'utils/async-slice'
import { AsyncReducerStatus } from 'utils/async-slice'

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
      ({ id, slug, category }) =>
        !TEMPLATE_DATAVIEW_SLUGS.includes(slug) &&
        slug !== BASEMAP_DATAVIEW_SLUG &&
        category !== 'vessels'
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
