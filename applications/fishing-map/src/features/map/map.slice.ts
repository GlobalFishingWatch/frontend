import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from 'store'
import { AsyncReducerStatus } from 'types'
import { InteractionEvent, ExtendedFeatureVessel } from '@globalfishingwatch/react-hooks'
import GFWAPI from '@globalfishingwatch/api-client'
import {
  DataviewDatasetConfig,
  Dataset,
  resolveEndpoint,
} from '@globalfishingwatch/dataviews-client'

type MapState = {
  clicked: InteractionEvent | null
  hovered: InteractionEvent | null
  status: AsyncReducerStatus
}

const initialState: MapState = {
  clicked: null,
  hovered: null,
  status: AsyncReducerStatus.Idle,
}

type Fetch4WingInteractionThunk = {
  dataset: Dataset
  datasetConfig: DataviewDatasetConfig & { generatorId: string }
}
export const fetch4WingInteractionThunk = createAsyncThunk(
  'map/fetchInteraction',
  async ({ dataset, datasetConfig }: Fetch4WingInteractionThunk) => {
    const url = resolveEndpoint(dataset, datasetConfig)
    const datasetId = datasetConfig.query?.find((query) => query.id === 'datasets')?.value as any
    if (url) {
      const vesselsByDataset = await GFWAPI.fetch<Record<string, ExtendedFeatureVessel[]>>(url)
      const vesselsForDataset = vesselsByDataset[datasetId]
      return { generatorId: datasetConfig.generatorId, vessels: vesselsForDataset, dataset }
    }
  }
)

const slice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setClickedEvent: (state, action: PayloadAction<InteractionEvent | null>) => {
      if (action.payload === null) {
        state.clicked = null
        return
      }
      state.clicked = { ...action.payload }
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetch4WingInteractionThunk.pending, (state) => {
      state.status = AsyncReducerStatus.Loading
    })
    builder.addCase(fetch4WingInteractionThunk.fulfilled, (state, action) => {
      state.status = AsyncReducerStatus.Finished
      if (!state.clicked || !state.clicked.features) return
      const clickedFeature = state.clicked.features.find(
        (f) => f.generatorId === action.payload?.generatorId
      )
      if (!clickedFeature) return
      if (action.payload) {
        clickedFeature.vessels = action.payload.vessels
        console.log(action.payload.dataset)
        clickedFeature.dataset = action.payload.dataset
      }
    })
    builder.addCase(fetch4WingInteractionThunk.rejected, (state) => {
      state.status = AsyncReducerStatus.Error
    })
  },
})

export const selectClickedEvent = (state: RootState) => state.map.clicked
export const selectClickedEventStatus = (state: RootState) => state.map.status

export const { setClickedEvent } = slice.actions
export default slice.reducer
