import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { InteractionEvent, ExtendedFeatureVessel } from '@globalfishingwatch/react-hooks'
import GFWAPI from '@globalfishingwatch/api-client'
import { resolveEndpoint } from '@globalfishingwatch/dataviews-client'
import { DataviewDatasetConfig, Dataset, APISearch, Vessel } from '@globalfishingwatch/api-types'
import { MiniglobeBounds } from '@globalfishingwatch/ui-components/dist'
import { AsyncReducerStatus } from 'types'
import { RootState } from 'store'
import { VESSELS_DATASET_TYPE } from 'data/datasets'
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

type Fetch4WingInteractionThunkPayload = {
  dataset: Dataset
  datasetConfig: DataviewDatasetConfig
  sublayersIndices: number[]
}

type SublayerVessels = {
  sublayerIndex: number
  vessels: ExtendedFeatureVessel[]
}

export const fetch4WingInteractionThunk = createAsyncThunk(
  'map/fetchInteraction',
  async (
    { dataset, datasetConfig, sublayersIndices }: Fetch4WingInteractionThunkPayload,
    { getState, signal }
  ) => {
    const state = getState() as RootState
    const url = resolveEndpoint(dataset, datasetConfig)
    let vesselsInfo: Vessel[] = []
    if (url) {
      const sublayersVesselsIds = await GFWAPI.fetch<ExtendedFeatureVessel[]>(url, {
        signal,
      }).then((vs) => {
        // TODO remove once the API always return same structure, now for chile and indonesia returns
        // { data: null, name: 'dataset' }
        return vs.filter((vs) => Array.isArray(vs))
      })
      const infoDatasetId = getRelatedDatasetByType(dataset, VESSELS_DATASET_TYPE)?.id
      if (infoDatasetId) {
        const infoDataset = selectDatasetById(infoDatasetId)(state)
        if (infoDataset) {
          const flattenedVesselIds = sublayersVesselsIds
            .map((vs) => vs.slice(0, MAX_TOOLTIP_VESSELS))
            .flatMap((vs) => vs)
            .map((v) => v.id)
          const infoDatasetConfig = {
            endpoint: 'carriers-list-vessels',
            datasetId: infoDataset.id,
            params: [],
            query: [
              { id: 'datasets', value: infoDataset.id },
              {
                id: 'ids',
                value: flattenedVesselIds,
              },
            ],
          }
          const infoUrl = resolveEndpoint(infoDataset, infoDatasetConfig)
          if (infoUrl) {
            try {
              const vesselsInfoResponse = await GFWAPI.fetch<APISearch<Vessel>>(infoUrl, { signal })
              vesselsInfo = vesselsInfoResponse?.[0]?.results?.entries
            } catch (e) {
              console.warn(e)
            }
          }
        }
      }
      const sublayersVessels: SublayerVessels[] = sublayersVesselsIds.map((sublayerVessels, i) => {
        return {
          sublayerIndex: sublayersIndices[i],
          vessels: sublayerVessels.map((vessel: ExtendedFeatureVessel) => {
            const vesselInfo = vesselsInfo?.find((entry: any) => entry.id === vessel.id)
            if (!vesselInfo) return vessel
            return { ...vessel, ...vesselInfo }
          }),
        }
      })
      return { vessels: sublayersVessels, dataset }
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
      if (!state.clicked || !state.clicked.features || !action.payload) return

      action.payload.vessels.forEach((sublayerVessels) => {
        const sublayer = state.clicked?.features?.find(
          (feature) =>
            feature.temporalgrid &&
            feature.temporalgrid.sublayerIndex === sublayerVessels.sublayerIndex
        )
        if (!sublayer) return
        sublayer.vessels = sublayerVessels.vessels
      })
    })
    builder.addCase(fetch4WingInteractionThunk.rejected, (state, action) => {
      if (action.error.message === 'Aborted') {
        state.status = AsyncReducerStatus.Idle
      } else {
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
