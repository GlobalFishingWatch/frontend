import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { uniqBy } from 'es-toolkit'
import { RootState } from 'reducers'
import { GFWAPI } from '@globalfishingwatch/api-client'
import {
  getDataviewSqlFiltersResolved,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import { resolveEndpoint } from '@globalfishingwatch/datasets-client'
import {
  DataviewDatasetConfig,
  Dataset,
  IdentityVessel,
  DatasetTypes,
  ApiEvent,
  EndpointId,
  EventVessel,
  EventVesselTypeEnum,
  APIPagination,
} from '@globalfishingwatch/api-types'
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { InteractionEvent } from '@globalfishingwatch/deck-layer-composer'
import {
  ClusterPickingObject,
  ContextPickingObject,
  FourwingsClusterPickingObject,
  FourwingsDeckSublayer,
  FourwingsHeatmapPickingObject,
  FourwingsPickingObject,
  FourwingsPositionsPickingObject,
  UserLayerPickingObject,
  VesselEventPickingObject,
} from '@globalfishingwatch/deck-layers'
import { getUTCDate } from '@globalfishingwatch/data-transforms'
import { AsyncReducerStatus } from 'utils/async-slice'
import { AppDispatch } from 'store'
import { selectActiveTemporalgridDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { fetchDatasetByIdThunk, selectDatasetById } from 'features/datasets/datasets.slice'
import { getRelatedDatasetByType, getRelatedDatasetsByType } from 'features/datasets/datasets.utils'
import { getVesselProperty } from 'features/vessel/vessel.utils'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import { selectEventsDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'

export const MAX_TOOLTIP_LIST = 5

type ExtendedFeatureVesselDatasets = IdentityVessel & {
  id: string
  dataset: Dataset
  infoDataset?: Dataset
  trackDataset?: Dataset
}

// TODO extract this type in app types
export type ExtendedFeatureVessel = ExtendedFeatureVesselDatasets & {
  hours: number
  [key: string]: any
}

export type ExtendedEventVessel = EventVessel & { dataset?: string }

export type ExtendedFeatureEvent = ApiEvent<EventVessel> & { dataset: Dataset }

export type SliceExtendedFourwingsDeckSublayer = FourwingsDeckSublayer & {
  vessels?: ExtendedFeatureVessel[]
}
export type SliceExtendedFourwingsPickingObject = Omit<
  FourwingsHeatmapPickingObject,
  'sublayers'
> & {
  sublayers: SliceExtendedFourwingsDeckSublayer[]
}

export type SliceExtendedClusterPickingObject = FourwingsClusterPickingObject & {
  event: ExtendedFeatureEvent
}

type SliceExtendedFeature =
  | SliceExtendedFourwingsPickingObject
  | SliceExtendedClusterPickingObject
  | FourwingsPositionsPickingObject
  | ContextPickingObject
  | UserLayerPickingObject
  | FourwingsClusterPickingObject
  | VesselEventPickingObject

// Extends the default extendedEvent including event and vessels information from API
export type SliceInteractionEvent = Omit<InteractionEvent, 'features'> & {
  features: SliceExtendedFeature[]
}

type MapState = {
  loaded: boolean
  clicked: SliceInteractionEvent | null
  hovered: SliceInteractionEvent | null
  fishingStatus: AsyncReducerStatus
  currentFishingRequestId: string
  apiEventStatus: AsyncReducerStatus
}

const initialState: MapState = {
  loaded: false,
  clicked: null,
  hovered: null,
  fishingStatus: AsyncReducerStatus.Idle,
  currentFishingRequestId: '',
  apiEventStatus: AsyncReducerStatus.Idle,
}

type SublayerVessels = {
  sublayerId: string
  vessels: ExtendedFeatureVessel[]
}

const getInteractionEndpointDatasetConfig = (
  features: FourwingsHeatmapPickingObject[],
  temporalgridDataviews: UrlDataviewInstance[] = []
) => {
  // use the first feature/dv for common parameters
  const mainFeature = features[0]
  // Currently only one timerange is supported, which is OK since we only need interaction on the activity heatmaps and all
  // activity heatmaps use the same time intervals, This will need to be revised in case we support interactivity on environment layers
  const start = getUTCDate(mainFeature?.startTime).toISOString()
  const end = getUTCDate(mainFeature?.endTime).toISOString()

  // get corresponding dataviews
  const featuresDataviews = features.flatMap((feature) => {
    if (!feature.sublayers?.length) return []
    return feature.sublayers.flatMap((sublayer) => {
      return temporalgridDataviews.find((dataview) => dataview.id === sublayer.id) || []
    })
  })
  const fourWingsDataset = featuresDataviews[0]?.datasets?.find(
    (d) => d.type === DatasetTypes.Fourwings
  ) as Dataset

  // get corresponding datasets
  const datasets: string[][] = featuresDataviews.map((dv) => {
    return dv.config?.datasets || []
  })

  const datasetConfig: DataviewDatasetConfig = {
    datasetId: fourWingsDataset?.id,
    endpoint: EndpointId.FourwingsInteraction,
    params: [
      { id: 'z', value: mainFeature.tile?.z },
      { id: 'x', value: mainFeature.tile?.x },
      { id: 'y', value: mainFeature.tile?.y },
      { id: 'rows', value: mainFeature.properties?.row as number },
      { id: 'cols', value: mainFeature.properties?.col as number },
    ],
    query: [
      { id: 'date-range', value: [start, end].join(',') },
      {
        id: 'datasets',
        value: datasets.map((ds) => ds.join(',')),
      },
    ],
  }

  const filters = featuresDataviews.map((dataview) => getDataviewSqlFiltersResolved(dataview) || '')
  if (filters.length) {
    datasetConfig.query?.push({ id: 'filters', value: filters })
  }

  const vesselGroups = featuresDataviews.flatMap((dv) => dv.config?.['vessel-groups'] || [])

  if (vesselGroups.length) {
    datasetConfig.query?.push({ id: 'vessel-groups', value: vesselGroups })
  }

  return { featuresDataviews, fourWingsDataset, datasetConfig }
}

const getVesselInfoEndpoint = (vesselDatasets: Dataset[], vesselIds: string[]) => {
  if (!vesselDatasets || !vesselDatasets.length || !vesselIds || !vesselIds.length) {
    return null
  }
  const datasetConfig = {
    endpoint: EndpointId.VesselList,
    datasetId: vesselDatasets?.[0]?.id,
    params: [],
    query: [
      {
        id: 'datasets',
        value: vesselDatasets.map((d) => d.id),
      },
      {
        id: 'ids',
        value: vesselIds,
      },
      {
        id: 'includes',
        value: ['POTENTIAL_RELATED_SELF_REPORTED_INFO'],
      },
    ],
  }
  return resolveEndpoint(vesselDatasets[0], datasetConfig)
}

const fetchVesselInfo = async (datasets: Dataset[], vesselIds: string[], signal: AbortSignal) => {
  const vesselsInfoUrl = getVesselInfoEndpoint(datasets, vesselIds)
  if (!vesselsInfoUrl) {
    console.warn('No vessel info url found for dataset', datasets)
    console.warn('and vesselIds', vesselIds)
    return
  }
  try {
    const vesselsInfoResponse = await GFWAPI.fetch<APIPagination<IdentityVessel>>(vesselsInfoUrl, {
      signal,
    })
    // TODO remove entries once the API is stable
    const vesselsInfoList: IdentityVessel[] =
      !vesselsInfoResponse.entries || typeof vesselsInfoResponse.entries === 'function'
        ? vesselsInfoResponse
        : (vesselsInfoResponse as any)?.entries
    return vesselsInfoList || []
  } catch (e: any) {
    console.warn(e)
  }
}

export type ActivityProperty = 'hours' | 'detections'
export const fetchFishingActivityInteractionThunk = createAsyncThunk<
  { vessels: SublayerVessels[] } | undefined,
  {
    fishingActivityFeatures: FourwingsHeatmapPickingObject[]
    activityProperties?: ActivityProperty[]
  },
  {
    dispatch: AppDispatch
  }
>(
  'map/fetchFishingActivityInteraction',
  async ({ fishingActivityFeatures, activityProperties }, { getState, signal, dispatch }) => {
    const state = getState() as any
    const guestUser = selectIsGuestUser(state)
    const temporalgridDataviews = selectActiveTemporalgridDataviews(state) || []
    if (!fishingActivityFeatures.length) {
      console.warn('fetchInteraction not possible, 0 features')
      return
    }

    const { featuresDataviews, fourWingsDataset, datasetConfig } =
      getInteractionEndpointDatasetConfig(fishingActivityFeatures, temporalgridDataviews)

    const interactionUrl = resolveEndpoint(fourWingsDataset, datasetConfig)
    if (interactionUrl) {
      const sublayersVesselsIdsResponse = await GFWAPI.fetch<APIPagination<ExtendedFeatureVessel>>(
        interactionUrl,
        { signal }
      )

      const sublayersVesselsIds = sublayersVesselsIdsResponse.entries.map((sublayer) =>
        sublayer.map((vessel: any) => {
          const { id, vessel_id, ...rest } = vessel
          // vessel_id needed for VIIRS layers
          return { ...rest, id: id || vessel_id }
        })
      )

      let startingIndex = 0
      const vesselsBySource: ExtendedFeatureVessel[][][] = featuresDataviews.map((dataview) => {
        const datasets: string[] = dataview.config?.datasets || []
        const newStartingIndex = startingIndex + datasets.length
        const dataviewVesselsIds = sublayersVesselsIds.slice(startingIndex, newStartingIndex)
        startingIndex = newStartingIndex
        return dataviewVesselsIds.map((vessels, i) => {
          const dataset = selectDatasetById(datasets[i])(state)
          return vessels.flatMap((vessel: ExtendedFeatureVessel) => ({
            ...vessel,
            dataset,
          }))
        })
      })

      const topActivityVessels = vesselsBySource
        .map((source, i) => {
          const activityProperty = activityProperties?.[i] || 'hours'
          return source
            .flatMap((source) => source)
            .sort((a, b) => b[activityProperty] - a[activityProperty])
            .filter((v) => v.id !== null)
            .slice(0, MAX_TOOLTIP_LIST)
        })
        .flatMap((v) => v)

      const topActivityVesselsDatasets = uniqBy(
        topActivityVessels.map(({ dataset }) => dataset),
        (d) => d.id
      )
      // Grab related dataset to fetch info from and prepare tracks
      const allInfoDatasets = await Promise.all(
        topActivityVesselsDatasets.flatMap(async (dataset) => {
          const infoDatasets = getRelatedDatasetsByType(dataset, DatasetTypes.Vessels, !guestUser)
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
              return infoDataset
            })
          )
        })
      )

      const infoDatasets = allInfoDatasets.flatMap((datasets) => datasets.flatMap((d) => d || []))
      const topActivityVesselIds = topActivityVessels.map(({ id }) => id)

      const vesselsInfo = await fetchVesselInfo(infoDatasets, topActivityVesselIds, signal)

      const sublayersIds = fishingActivityFeatures.flatMap(
        (feature) => feature.sublayers?.map((sublayer) => sublayer.id) || ''
      )

      const sublayersVessels: SublayerVessels[] = vesselsBySource.map((sublayerVessels, i) => {
        const activityProperty = activityProperties?.[i] || 'hours'
        return {
          sublayerId: sublayersIds[i],
          vessels: sublayerVessels
            .flatMap((vessels) => {
              return vessels.map((vessel) => {
                const vesselInfo = vesselsInfo?.find((vesselInfo) => {
                  const vesselInfoIds = vesselInfo.selfReportedInfo?.map((s) => s.id)
                  return vesselInfoIds.includes(vessel.id)
                })
                const infoDataset = selectDatasetById(vesselInfo?.dataset as string)(state)
                const trackFromRelatedDataset = infoDataset || vessel.dataset
                const trackDatasetId = getRelatedDatasetByType(
                  trackFromRelatedDataset,
                  DatasetTypes.Tracks,
                  { fullDatasetAllowed: !guestUser }
                )?.id
                // if (vesselInfo && !trackDatasetId) {
                //   console.warn('No track dataset found for dataset:', trackFromRelatedDataset)
                //   console.warn('and vessel:', vessel)
                // }
                const trackDataset = selectDatasetById(trackDatasetId as string)(state)
                return {
                  ...vessel,
                  ...(vesselInfo || {}),
                  id: vesselInfo?.selfReportedInfo?.[0]?.id || vessel.id,
                  infoDataset,
                  trackDataset,
                } as ExtendedFeatureVessel
              })
            })
            .sort((a: any, b: any) => b[activityProperty] - a[activityProperty]),
        }
      })
      return { vessels: sublayersVessels }
    }
  }
)

