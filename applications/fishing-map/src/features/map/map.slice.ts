import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { uniqBy } from 'lodash'
import { InteractionEvent, ExtendedFeature } from '@globalfishingwatch/react-hooks'
import GFWAPI from '@globalfishingwatch/api-client'
import { resolveEndpoint, UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import {
  DataviewDatasetConfig,
  Dataset,
  Vessel,
  DatasetTypes,
  ApiEvent,
  EndpointId,
  EventVessel,
  EventVesselTypeEnum,
} from '@globalfishingwatch/api-types'
import { AsyncReducerStatus } from 'utils/async-slice'
import { AppDispatch, RootState } from 'store'
import {
  getRelatedDatasetByType,
  getRelatedDatasetsByType,
} from 'features/datasets/datasets.selectors'
import {
  selectEventsDataviews,
  selectActivityDataviews,
} from 'features/dataviews/dataviews.selectors'
import { fetchDatasetByIdThunk, selectDatasetById } from 'features/datasets/datasets.slice'
import { selectUserLogged } from 'features/user/user.slice'

export const MAX_TOOLTIP_LIST = 5

export type ExtendedFeatureVessel = {
  id: string
  hours: number
  dataset: Dataset
  infoDataset?: Dataset
  trackDataset?: Dataset
  [key: string]: any
}

export type ExtendedEventVessel = EventVessel & { dataset?: string }

export type ApiViirsStats = { detect_id: string; qf_detect: number; radiance: number }

export type ExtendedFeatureEvent = ApiEvent<EventVessel> & { dataset: Dataset }

export type SliceExtendedFeature = ExtendedFeature & {
  event?: ExtendedFeatureEvent
  vessels?: ExtendedFeatureVessel[]
  viirs?: ApiViirsStats[]
}

// Extends the default extendedEvent including event and vessels information from API
export type SliceInteractionEvent = Omit<InteractionEvent, 'features'> & {
  features: SliceExtendedFeature[]
}

type MapState = {
  clicked: SliceInteractionEvent | null
  hovered: SliceInteractionEvent | null
  fishingStatus: AsyncReducerStatus
  viirsStatus: AsyncReducerStatus
  apiEventStatus: AsyncReducerStatus
}

const initialState: MapState = {
  clicked: null,
  hovered: null,
  fishingStatus: AsyncReducerStatus.Idle,
  viirsStatus: AsyncReducerStatus.Idle,
  apiEventStatus: AsyncReducerStatus.Idle,
}

type SublayerVessels = {
  sublayerId: string
  vessels: ExtendedFeatureVessel[]
}

const getInteractionEndpointDatasetConfig = (
  features: ExtendedFeature[],
  temporalgridDataviews: UrlDataviewInstance[] = []
) => {
  // use the first feature/dv for common parameters
  const mainFeature = features[0]
  // Currently only one timerange is supported, which is OK since we only need interaction on the activity heatmaps and all
  // activity heatmaps use the same time intervals, This will need to be revised in case we support interactivity on environment layers
  const start = mainFeature.temporalgrid?.visibleStartDate
  const end = mainFeature.temporalgrid?.visibleEndDate

  // get corresponding dataviews
  const featuresDataviews = features.flatMap((feature) => {
    return feature.temporalgrid
      ? temporalgridDataviews.find(
          (dataview) => dataview.id === feature?.temporalgrid?.sublayerId
        ) || []
      : []
  })
  const fourWingsDataset = featuresDataviews[0].datasets?.find(
    (d) => d.type === DatasetTypes.Fourwings
  ) as Dataset

  // get corresponding datasets
  const datasets: string[][] = featuresDataviews.map((dv) => {
    return dv.config?.datasets || []
  })

  const datasetConfig: DataviewDatasetConfig = {
    datasetId: fourWingsDataset.id,
    endpoint: EndpointId.FourwingsInteraction,
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

  return { featuresDataviews, fourWingsDataset, datasetConfig }
}

export const fetchFishingActivityInteractionThunk = createAsyncThunk<
  { vessels: SublayerVessels[] } | undefined,
  { fishingActivityFeatures: ExtendedFeature[] },
  {
    dispatch: AppDispatch
  }
>(
  'map/fetchFishingActivityInteraction',
  async ({ fishingActivityFeatures }, { getState, signal, dispatch }) => {
    const state = getState() as RootState
    const userLogged = selectUserLogged(state)
    const temporalgridDataviews = selectActivityDataviews(state) || []
    if (!fishingActivityFeatures.length) {
      console.warn('fetchInteraction not possible, 0 features')
      return
    }

    const { featuresDataviews, fourWingsDataset, datasetConfig } =
      getInteractionEndpointDatasetConfig(fishingActivityFeatures, temporalgridDataviews)

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
            .slice(0, MAX_TOOLTIP_LIST)
        })
        .flatMap((v) => v)

      const topHoursVesselsDatasets = uniqBy(
        topHoursVessels.map(({ dataset }) => dataset),
        'id'
      )

      // Grab related dataset to fetch info from and prepare tracks
      const allInfoDatasets = await Promise.all(
        topHoursVesselsDatasets.flatMap(async (dataset) => {
          const infoDatasets = getRelatedDatasetsByType(dataset, DatasetTypes.Vessels)
          if (!infoDatasets) {
            return []
          }
          return await Promise.all(
            infoDatasets.flatMap(async ({ id }) => {
              let infoDataset = selectDatasetById(id)(state)
              if (!infoDataset) {
                // It needs to be request when it hasn't been loaded yet
                const action = await dispatch(fetchDatasetByIdThunk(id))
                if (fetchDatasetByIdThunk.fulfilled.match(action)) {
                  infoDataset = action.payload
                }
              }
              return (infoDataset || []) as Dataset
            })
          )
        })
      )
      const infoDatasets = allInfoDatasets.flatMap((d) => d || [])
      let vesselsInfo: Vessel[] = []
      if (infoDatasets?.length) {
        const infoDataset = infoDatasets[0]
        if (infoDataset) {
          const infoDatasetConfig = {
            endpoint: EndpointId.VesselList,
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

      const sublayersIds = fishingActivityFeatures.map(
        (feature) => feature.temporalgrid?.sublayerId || ''
      )
      const sublayersVessels: SublayerVessels[] = vesselsBySource.map((sublayerVessels, i) => {
        return {
          sublayerId: sublayersIds[i],
          vessels: sublayerVessels
            .flatMap((vessels) => {
              return vessels.map((vessel) => {
                const vesselInfo = vesselsInfo?.find((entry) => entry.id === vessel.id)
                if (!vesselInfo) return vessel
                const infoDataset = selectDatasetById(vesselInfo.dataset as string)(state)
                const trackDatasetId = getRelatedDatasetByType(
                  vessel.dataset,
                  DatasetTypes.Tracks,
                  userLogged
                )?.id
                const trackDataset = selectDatasetById(trackDatasetId as string)(state)
                return {
                  ...vesselInfo,
                  ...vessel,
                  infoDataset,
                  trackDataset,
                }
              })
            })
            .sort((a, b) => b.hours - a.hours),
        }
      })

      return { vessels: sublayersVessels }
    }
  }
)

export const fetchViirsInteractionThunk = createAsyncThunk<
  ApiViirsStats[] | undefined,
  { feature: ExtendedFeature },
  {
    dispatch: AppDispatch
  }
>('map/fetchViirsInteraction', async ({ feature }, { getState, signal }) => {
  if (!feature) {
    console.warn('fetchInteraction not possible, no features')
    return
  }
  const state = getState() as RootState
  const temporalgridDataviews = selectActivityDataviews(state) || []

  const { fourWingsDataset, datasetConfig } = getInteractionEndpointDatasetConfig(
    [feature],
    temporalgridDataviews
  )

  const interactionUrl = resolveEndpoint(fourWingsDataset, datasetConfig)
  if (interactionUrl) {
    const viirsStats = await GFWAPI.fetch<ApiViirsStats[][]>(interactionUrl, {
      signal,
    })

    return viirsStats[0]
  }
})

export const fetchEncounterEventThunk = createAsyncThunk<
  ExtendedFeatureEvent | undefined,
  ExtendedFeature,
  {
    dispatch: AppDispatch
  }
>('map/fetchEncounterEvent', async (eventFeature, { signal, getState }) => {
  const state = getState() as RootState
  const eventDataviews = selectEventsDataviews(state) || []
  const dataview = eventDataviews.find((d) => d.id === eventFeature.generatorId)
  const dataset = dataview?.datasets?.find((d) => d.type === DatasetTypes.Events)
  if (dataset) {
    const datasetConfig = {
      datasetId: dataset.id,
      endpoint: EndpointId.EventsDetail,
      params: [{ id: 'eventId', value: eventFeature.id }],
    }
    const url = resolveEndpoint(dataset, datasetConfig)
    if (url) {
      const clusterEvent = await GFWAPI.fetch<ApiEvent>(url, { signal })

      // Workaround to grab information about each vessel dataset
      // will need discuss with API team to scale this for other types
      const isACarrierTheMainVessel = clusterEvent.vessel.type === EventVesselTypeEnum.Carrier
      const fishingVessel = isACarrierTheMainVessel
        ? clusterEvent.encounter?.vessel
        : clusterEvent.vessel
      const carrierVessel = isACarrierTheMainVessel
        ? clusterEvent.vessel
        : clusterEvent.encounter?.vessel
      let vesselsInfo: ExtendedEventVessel[] = []
      const vesselsDatasets = dataview?.datasets
        ?.flatMap((d) => d.relatedDatasets || [])
        .filter((d) => d?.type === 'carriers-vessels:v1')
      if (vesselsDatasets?.length && fishingVessel && carrierVessel) {
        const vesselDataset = selectDatasetById(vesselsDatasets[0].id)(state) as Dataset
        const vesselsDatasetConfig = {
          datasetId: vesselDataset.id,
          endpoint: EndpointId.VesselList,
          params: [],
          query: [
            { id: 'ids', value: [fishingVessel.id, carrierVessel.id].join(',') },
            { id: 'datasets', value: vesselsDatasets.map((d) => d.id).join(',') },
          ],
        }
        const vesselsUrl = resolveEndpoint(vesselDataset, vesselsDatasetConfig)
        if (vesselsUrl) {
          vesselsInfo = await GFWAPI.fetch<ExtendedEventVessel[]>(vesselsUrl, { signal })
        }
      }

      if (clusterEvent) {
        const fishingVesselDataset =
          vesselsInfo.find((v) => v.id === fishingVessel?.id)?.dataset || ''
        const carrierVesselDataset =
          vesselsInfo.find((v) => v.id === carrierVessel?.id)?.dataset || ''
        const carrierExtendedVessel: ExtendedEventVessel = {
          ...(carrierVessel as EventVessel),
          dataset: carrierVesselDataset,
        }
        const fishingExtendedVessel: ExtendedEventVessel = {
          ...(fishingVessel as EventVessel),
          dataset: fishingVesselDataset,
        }
        return {
          ...clusterEvent,
          vessel: carrierExtendedVessel,
          ...(clusterEvent.encounter && {
            encounter: {
              ...clusterEvent.encounter,
              vessel: fishingExtendedVessel,
            },
          }),
          dataset,
        }
      }
    } else {
      console.warn('Missing url for endpoints', dataset, datasetConfig)
    }
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
    builder.addCase(fetchFishingActivityInteractionThunk.pending, (state, action) => {
      state.fishingStatus = AsyncReducerStatus.Loading
    })
    builder.addCase(fetchFishingActivityInteractionThunk.fulfilled, (state, action) => {
      state.fishingStatus = AsyncReducerStatus.Finished
      if (!state.clicked || !state.clicked.features || !action.payload) return

      action.payload.vessels.forEach((sublayerVessels) => {
        const sublayer = state.clicked?.features?.find(
          (feature) =>
            feature.temporalgrid && feature.temporalgrid.sublayerId === sublayerVessels.sublayerId
        )
        if (!sublayer) return
        sublayer.vessels = sublayerVessels.vessels
      })
    })
    builder.addCase(fetchFishingActivityInteractionThunk.rejected, (state, action) => {
      if (action.error.message === 'Aborted') {
        state.fishingStatus = AsyncReducerStatus.Idle
      } else {
        state.fishingStatus = AsyncReducerStatus.Error
      }
    })
    builder.addCase(fetchViirsInteractionThunk.pending, (state, action) => {
      state.viirsStatus = AsyncReducerStatus.Loading
    })
    builder.addCase(fetchViirsInteractionThunk.fulfilled, (state, action) => {
      state.viirsStatus = AsyncReducerStatus.Finished
      if (!state.clicked || !state.clicked.features || !action.payload) return
      const feature = state.clicked?.features?.find((feature) => {
        const sameFeatureId = feature.id && action.meta.arg.feature.id
        const sameFeatureInteractionType =
          feature.temporalgrid?.sublayerInteractionType ===
          action.meta.arg.feature.temporalgrid?.sublayerInteractionType
        return sameFeatureId && sameFeatureInteractionType
      })
      if (feature && action.payload) {
        feature.viirs = action.payload
      }
    })
    builder.addCase(fetchViirsInteractionThunk.rejected, (state, action) => {
      if (action.error.message === 'Aborted') {
        state.viirsStatus = AsyncReducerStatus.Idle
      } else {
        state.viirsStatus = AsyncReducerStatus.Error
      }
    })
    builder.addCase(fetchEncounterEventThunk.pending, (state, action) => {
      state.apiEventStatus = AsyncReducerStatus.Loading
    })
    builder.addCase(fetchEncounterEventThunk.fulfilled, (state, action) => {
      state.apiEventStatus = AsyncReducerStatus.Finished
      if (!state.clicked || !state.clicked.features || !action.payload) return
      const feature = state.clicked?.features?.find((feature) => feature.id && action.meta.arg.id)
      if (feature) {
        feature.event = action.payload
      }
    })
    builder.addCase(fetchEncounterEventThunk.rejected, (state, action) => {
      if (action.error.message === 'Aborted') {
        state.apiEventStatus = AsyncReducerStatus.Idle
      } else {
        state.apiEventStatus = AsyncReducerStatus.Error
      }
    })
  },
})

export const selectClickedEvent = (state: RootState) => state.map.clicked
export const selectFishingInteractionStatus = (state: RootState) => state.map.fishingStatus
export const selectViirsInteractionStatus = (state: RootState) => state.map.viirsStatus
export const selectApiEventStatus = (state: RootState) => state.map.apiEventStatus

export const { setClickedEvent } = slice.actions
export default slice.reducer
