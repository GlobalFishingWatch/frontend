import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import uniqBy from 'lodash/uniqBy'
import { InteractionEvent, ExtendedFeature } from '@globalfishingwatch/react-hooks'
import GFWAPI from '@globalfishingwatch/api-client'
import { resolveEndpoint } from '@globalfishingwatch/dataviews-client'
import {
  DataviewDatasetConfig,
  Dataset,
  Vessel,
  DatasetTypes,
  ApiEvent,
} from '@globalfishingwatch/api-types'
import { AsyncReducerStatus } from 'utils/async-slice'
import { AppDispatch, RootState } from 'store'
import {
  getRelatedDatasetByType,
  selectTemporalgridDataviews,
} from 'features/workspace/workspace.selectors'
import { fetchDatasetByIdThunk, selectDatasetById } from 'features/datasets/datasets.slice'
import { selectTimeRange } from 'features/app/app.selectors'

export const MAX_TOOLTIP_VESSELS = 5

export type ExtendedFeatureVessel = {
  id: string
  hours: number
  dataset: Dataset
  [key: string]: any
}

export type SliceExtendedFeature = ExtendedFeature & {
  event?: ApiEvent
  vessels?: ExtendedFeatureVessel[]
}

// Extends the default extendedEvent including event and vessels information from API
export type SliceInteractionEvent = Omit<InteractionEvent, 'features'> & {
  features: SliceExtendedFeature[]
}

type MapState = {
  clicked: SliceInteractionEvent | null
  hovered: SliceInteractionEvent | null
  fourWingsStatus: AsyncReducerStatus
  apiEventStatus: AsyncReducerStatus
}

const initialState: MapState = {
  clicked: null,
  hovered: null,
  fourWingsStatus: AsyncReducerStatus.Idle,
  apiEventStatus: AsyncReducerStatus.Idle,
}

type SublayerVessels = {
  sublayerIndex: number
  vessels: ExtendedFeatureVessel[]
}

export const fetch4WingInteractionThunk = createAsyncThunk<
  { vessels: SublayerVessels[] } | undefined,
  ExtendedFeature[],
  {
    dispatch: AppDispatch
  }
>(
  'map/fetchInteraction',
  async (temporalGridFeatures: ExtendedFeature[], { getState, signal, dispatch }) => {
    const state = getState() as RootState
    const temporalgridDataviews = selectTemporalgridDataviews(state) || []
    const { start, end } = selectTimeRange(state)

    // get corresponding dataviews
    const featuresDataviews = temporalGridFeatures.flatMap((feature) => {
      return feature.temporalgrid ? temporalgridDataviews[feature.temporalgrid.sublayerIndex] : []
    })

    const fourWingsDataset = featuresDataviews[0].datasets?.find(
      (d) => d.type === DatasetTypes.Fourwings
    ) as Dataset

    // get corresponding datasets
    const datasets: string[][] = featuresDataviews.map((dv) => {
      return dv.config?.datasets || []
    })

    // use the first feature/dv for common parameters
    const mainFeature = temporalGridFeatures[0]
    const datasetConfig: DataviewDatasetConfig = {
      datasetId: fourWingsDataset.id,
      endpoint: '4wings-interaction',
      params: [
        { id: 'z', value: mainFeature.tile?.z },
        { id: 'x', value: mainFeature.tile?.x },
        { id: 'y', value: mainFeature.tile?.y },
        { id: 'rows', value: mainFeature.temporalgrid?.row as number },
        { id: 'cols', value: mainFeature.temporalgrid?.col as number },
      ],
      query: [
        { id: 'date-range', value: [start, end].join(',') },
        {
          id: 'datasets',
          value: datasets.map((ds) => ds.join(',')),
        },
      ],
    }

    const filters = featuresDataviews.map((dv) => dv.config?.filter || [])
    if (filters?.length) {
      datasetConfig.query?.push({ id: 'filters', value: filters })
    }

    const interactionUrl = resolveEndpoint(fourWingsDataset, datasetConfig)
    if (interactionUrl) {
      const sublayersVesselsIds = await GFWAPI.fetch<ExtendedFeatureVessel[]>(interactionUrl, {
        signal,
      })

      let startingIndex = 0
      const vesselsBySource: ExtendedFeatureVessel[][][] = featuresDataviews.map((dataview) => {
        const datasets: string[] = dataview.config?.datasets
        const newStartingIndex = startingIndex + datasets.length
        const dataviewVesselsIds = sublayersVesselsIds.slice(startingIndex, newStartingIndex)
        startingIndex = newStartingIndex
        return dataviewVesselsIds.map((vessels, i) => {
          const dataset = selectDatasetById(datasets[i])(state)
          return vessels.flatMap((vessel: ExtendedFeatureVessel) => ({ ...vessel, dataset }))
        })
      })

      const topHoursVessels = vesselsBySource
        .map((source) => {
          return source
            .flatMap((source) => source)
            .sort((a, b) => b.hours - a.hours)
            .slice(0, MAX_TOOLTIP_VESSELS)
        })
        .flatMap((v) => v)

      const topHoursVesselsDatasets = uniqBy(
        topHoursVessels.map(({ dataset }) => dataset),
        'id'
      )

      // Grab related dataset to fetch info from and prepare tracks
      const infoDatasets = await Promise.all(
        topHoursVesselsDatasets.map(async (dataset) => {
          const infoDatasetId = getRelatedDatasetByType(dataset, DatasetTypes.Vessels)?.id
          if (infoDatasetId) {
            let infoDataset = selectDatasetById(infoDatasetId)(state)
            if (!infoDataset) {
              // It needs to be request when it hasn't been loaded yet
              const action = await dispatch(fetchDatasetByIdThunk(infoDatasetId))
              if (fetchDatasetByIdThunk.fulfilled.match(action)) {
                infoDataset = action.payload
              }
            }
            return infoDataset
          }
        })
      )

      let vesselsInfo: Vessel[] = []
      if (infoDatasets?.length) {
        const infoDataset = infoDatasets[0]
        if (infoDataset) {
          const infoDatasetConfig = {
            endpoint: 'carriers-list-vessels',
            datasetId: infoDataset.id,
            params: [],
            query: [
              {
                id: 'datasets',
                value: infoDatasets.flatMap((infoDataset) => infoDataset?.id || []),
              },
              {
                id: 'ids',
                value: topHoursVessels.map((v) => v.id),
              },
            ],
          }
          const vesselsInfoUrl = resolveEndpoint(infoDataset, infoDatasetConfig)

          if (vesselsInfoUrl) {
            try {
              const vesselsInfoResponse = await GFWAPI.fetch<Vessel[]>(vesselsInfoUrl, {
                signal,
              })
              // TODO remove entries once the API is stable
              const vesselsInfoList: Vessel[] =
                !vesselsInfoResponse.entries || typeof vesselsInfoResponse.entries === 'function'
                  ? vesselsInfoResponse
                  : (vesselsInfoResponse as any)?.entries
              vesselsInfo = vesselsInfoList || []
            } catch (e) {
              console.warn(e)
            }
          }
        }
      }

      const sublayersIndices = temporalGridFeatures.map(
        (feature) => feature.temporalgrid?.sublayerIndex || 0
      )
      const sublayersVessels: SublayerVessels[] = vesselsBySource.map((sublayerVessels, i) => {
        return {
          sublayerIndex: sublayersIndices[i],
          vessels: sublayerVessels
            .flatMap((vessels) => {
              return vessels.map((vessel) => {
                const vesselInfo = vesselsInfo?.find((entry) => entry.id === vessel.id)
                if (!vesselInfo) return vessel
                return { ...vesselInfo, ...vessel }
              })
            })
            .sort((a, b) => b.hours - a.hours),
        }
      })

      return { vessels: sublayersVessels }
    }
  }
)
export const fetchEcounterEventThunk = createAsyncThunk<
  ApiEvent | undefined,
  ExtendedFeature,
  {
    dispatch: AppDispatch
  }
