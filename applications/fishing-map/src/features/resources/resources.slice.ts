import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { AsyncReducerStatus } from 'types'
import { RootState } from 'store'
import { trackValueArrayToSegments, Field } from '@globalfishingwatch/data-transforms'
import GFWAPI from '@globalfishingwatch/api-client'
import { DataviewDatasetConfig, DatasetTypes } from '@globalfishingwatch/dataviews-client'

export interface ResourceQuery {
  url: string
  dataviewId: number
  datasetConfig: DataviewDatasetConfig
  datasetType: DatasetTypes
}

export interface Resource extends ResourceQuery {
  data: unknown
}

interface ResourcesState {
  status: AsyncReducerStatus
  resources: Record<string, Resource>
}

const initialState: ResourcesState = {
  status: AsyncReducerStatus.Idle,
  resources: {},
}

export const fetchResourceThunk = createAsyncThunk(
  'resources/fetch',
  async (resource: ResourceQuery) => {
    const data = await GFWAPI.fetch(resource.url).then((data) => {
      // TODO Replace with enum?
      if (resource.datasetType === 'carriers-tracks:v1') {
        const fields = (resource.datasetConfig.query?.find((q) => q.id === 'fields')
          ?.value as string).split(',') as Field[]
        const segments = trackValueArrayToSegments(data as any, fields)
        return segments
      }
      return data
    })
    return {
      ...resource,
      data,
    }
  }
)

const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchResourceThunk.pending, (state) => {
      state.status = AsyncReducerStatus.Loading
    })
    builder.addCase(fetchResourceThunk.fulfilled, (state, action) => {
      state.status = AsyncReducerStatus.Finished
      state.resources[action.payload.url] = action.payload
    })
    builder.addCase(fetchResourceThunk.rejected, (state) => {
      state.status = AsyncReducerStatus.Error
    })
  },
})

export const selectResources = (state: RootState) => state.resources.resources

export default resourcesSlice.reducer