export const fetchClusterEventThunk = createAsyncThunk<
  ExtendedFeatureEvent | undefined,
  FourwingsClusterPickingObject,
  {
    dispatch: AppDispatch
  }
>('map/fetchEncounterEvent', async (eventFeature, { signal, getState }) => {
  const state = getState() as RootState
  const eventDataviews = selectEventsDataviews(state) || []
  const dataview = eventDataviews.find((d) => d.id === eventFeature.layerId)
  const eventsDataset = dataview?.datasets?.find((d) => d.type === DatasetTypes.Events)
  let interactionId = eventFeature.id
  let eventId: string | undefined = eventFeature.eventId
  if (!eventId && interactionId && eventsDataset) {
    const start = getUTCDate(eventFeature?.startTime).toISOString()
    const end = getUTCDate(eventFeature?.endTime).toISOString()
    const datasetConfig: DataviewDatasetConfig = {
      datasetId: eventsDataset?.id,
      endpoint: EndpointId.ClusterTilesInteraction,
      params: [
        { id: 'z', value: eventFeature.properties.tile.z },
        { id: 'x', value: eventFeature.properties.tile.x },
        { id: 'y', value: eventFeature.properties.tile.y },
        { id: 'rows', value: eventFeature.properties.row as number },
        { id: 'cols', value: eventFeature.properties.col as number },
      ],
      query: [
        { id: 'date-range', value: [start, end].join(',') },
        {
          id: 'datasets',
          value: [eventsDataset.id],
        },
      ],
    }
    if (dataview) {
      const filters = getDataviewSqlFiltersResolved(dataview)
      datasetConfig.query?.push({ id: 'filters', value: filters })
    }
    const interactionUrl = resolveEndpoint(eventsDataset, datasetConfig)
    if (interactionUrl) {
      const eventsIds = await GFWAPI.fetch<APIPagination<{ id: string }[]>>(interactionUrl, {
        signal,
      })
      // TODO:deck remove this hardcoded id once the api responds
      eventId = eventsIds.entries[0][0].id
    }
  }
  // TODO:deck get the event dataset from related
  if (eventsDataset && eventId) {
    const datasetConfig = {
      datasetId: eventsDataset.id,
      endpoint: EndpointId.EventsDetail,
      params: [{ id: 'eventId', value: eventId }],
      query: [{ id: 'dataset', value: eventsDataset.id }],
    }
    const url = resolveEndpoint(eventsDataset, datasetConfig)
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
      let vesselsInfo: IdentityVessel[] = []
      const vesselsDatasets = dataview?.datasets
        ?.flatMap((d) => d.relatedDatasets || [])
        .filter((d) => d?.type === DatasetTypes.Vessels)

      if (vesselsDatasets?.length && fishingVessel && carrierVessel) {
        const vesselDataset = selectDatasetById(vesselsDatasets[0].id)(state) as Dataset
        const vesselsDatasetConfig = {
          datasetId: vesselDataset.id,
          endpoint: EndpointId.VesselList,
          params: [],
          query: [
            { id: 'ids', value: [fishingVessel.id, carrierVessel.id] },
            { id: 'datasets', value: vesselsDatasets.map((d) => d.id) },
          ],
        }
        const vesselsUrl = resolveEndpoint(vesselDataset, vesselsDatasetConfig)
        if (vesselsUrl) {
          vesselsInfo = await GFWAPI.fetch<APIPagination<IdentityVessel>>(vesselsUrl, {
            signal,
          }).then((r) => r.entries)
        }
      }
      if (clusterEvent) {
        const fishingVesselDataset =
          vesselsInfo.find(
            (v) =>
              getVesselProperty(v, 'id', {
                identitySource: VesselIdentitySourceEnum.SelfReported,
              }) === fishingVessel?.id
          )?.dataset || ''
        const carrierVesselDataset =
          vesselsInfo.find(
            (v) =>
              getVesselProperty(v, 'id', {
                identitySource: VesselIdentitySourceEnum.SelfReported,
              }) === carrierVessel?.id
          )?.dataset || ''
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
          dataset: eventsDataset,
        }
      }
    } else {
      console.warn('Missing url for endpoints', eventsDataset, datasetConfig)
    }
  }

  return
})

