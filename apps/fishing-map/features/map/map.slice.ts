import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk,createSlice } from '@reduxjs/toolkit'
import { uniqBy } from 'es-toolkit'
import type { RootState } from 'reducers'
import type { AppDispatch } from 'store'

import { GFWAPI, parseAPIError } from '@globalfishingwatch/api-client'
import type {
  ApiEvent,
  APIPagination,
  Dataset,
  DataviewDatasetConfig,
  EventVessel,
  FourwingsEventsInteraction,
  IdentityVessel,
} from '@globalfishingwatch/api-types'
import {
  DatasetTypes,
  EndpointId,
  EventTypes,
  EventVesselTypeEnum,
 VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { getUTCDate } from '@globalfishingwatch/data-transforms'
import { resolveEndpoint } from '@globalfishingwatch/datasets-client'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { getDataviewSqlFiltersResolved } from '@globalfishingwatch/dataviews-client'
import type { InteractionEvent } from '@globalfishingwatch/deck-layer-composer'
import type {
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

import {
  fetchDatasetByIdThunk,
  getDatasetByIdsThunk,
  selectDatasetById,
} from 'features/datasets/datasets.slice'
import {
  getRelatedDatasetByType,
  getRelatedDatasetsByType,
  getVesselGroupInDataview,
} from 'features/datasets/datasets.utils'
import {
  selectEventsDataviews,
  selectVesselGroupDataviews,
} from 'features/dataviews/selectors/dataviews.categories.selectors'
import { selectActiveTemporalgridDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import { INCLUDES_RELATED_SELF_REPORTED_INFO_ID } from 'features/vessel/vessel.config'
import { getVesselProperty } from 'features/vessel/vessel.utils'
import { AsyncReducerStatus } from 'utils/async-slice'

export const MAX_TOOLTIP_LIST = 5

type ExtendedFeatureVesselDatasets = Omit<IdentityVessel, 'dataset'> & {
  id: string
  dataset: Dataset
  datasetId: string
  infoDataset?: Dataset
  trackDataset?: Dataset
}

export type ExtendedFeatureVessel = ExtendedFeatureVesselDatasets & {
  hours?: number
  detections?: number
  events?: number
}

export type ExtendedEventVessel = EventVessel & { dataset?: string }

export type ExtendedFeatureSingleEvent = ApiEvent<EventVessel> & { dataset: Dataset }
export type ExtendedFeatureByVesselEventPort = {
  id?: string
  name?: string
  country?: string
  datasetId?: string
}
export type ExtendedFeatureByVesselEvent = {
  id: string
  type: EventTypes
  vessels: ExtendedFeatureVessel[]
  dataset: Dataset
  port?: ExtendedFeatureByVesselEventPort
}
export type ExtendedFeatureEvent = ExtendedFeatureSingleEvent | ExtendedFeatureByVesselEvent

export type SliceExtendedFourwingsDeckSublayer = FourwingsDeckSublayer & {
  vessels?: ExtendedFeatureVessel[]
}
export type SliceExtendedFourwingsPickingObject = Omit<
  FourwingsHeatmapPickingObject,
  'sublayers'
> & {
  sublayers: SliceExtendedFourwingsDeckSublayer[]
}

export type SliceExtendedClusterPickingObject<Event = ExtendedFeatureEvent> =
  FourwingsClusterPickingObject & {
    event: Event
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
  zoom?: number
}

type MapState = {
  loaded: boolean
  clicked: SliceInteractionEvent | null
  hovered: SliceInteractionEvent | null
  apiActivityStatus: AsyncReducerStatus
  apiActivityError: string
  currentActivityRequestId: string
  apiEventStatus: AsyncReducerStatus
  apiEventError: string
}

const initialState: MapState = {
  loaded: false,
  clicked: null,
  hovered: null,
  apiActivityStatus: AsyncReducerStatus.Idle,
  apiActivityError: '',
  currentActivityRequestId: '',
  apiEventStatus: AsyncReducerStatus.Idle,
  apiEventError: '',
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
        value: [INCLUDES_RELATED_SELF_REPORTED_INFO_ID],
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

export type ActivityProperty = 'hours' | 'detections' | 'events'
export const fetchHeatmapInteractionThunk = createAsyncThunk<
  { vessels: SublayerVessels[] } | undefined,
  {
    heatmapFeatures: FourwingsHeatmapPickingObject[]
    heatmapProperties?: ActivityProperty[]
  },
  {
    dispatch: AppDispatch
  }
>(
  'map/fetchHeatmapInteraction',
  async (
    { heatmapFeatures, heatmapProperties },
    { getState, signal, dispatch, rejectWithValue }
  ) => {
    try {
      const state = getState() as any
      const guestUser = selectIsGuestUser(state)
      const temporalgridDataviews = selectActiveTemporalgridDataviews(state) || []
      const vesselGroupDataviews = selectVesselGroupDataviews(state) || []
      if (!heatmapFeatures.length) {
        console.warn('fetchInteraction not possible, 0 features')
        return
      }
      const { featuresDataviews, fourWingsDataset, datasetConfig } =
        getInteractionEndpointDatasetConfig(heatmapFeatures, [
          ...temporalgridDataviews,
          ...vesselGroupDataviews,
        ])

      const interactionUrl = resolveEndpoint(fourWingsDataset, datasetConfig)
      if (interactionUrl) {
        const sublayersVesselsIdsResponse = await GFWAPI.fetch<
          APIPagination<ExtendedFeatureVessel[]>
        >(interactionUrl, { signal })

        const sublayersVesselsIds = sublayersVesselsIdsResponse.entries.map((sublayer) =>
          sublayer.flatMap((vessel) => {
            const { id, vessel_id, ...rest } = vessel as ExtendedFeatureVessel & {
              vessel_id: string
            }
            if (!id && !vessel_id) {
              return []
            }
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
            const activityProperty = heatmapProperties?.[i] || 'hours'
            return source
              .flatMap((source) => source)
              .sort((a, b) => b[activityProperty]! - a[activityProperty]!)
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

        const sublayersIds = heatmapFeatures.flatMap(
          (feature) => feature.sublayers?.map((sublayer) => sublayer.id) || ''
        )

        const sublayersVessels: SublayerVessels[] = vesselsBySource.map((sublayerVessels, i) => {
          const activityProperty = heatmapProperties?.[i] || 'hours'
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
    } catch (e: any) {
      return rejectWithValue(parseAPIError(e))
    }
  }
)

export const fetchClusterEventThunk = createAsyncThunk(
  'map/fetchEncounterEvent',
  async (
    eventFeature: FourwingsClusterPickingObject,
    { signal, getState, dispatch, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState
      const guestUser = selectIsGuestUser(state)
      const eventDataviews = selectEventsDataviews(state) || []
      const dataview = eventDataviews.find((d) => d.id === eventFeature.layerId)
      const eventsDataset = dataview?.datasets?.find((d) => d.type === DatasetTypes.Events)
      const groupBy =
        eventFeature.category === 'events' && eventFeature.eventType === EventTypes.Port
          ? 'portAndVesselId'
          : 'id'
      let interactionId = eventFeature.id
      let interactionResponse: FourwingsEventsInteraction[] | undefined
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
            { id: 'group-by', value: groupBy },
            {
              id: 'datasets',
              value: [eventsDataset.id],
            },
          ],
        }
        if (dataview) {
          const filters = getDataviewSqlFiltersResolved(dataview)
          if (filters) {
            datasetConfig.query?.push({ id: 'filters', value: filters })
          }
          const vesselGroups = getVesselGroupInDataview(dataview!)
          if (vesselGroups?.length) {
            datasetConfig.query?.push({ id: 'vessel-groups', value: vesselGroups })
          }
          if (eventFeature.clusterMode !== 'positions' && eventFeature.clusterMode !== 'default') {
            datasetConfig.query?.push({ id: 'geolocation', value: eventFeature.clusterMode })
          }
        }
        const interactionUrl = resolveEndpoint(eventsDataset, datasetConfig)
        if (interactionUrl) {
          const response = await GFWAPI.fetch<APIPagination<FourwingsEventsInteraction[]>>(
            interactionUrl,
            {
              signal,
            }
          )
          interactionResponse = response.entries[0]
          // TODO:deck remove this hardcoded id once the api responds
          eventId = response.entries[0][0]?.id
          if (groupBy === 'portAndVesselId' && response.entries[0][0]?.portId) {
            interactionId = response.entries[0][0]?.portId
          }
          if (!eventId) {
            return rejectWithValue(`No event id found for interaction`)
          }
        }
      }
      if (groupBy === 'portAndVesselId') {
        const infoDatasetIds = getRelatedDatasetsByType(
          eventsDataset,
          DatasetTypes.Vessels,
          !guestUser
        )?.map((r) => r.id) as string[]

        if (!infoDatasetIds?.length) {
          return rejectWithValue(
            `No info related datasets found in events datasets: ${JSON.stringify(eventsDataset)}`
          )
        }
        const getDatasetsAction = await dispatch(
          getDatasetByIdsThunk({ ids: infoDatasetIds, includeRelated: false })
        )
        if (!getDatasetByIdsThunk.fulfilled.match(getDatasetsAction)) {
          return rejectWithValue(getDatasetsAction.error)
        }

        const infoDatasets = getDatasetsAction.payload.flatMap((v) => v)
        const vesselIds = (interactionResponse as FourwingsEventsInteraction[])
          ?.sort((a, b) => b.events - a.events)
          .slice(0, MAX_TOOLTIP_LIST)
          .map((v) => v.id)
        const vesselsInfo = await fetchVesselInfo(infoDatasets, vesselIds, signal)
        const vessels = (interactionResponse as FourwingsEventsInteraction[])!.flatMap(
          (interaction) => {
            const vesselInfo = vesselsInfo?.find((vesselInfo) => {
              const vesselInfoIds = vesselInfo.selfReportedInfo?.map((s) => s.id)
              return vesselInfoIds.includes(interaction.id)
            })
            const infoDataset = selectDatasetById(vesselInfo?.dataset as string)(state)
            const trackFromRelatedDataset = infoDataset || vesselInfo?.dataset
            const trackDatasetId = getRelatedDatasetByType(
              trackFromRelatedDataset,
              DatasetTypes.Tracks,
              { fullDatasetAllowed: !guestUser }
            )?.id
            const trackDataset = selectDatasetById(trackDatasetId as string)(state)

            return {
              id: interaction.id,
              ...vesselInfo,
              dataset: infoDatasets[0],
              datasetId: infoDatasets[0]?.id,
              infoDataset,
              trackDataset,
              events: interaction.events,
            } as ExtendedFeatureVessel
          }
        )
        return {
          id: interactionId,
          type: EventTypes.Port,
          vessels,
          port: {
            id: interactionResponse?.find((r) => r?.portId)?.portId as string,
            name: interactionResponse?.find((r) => r?.portName)?.portName as string,
            country: interactionResponse?.find((r) => r?.portCountry)?.portCountry as string,
            datasetId: eventsDataset?.id,
          },
        } as ExtendedFeatureByVesselEvent
      } else {
        if (eventsDataset && eventId) {
          const datasetConfig = {
            datasetId: eventsDataset.id,
            endpoint: EndpointId.EventsDetail,
            params: [{ id: 'eventId', value: eventId }],
            query: [{ id: 'dataset', value: eventsDataset.id }],
            dataset: eventsDataset,
          }
          const url = resolveEndpoint(eventsDataset, datasetConfig)
          if (url) {
            const clusterEvent = await GFWAPI.fetch<ApiEvent>(url, { signal })
            if (!clusterEvent) {
              return rejectWithValue(`No event found for id: ${eventId}`)
            }
            if (clusterEvent.type === 'encounter') {
              // Workaround to grab information about each vessel dataset
              // will need discuss with API team to scale this for other types
              const isACarrierTheMainVessel =
                clusterEvent.vessel.type === EventVesselTypeEnum.Carrier
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
            return { ...clusterEvent, dataset: eventsDataset }
          } else {
            console.warn('Missing url for endpoints', eventsDataset, datasetConfig)
          }
        }
      }

      return
    } catch (e: any) {
      return rejectWithValue(parseAPIError(e))
    }
  }
)

type BQClusterEvent = Record<string, any>
export const fetchBQEventThunk = createAsyncThunk<
  BQClusterEvent | undefined,
  any, // TODO: deck fix this type once the layer is implemented in deck
  {
    dispatch: AppDispatch
  }
>('map/fetchBQEvent', async (eventFeature, { signal, getState, rejectWithValue }) => {
  try {
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
  } catch (e: any) {
    return rejectWithValue(parseAPIError(e))
  }
})

export const fetchLegacyEncounterEventThunk = createAsyncThunk(
  'map/fetchLegacyEncounterEvent',
  async (eventFeature: ClusterPickingObject, { signal, getState, rejectWithValue }) => {
    try {
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
    } catch (e: any) {
      return rejectWithValue(parseAPIError(e))
    }
  }
)

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
    builder.addCase(fetchHeatmapInteractionThunk.pending, (state, action) => {
      state.apiActivityStatus = AsyncReducerStatus.Loading
      state.apiActivityError = ''
      state.currentActivityRequestId = action.meta.requestId
    })
    builder.addCase(fetchHeatmapInteractionThunk.fulfilled, (state, action) => {
      state.apiActivityStatus = AsyncReducerStatus.Finished
      state.currentActivityRequestId = ''
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
    builder.addCase(fetchHeatmapInteractionThunk.rejected, (state, action) => {
      if (action.error.message === 'Aborted') {
        state.apiActivityStatus =
          state.currentActivityRequestId !== action.meta.requestId
            ? AsyncReducerStatus.Loading
            : AsyncReducerStatus.Idle
      } else {
        state.apiActivityStatus = AsyncReducerStatus.Error
        if (action.error.message) {
          state.apiActivityError = action.error.message
        }
      }
    })
    builder.addCase(fetchClusterEventThunk.pending, (state, action) => {
      state.apiEventStatus = AsyncReducerStatus.Loading
      state.apiEventError = ''
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
        if (action.payload) {
          state.apiEventError = action.payload as string
        }
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
export const selectActivityInteractionStatus = (state: { map: MapState }) =>
  state.map.apiActivityStatus
export const selectActivityInteractionError = (state: { map: MapState }) =>
  state.map.apiActivityError
export const selectApiEventStatus = (state: { map: MapState }) => state.map.apiEventStatus
export const selectApiEventError = (state: { map: MapState }) => state.map.apiEventError

export const { setMapLoaded, setClickedEvent } = slice.actions
export default slice.reducer
