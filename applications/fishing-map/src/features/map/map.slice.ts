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
import { MiniglobeBounds } from '@globalfishingwatch/ui-components/dist'
import { VESSELS_DATASET_TYPE } from 'features/workspace/workspace.mock'
import { getRelatedDatasetByType } from 'features/workspace/workspace.selectors'
import { selectDatasetById } from 'features/datasets/datasets.slice'

export const MAX_TOOLTIP_VESSELS = 5

type MapState = {
  clicked: InteractionEvent | null
  hovered: InteractionEvent | null
  status: AsyncReducerStatus
  bounds?: MiniglobeBounds
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
  async (
    { dataset, datasetConfig }: Fetch4WingInteractionThunk,
    { getState, signal, rejectWithValue }
  ) => {
    const url = resolveEndpoint(dataset, datasetConfig)
    const datasetId = datasetConfig.query?.find((query) => query.id === 'datasets')?.value as any
    let vesselsForDataset: ExtendedFeatureVessel[]
    if (url) {
      const vesselsByDataset = await GFWAPI.fetch<Record<string, ExtendedFeatureVessel[]>>(url, {
        signal,
      })
      vesselsForDataset = vesselsByDataset[datasetId]
      const infoDatasetId = getRelatedDatasetByType(dataset, VESSELS_DATASET_TYPE)?.id
      if (infoDatasetId) {
        const infoDataset = selectDatasetById(infoDatasetId)(getState() as RootState)
        if (infoDataset) {
          const infoDatasetConfig = {
            endpoint: 'carriers-multiple-vessel',
            datasetId: infoDataset.id,
            params: [],
            query: [
              { id: 'datasets', value: infoDataset.id },
              {
                id: 'ids',
                value: vesselsForDataset.slice(0, MAX_TOOLTIP_VESSELS).map((v) => v.id),
              },
            ],
          }
          const infoUrl = resolveEndpoint(infoDataset, infoDatasetConfig)
          if (infoUrl) {
            // TODO create search API results response
            const vesselsInfo = await GFWAPI.fetch<any>(infoUrl, { signal })
            const { entries } = vesselsInfo?.[0]?.results
            if (entries) {
              vesselsForDataset = vesselsForDataset.map((vessel) => {
                // TODO use vessel API response here
                const vesselInfo = entries.find((entry: any) => entry.id === vessel.id)
                if (!vesselInfo) return vessel
                return { ...vessel, ...vesselInfo }
              })
            }
          }
        }
      }
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
    setBounds: (state, action: PayloadAction<MiniglobeBounds>) => {
      state.bounds = action.payload
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetch4WingInteractionThunk.pending, (state, action) => {
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
        clickedFeature.dataset = action.payload.dataset
      }
    })
    builder.addCase(fetch4WingInteractionThunk.rejected, (state, action) => {
      if (action.error.message !== 'Aborted') {
        state.status = AsyncReducerStatus.Error
      }
    })
  },
})

export const selectClickedEvent = (state: RootState) => state.map.clicked
export const selectClickedEventStatus = (state: RootState) => state.map.status
export const selectBounds = (state: RootState) => state.map.bounds

export const { setClickedEvent, setBounds } = slice.actions
export default slice.reducer