type BQClusterEvent = Record<string, any>
export const fetchBQEventThunk = createAsyncThunk<
  BQClusterEvent | undefined,
  any, // TODO: deck fix this type once the layer is implemented in deck
  {
    dispatch: AppDispatch
  }
>('map/fetchBQEvent', async (eventFeature, { signal, getState }) => {
  const state = getState() as any
  const eventDataviews = selectEventsDataviews(state) || []
  const dataview = eventDataviews.find((d) => d.id === eventFeature.generatorId)
  const dataset = dataview?.datasets?.find((d) => d.type === DatasetTypes.Events)
  if (dataset) {
    const datasetConfig = {
      datasetId: dataset.id,
      endpoint: EndpointId.EventsDetail,
      params: [{ id: 'eventId', value: eventFeature.id }],
      query: [{ id: 'raw', value: true }],
    }
    const url = resolveEndpoint(dataset, datasetConfig)
    if (url) {
      const clusterEvent = await GFWAPI.fetch<BQClusterEvent>(url, { signal })
      return clusterEvent
    } else {
      console.warn('Missing url for endpoints', dataset, datasetConfig)
    }
  }
  return
})

export const fetchLegacyEncounterEventThunk = createAsyncThunk<
  ExtendedFeatureEvent | undefined,
  ClusterPickingObject,
  {
    dispatch: AppDispatch
  }