>('map/fetchEncounterEvent', async (eventFeature, { signal }) => {
  // TODO use dataset endpoint instead of hardcoded v0 endpoint
  const eventUrl = `https://gateway.api.dev.globalfishingwatch.org/datasets/carriers:v20201201/events/${eventFeature.id}`
  const event = await GFWAPI.fetch<ApiEvent>(eventUrl, {
    signal,
  })
  if (event) {
    return event
  }
  return
})

const slice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setClickedEvent: (state, action: PayloadAction<SliceInteractionEvent | null>) => {
      if (action.payload === null) {
        state.clicked = null
        return
      }
      state.clicked = { ...action.payload }
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetch4WingInteractionThunk.pending, (state, action) => {
      state.fourWingsStatus = AsyncReducerStatus.Loading
    })
    builder.addCase(fetch4WingInteractionThunk.fulfilled, (state, action) => {
      state.fourWingsStatus = AsyncReducerStatus.Finished
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
        state.fourWingsStatus = AsyncReducerStatus.Idle
      } else {
        state.fourWingsStatus = AsyncReducerStatus.Error
      }
    })
    builder.addCase(fetchEcounterEventThunk.pending, (state, action) => {
      state.apiEventStatus = AsyncReducerStatus.Loading
    })
    builder.addCase(fetchEcounterEventThunk.fulfilled, (state, action) => {
      state.apiEventStatus = AsyncReducerStatus.Finished
      if (!state.clicked || !state.clicked.features || !action.payload) return
      const feature = state.clicked?.features?.find((feature) => feature.id && action.meta.arg.id)
      if (feature) {
        feature.event = action.payload
      }
    })
    builder.addCase(fetchEcounterEventThunk.rejected, (state, action) => {
      if (action.error.message === 'Aborted') {
        state.apiEventStatus = AsyncReducerStatus.Idle
      } else {
        state.apiEventStatus = AsyncReducerStatus.Error
      }
    })
  },
})

export const selectClickedEvent = (state: RootState) => state.map.clicked
export const selectFourWingsStatus = (state: RootState) => state.map.fourWingsStatus
export const selectApiEventStatus = (state: RootState) => state.map.apiEventStatus

export const { setClickedEvent } = slice.actions
export default slice.reducer
