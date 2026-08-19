import type { WithSlice } from '@reduxjs/toolkit'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { castDraft } from 'immer'
import { stringify } from 'qs'

import { GFWAPI, parseAPIError } from '@globalfishingwatch/api-client'
import type { APIPagination, Dataview } from '@globalfishingwatch/api-types'
import { BASEMAP_DATAVIEW_SLUG } from '@platform/config/map/dataviews'

import { APP_NAME, DEFAULT_PAGINATION_PARAMS } from 'data/map/config'
import { TEMPLATE_DATAVIEW_SLUGS } from 'data/map/dataviews'
import { rootReducer } from 'reducers'
import type { AsyncError } from 'utils/async-slice'
import { AsyncReducerStatus } from 'utils/async-slice'

interface EditorState {
  dataviews: {
    status: AsyncReducerStatus
    data: Dataview[] | undefined
  }
}

const initialState: EditorState = {
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
      ({ slug, category }) =>
        !TEMPLATE_DATAVIEW_SLUGS.includes(slug as any) &&
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
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchEditorDataviewsThunk.pending, (state) => {
      state.dataviews.status = AsyncReducerStatus.Loading
    })
    builder.addCase(fetchEditorDataviewsThunk.fulfilled, (state, action) => {
      state.dataviews.status = AsyncReducerStatus.Finished
      if (action.payload) {
        state.dataviews.data = castDraft(action.payload)
      }
    })
    builder.addCase(fetchEditorDataviewsThunk.rejected, (state) => {
      state.dataviews.status = AsyncReducerStatus.Error
    })
  },
})

const injectedEditorSlice = rootReducer.inject(editorSlice)

declare module 'reducers' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface LazyLoadedSlices extends WithSlice<typeof editorSlice> {}
}

export const selectEditorDataviewsStatus = injectedEditorSlice.selector(
  (state) => state.editor.dataviews.status
)
export const selectEditorDataviews = injectedEditorSlice.selector(
  (state) => state.editor.dataviews.data
)

export default editorSlice.reducer