>('map/fetchLegacyEncounterEvent', async (eventFeature, { signal, getState }) => {
  const state = getState() as any
  const eventDataviews = selectEventsDataviews(state) || []
  const dataview = eventDataviews.find((d) => d.id === eventFeature.layerId)
  const dataset = dataview?.datasets?.find((d) => d.type === DatasetTypes.Events)

  if (dataset) {
    const datasetConfig = {
      datasetId: dataset.id,
      endpoint: EndpointId.EventsDetail,
      params: [{ id: 'eventId', value: eventFeature.id }],
      query: [{ id: 'dataset', value: dataset.id }],
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
      let vesselsInfo: IdentityVessel[] = []
      const vesselsDatasets = dataview?.datasets
        ?.flatMap((d) => d.relatedDatasets || [])
        .filter((d) => d?.type === DatasetTypes.Vessels)

      if (vesselsDatasets?.length && fishingVessel && carrierVessel) {
        const vesselDataset = selectDatasetById(vesselsDatasets[0].id)(state) as Dataset
        const vesselsDatasetConfig = {
          datasetId: vesselDataset.id,
          endpoint: EndpointId.VesselList,
          params: [],
          query: [
            { id: 'ids', value: [fishingVessel.id, carrierVessel.id] },
            { id: 'datasets', value: vesselsDatasets.map((d) => d.id) },
          ],
        }
        const vesselsUrl = resolveEndpoint(vesselDataset, vesselsDatasetConfig)
        if (vesselsUrl) {
          vesselsInfo = await GFWAPI.fetch<APIPagination<IdentityVessel>>(vesselsUrl, {
            signal,
          }).then((r) => r.entries)
        }
      }
      if (clusterEvent) {
        const fishingVesselDataset =
          vesselsInfo.find(
            (v) =>
              getVesselProperty(v, 'id', {
                identitySource: VesselIdentitySourceEnum.SelfReported,
              }) === fishingVessel?.id
          )?.dataset || ''
        const carrierVesselDataset =
          vesselsInfo.find(
            (v) =>
              getVesselProperty(v, 'id', {
                identitySource: VesselIdentitySourceEnum.SelfReported,
              }) === carrierVessel?.id
          )?.dataset || ''
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
    setMapLoaded: (state, action: PayloadAction<boolean>) => {
      state.loaded = action.payload
    },
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
      state.currentFishingRequestId = action.meta.requestId
    })
    builder.addCase(fetchFishingActivityInteractionThunk.fulfilled, (state, action) => {
      state.fishingStatus = AsyncReducerStatus.Finished
      state.currentFishingRequestId = ''
      if (state?.clicked?.features?.length && action.payload?.vessels?.length) {
        state.clicked.features = state.clicked.features.map((feature: any) => {
          const sublayers = (feature as FourwingsPickingObject).sublayers?.map((sublayer) => {
            const vessels =
              action.payload?.vessels.find((v) => v.sublayerId === sublayer.id)?.vessels || []
            return { ...sublayer, vessels }
          })
          return { ...feature, sublayers }
        })
      }
    })
    builder.addCase(fetchFishingActivityInteractionThunk.rejected, (state, action) => {
      if (action.error.message === 'Aborted') {
        state.fishingStatus =
          state.currentFishingRequestId !== action.meta.requestId
            ? AsyncReducerStatus.Loading
            : AsyncReducerStatus.Idle
      } else {
        state.fishingStatus = AsyncReducerStatus.Error
      }
    })
    builder.addCase(fetchClusterEventThunk.pending, (state, action) => {
      state.apiEventStatus = AsyncReducerStatus.Loading
    })
    builder.addCase(fetchClusterEventThunk.fulfilled, (state, action) => {
      state.apiEventStatus = AsyncReducerStatus.Finished
      if (!state.clicked || !state.clicked.features || !action.payload) return
      const feature = state.clicked?.features?.find(
        (feature) => feature.id && action.meta.arg.id
      ) as any
      if (feature) {
        feature.event = action.payload
      }
    })
    builder.addCase(fetchClusterEventThunk.rejected, (state, action) => {
      if (action.error.message === 'Aborted') {
        state.apiEventStatus = AsyncReducerStatus.Idle
      } else {
        state.apiEventStatus = AsyncReducerStatus.Error
      }
    })
    builder.addCase(fetchLegacyEncounterEventThunk.pending, (state, action) => {
      state.apiEventStatus = AsyncReducerStatus.Loading
    })
    builder.addCase(fetchLegacyEncounterEventThunk.fulfilled, (state, action) => {
      state.apiEventStatus = AsyncReducerStatus.Finished
      if (!state.clicked || !state.clicked.features || !action.payload) return
      const feature = state.clicked?.features?.find(
        (feature) => feature.id && action.meta.arg.id
      ) as any
      if (feature) {
        feature.event = action.payload
      }
    })
    builder.addCase(fetchLegacyEncounterEventThunk.rejected, (state, action) => {
      if (action.error.message === 'Aborted') {
        state.apiEventStatus = AsyncReducerStatus.Idle
      } else {
        state.apiEventStatus = AsyncReducerStatus.Error
      }
    })
    builder.addCase(fetchBQEventThunk.pending, (state, action) => {
      state.apiEventStatus = AsyncReducerStatus.Loading
    })
    builder.addCase(fetchBQEventThunk.fulfilled, (state, action) => {
      state.apiEventStatus = AsyncReducerStatus.Finished
      if (!state.clicked || !state.clicked.features || !action.payload) return
      const feature = state.clicked?.features?.find(
        (feature) => feature.id && action.meta.arg.id
      ) as any
      if (feature && action.payload) {
        feature.properties = { ...feature.properties, ...action.payload }
      }
    })
    builder.addCase(fetchBQEventThunk.rejected, (state, action) => {
      if (action.error.message === 'Aborted') {
        state.apiEventStatus = AsyncReducerStatus.Idle
      } else {
        state.apiEventStatus = AsyncReducerStatus.Error
      }
    })
  },
})

export const selectIsMapLoaded = (state: { map: MapState }) => state.map.loaded
export const selectClickedEvent = (state: { map: MapState }) => state.map.clicked
export const selectFishingInteractionStatus = (state: { map: MapState }) => state.map.fishingStatus
export const selectApiEventStatus = (state: { map: MapState }) => state.map.apiEventStatus

export const { setMapLoaded, setClickedEvent } = slice.actions
export default slice.reducer
