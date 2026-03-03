import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { kebabCase, uniq, uniqBy } from 'es-toolkit'
import { stringify } from 'qs'

import {
  GFWAPI,
  parseAPIError,
  parseAPIErrorMessage,
  parseAPIErrorStatus,
} from '@globalfishingwatch/api-client'
import type { APIPagination, Dataview } from '@globalfishingwatch/api-types'

import { DEFAULT_PAGINATION_PARAMS, IS_DEVELOPMENT_ENV } from 'data/config'
import type { AsyncError, AsyncReducer } from 'utils/async-slice'
import { createAsyncSlice } from 'utils/async-slice'

export const fetchDataviewByIdThunk = createAsyncThunk(
  'dataviews/fetchById',
  async (id: Dataview['id'] | Dataview['slug'], { rejectWithValue }) => {
    try {
      const dataview = await GFWAPI.fetch<Dataview>(`/dataviews/${id}`)
      return dataview
    } catch (e: any) {
      console.warn(e)
      return rejectWithValue({
        status: parseAPIErrorStatus(e),
        message: `${id} - ${parseAPIErrorMessage(e)}`,
      })
    }
  }
)

const USE_MOCKED_DATAVIEWS =
  IS_DEVELOPMENT_ENV || process.env.NEXT_PUBLIC_USE_LOCAL_DATAVIEWS === 'true'
const mockedDataviewsImported = false
export const fetchDataviewsByIdsThunk = createAsyncThunk(
  'dataviews/fetch',
  async (ids: (Dataview['id'] | Dataview['slug'])[], { signal, rejectWithValue, getState }) => {
    const state = getState() as DataviewsSliceState
    const existingIds = selectIds(state) as (number | string)[]
    const existingRequestedDataviews = ids.flatMap((id) => {
      const dataview = selectById(state, id as number) as Dataview
      return dataview ? [dataview] : []
    })
    if (ids.length === existingRequestedDataviews.length) {
      return uniqBy([...existingRequestedDataviews], (dataview) => dataview.slug || dataview.id)
    }

    const uniqIds = uniq(ids.filter((id) => !existingIds.includes(id)))
    const normalizeDataview = (dataview: Dataview) => ({
      ...dataview,
      slug: dataview.slug || kebabCase(dataview.name),
    })

    let mockedDataviews = [] as Dataview[]
    if (USE_MOCKED_DATAVIEWS && !mockedDataviewsImported) {
      mockedDataviews = await import('./dataviews.mock').then((d) => d.default)
    }

    if (!uniqIds?.length) {
      return uniqBy(
        [...existingRequestedDataviews, ...mockedDataviews].map(normalizeDataview),
        (dataview) => dataview.slug || dataview.id
      )
    }
    try {
      const dataviewsParams = {
        ids: uniqIds,
        cache: false,
        ...DEFAULT_PAGINATION_PARAMS,
      }
      const dataviewsResponse = await GFWAPI.fetch<APIPagination<Dataview>>(
        `/dataviews?${stringify(dataviewsParams, { arrayFormat: 'comma' })}`,
        { signal }
      )
      const dataviews = USE_MOCKED_DATAVIEWS
        ? [...mockedDataviews, ...dataviewsResponse.entries]
        : dataviewsResponse.entries
      return uniqBy(
        [...existingRequestedDataviews, ...dataviews].map(normalizeDataview),
        (dataview) => dataview.slug || dataview.id
      )
    } catch (e: any) {
      console.warn(e)
      return rejectWithValue(parseAPIError(e))
    }
  }
)

export const createDataviewThunk = createAsyncThunk<
  Dataview,
  Partial<Dataview>,
  {
    rejectValue: AsyncError
  }
>('dataviews/create', async (dataview, { rejectWithValue }) => {
  try {
    const createdDataview = await GFWAPI.fetch<Dataview>(`/dataviews`, {
      method: 'POST',
      body: dataview as any,
    })

    return createdDataview
  } catch (e: any) {
    console.warn(e)
    return rejectWithValue(parseAPIError(e))
  }
})

export const updateDataviewThunk = createAsyncThunk<
  Dataview,
  Partial<Dataview>,
  {
    rejectValue: AsyncError
  }
>(
  'dataviews/update',
  async (partialDataview, { rejectWithValue }) => {
    try {
      const dataview = await GFWAPI.fetch<Dataview>(`/dataviews/${partialDataview.id}`, {
        method: 'PATCH',
        body: partialDataview as any,
      })
      return dataview
    } catch (e: any) {
      console.warn(e)
      return rejectWithValue(parseAPIError(e))
    }
  },
  {
    condition: (partialDataset) => {
      if (!partialDataset || !partialDataset.id) {
        console.warn('To update the dataset you need the id')
        return false
      }
    },
  }
)

type DataviewsState = AsyncReducer<Dataview>
type DataviewsSliceState = { dataviews: DataviewsState }

const { slice: dataviewsSlice, entityAdapter } = createAsyncSlice<DataviewsState, Dataview>({
  name: 'dataview',
  thunks: {
    fetchThunk: fetchDataviewsByIdsThunk,
    fetchByIdThunk: fetchDataviewByIdThunk,
    createThunk: createDataviewThunk,
    updateThunk: updateDataviewThunk,
  },
  reducers: {
    addDataviewEntity: (state, action: PayloadAction<Dataview>) => {
      entityAdapter.addOne(state, action.payload)
    },
  },
  selectId: (dataview) => dataview.slug || dataview.id,
})

export const { addDataviewEntity } = dataviewsSlice.actions
export const {
  selectAll: selectAllDataviews,
  selectById,
  selectIds,
} = entityAdapter.getSelectors((state: DataviewsSliceState) => state.dataviews)

export function selectDataviewBySlug(slug: string) {
  return createSelector([selectAllDataviews], (dataviews) => {
    return dataviews?.find((d) => d.slug === slug)
  })
}

export default dataviewsSlice.reducer
