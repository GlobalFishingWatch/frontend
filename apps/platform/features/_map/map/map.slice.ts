import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { uniq, uniqBy } from 'es-toolkit'
import { castDraft } from 'immer'

import type { ParsedAPIError } from '@globalfishingwatch/api-client'
import { getAdvancedSearchQuery, GFWAPI, parseAPIError } from '@globalfishingwatch/api-client'
import type {
  ApiEvent,
  APIPagination,
  APIVesselSearchPagination,
  Dataset,
  DataviewDatasetConfig,
  DetectionThumbnails,
  EventVessel,
  FourwingsEventsInteraction,
  IdentityVessel,
} from '@globalfishingwatch/api-types'
import {
  DatasetTypes,
  EndpointId,
  EventTypes,
  EventVesselTypeEnum,
  VesselIdentitySourceEnum,
} from '@globalfishingwatch/api-types'
import { getUTCDate } from '@globalfishingwatch/data-transforms/dates'
import {
  getRelatedDatasetByType,
  getRelatedDatasetsByType,
  resolveEndpoint,
} from '@globalfishingwatch/datasets-client'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { getDataviewSqlFiltersResolved } from '@globalfishingwatch/dataviews-client'
import type { InteractionEvent } from '@globalfishingwatch/deck-layer-composer'
import type {
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
} from 'features/_map/datasets/datasets.slice'
import { selectIsGuestUser } from 'features/_user/selectors/user.selectors'
import { getVesselSearchEndpoint } from 'features/_vessels/search/search.slice'
import { INCLUDES_RELATED_SELF_REPORTED_INFO_ID } from 'features/_vessels/vessel/vessel.config'
import type { VesselDataIdentity } from 'features/_vessels/vessel/vessel.slice'
import { getVesselIdentities, getVesselProperty } from 'features/_vessels/vessel/vessel.utils'
import type { RootState } from 'reducers'
import type { AppDispatch } from 'store'
import { AsyncReducerStatus } from 'utils/async-slice'

export const MAX_TOOLTIP_LIST = 5

/**
 * Loaded on demand from the thunks below. These two modules are the reducer map's only entry into the
 * dataview selector cluster, which reaches deck-layer-composer, @turf/turf, match-sorter and
 * deck-layers — a static import here puts all four in the entry chunk of every page, map or not.
 *
 * Same module instance as a static import would give, so reselect memoization is unaffected.
 */
const loadCategorySelectors = () =>
  import('features/_map/dataviews/selectors/dataviews.categories.selectors')
const loadDataviewSelectors = () => import('features/_map/dataviews/selectors/dataviews.selectors')
const loadDatasetsUtils = () => import('features/_map/datasets/datasets.utils')

type ExtendedFeatureVesselDatasets = Omit<IdentityVessel, 'dataset'> & {
  id: string
  dataset: Dataset
  datasetId: string
  infoDataset?: Dataset
  trackDataset?: Dataset
  trackRealtimeDataset?: Dataset
}

export type ExtendedFeatureVessel = ExtendedFeatureVesselDatasets & {
  // skylight detections might not have a vessel_id, but still can use the shipname, flag and skylight_id
  shipname?: string
  flag?: string
  skylight_id?: string
  hours?: number
  detections?: number
  events?: number
}

export type ExtendedEventVessel = EventVessel & { dataset?: string }

export type ExtendedFeatureSingleEvent = ApiEvent<ExtendedEventVessel> & { dataset: Dataset }
export type ExtendedFeatureByVesselEventPort = {
  id?: string
  name?: string
  country?: string
  flag?: string
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
  apiDetectionPositionsStatus: AsyncReducerStatus
  apiDetectionPositionsError: string
  currentDetectionRequestId: string
  apiRealTimePositionsStatus: AsyncReducerStatus
  apiRealTimePositionsError: string
  currentRealTimePositionsRequestId: string
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
  apiDetectionPositionsStatus: AsyncReducerStatus.Idle,
  apiDetectionPositionsError: '',
  currentDetectionRequestId: '',
  apiRealTimePositionsStatus: AsyncReducerStatus.Idle,
  apiRealTimePositionsError: '',
  currentRealTimePositionsRequestId: '',
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

  // get corresponding dataviews, keeping track of the feature each one belongs to
  // as sublayers without a matching dataview are discarded and would shift the indexes
  const featuresSublayerDataviews = features.flatMap((feature, featureIndex) => {
    if (!feature.sublayers?.length) return []
    return feature.sublayers.flatMap((sublayer) => {
      const dataview = temporalgridDataviews.find((dataview) => dataview.id === sublayer.id)
      return dataview ? { dataview, featureIndex } : []
    })
  })
  const featuresDataviews = featuresSublayerDataviews.map(({ dataview }) => dataview)
  const featuresIndexes = featuresSublayerDataviews.map(({ featureIndex }) => featureIndex)
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

  const vesselGroups = featuresDataviews.flatMap((dv) => dv.config?.['vessel-groups'] || '')

  if (vesselGroups.length) {
    datasetConfig.query?.push({ id: 'vessel-groups', value: vesselGroups })
  }
  return { featuresDataviews, featuresIndexes, fourWingsDataset, datasetConfig }
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

const searchVesselMMSI = async (datasets: Dataset[], mmsis: string[], signal: AbortSignal) => {
  if (!datasets?.length || !mmsis?.length) {
    return []
  }
  const query = getAdvancedSearchQuery([{ key: 'ssvid', value: mmsis }])
  const vesselsSearchUrl = getVesselSearchEndpoint(datasets, { mode: 'advanced', query, since: '' })
  if (!vesselsSearchUrl) {
    console.warn('No vessel search url found for dataset', datasets)
    console.warn('and mmsis', mmsis)
    return []
  }
  try {
    const vesselsSearchResponse = await GFWAPI.fetch<APIVesselSearchPagination<IdentityVessel>>(
      vesselsSearchUrl,
      { signal }
    )
    return vesselsSearchResponse.entries || []
  } catch (e: any) {
    console.warn(e)
    return []
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
      const [
        { selectActiveTemporalgridDataviews },
        { selectVesselGroupDataviews },
        { getIsSkylightDataset, isRealTimeDataset },
      ] = await Promise.all([loadDataviewSelectors(), loadCategorySelectors(), loadDatasetsUtils()])
      const state = getState() as any
      const guestUser = selectIsGuestUser(state)
      const temporalgridDataviews = selectActiveTemporalgridDataviews(state) || []
      const vesselGroupDataviews = selectVesselGroupDataviews(state) || []
      if (!heatmapFeatures.length) {
        console.warn('fetchInteraction not possible, 0 features')
        return
      }
      const { featuresDataviews, featuresIndexes, fourWingsDataset, datasetConfig } =
        getInteractionEndpointDatasetConfig(heatmapFeatures, [
          ...temporalgridDataviews,
          ...vesselGroupDataviews,
        ])

      const interactionUrl = resolveEndpoint(fourWingsDataset, datasetConfig)
      if (interactionUrl) {
        const sublayersVesselsIdsResponse = await GFWAPI.fetch<
          APIPagination<ExtendedFeatureVessel[]>
        >(interactionUrl, { signal })
        const requestedDatasets = featuresDataviews.flatMap((dv) => dv.config?.datasets || [])
        // Real time datasets uses mmsi instead of vessel ids
        const sublayersVesselsIds = (sublayersVesselsIdsResponse.entries || []).map(
          (sublayer, index) => {
            const isSkylightDataset = getIsSkylightDataset(requestedDatasets[index])
            return (sublayer || []).flatMap((vessel) => {
              const {
                id: vesselId,
                vessel_id,
                ...rest
              } = vessel as ExtendedFeatureVessel & {
                vessel_id: string
              }
              // vessel_id needed for VIIRS layers
              const id = vesselId || vessel_id
              // Skylight migh don't have a vessel_id, but still can use the skylight_id
              if (!id && !isSkylightDataset) {
                return []
              }
              return { ...rest, id }
            })
          }
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
            const activityProperty = heatmapProperties?.[featuresIndexes[i]] || 'hours'
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
                  const action = await dispatch(fetchDatasetByIdThunk({ id }))
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
        const topActivityVesselIds = topActivityVessels.flatMap(({ id }) => id || [])

        const realTimeDataset = isRealTimeDataset(fourWingsDataset)
        const useVesselMMSI = realTimeDataset
        const vesselsInfo = useVesselMMSI
          ? await searchVesselMMSI(infoDatasets, topActivityVesselIds, signal)
          : await fetchVesselInfo(infoDatasets, topActivityVesselIds, signal)

        const sublayersVessels: SublayerVessels[] = vesselsBySource.map((sublayerVessels, i) => {
          const activityProperty = heatmapProperties?.[featuresIndexes[i]] || 'hours'
          return {
            sublayerId: featuresDataviews[i].id,
            vessels: sublayerVessels
              .flatMap((vessels) => {
                return vessels.map((vessel) => {
                  const vesselInfo = useVesselMMSI
                    ? vesselsInfo
                        ?.flatMap((info) => {
                          const match = info.selfReportedInfo?.find((s) => s.ssvid === vessel.id)
                          return match ? [{ info, date: match.transmissionDateTo || '' }] : []
                        })
                        .sort((a, b) => b.date.localeCompare(a.date))[0]?.info
                    : vesselsInfo?.find((info) =>
                        info.selfReportedInfo?.some((s) => s.id === vessel.id)
                      )
                  const infoDataset = selectDatasetById(vesselInfo?.dataset as string)(state)
                  const trackFromRelatedDataset = infoDataset || vessel.dataset
                  const trackDatasetId = getRelatedDatasetByType(
                    trackFromRelatedDataset,
                    DatasetTypes.Tracks,
                    { fullDatasetAllowed: !guestUser }
                  )?.id
                  const trackRealTimeDatasetId = realTimeDataset
                    ? getRelatedDatasetByType(
                        vessel.dataset, // all-tracks-real-time is only related to the heatmap,
                        DatasetTypes.Tracks,
                        { fullDatasetAllowed: !guestUser }
                      )?.id
                    : ''
                  // if (vesselInfo && !trackDatasetId) {
                  //   console.warn('No track dataset found for dataset:', trackFromRelatedDataset)
                  //   console.warn('and vessel:', vessel)
                  // }
                  const trackDataset = selectDatasetById(trackDatasetId as string)(state)
                  const trackRealtimeDataset = trackRealTimeDatasetId
                    ? selectDatasetById(trackRealTimeDatasetId as string)(state)
                    : undefined
                  return {
                    ...vessel,
                    ...(vesselInfo || {}),
                    id: vesselInfo?.selfReportedInfo?.[0]?.id || vessel.id,
                    infoDataset,
                    trackDataset,
                    trackRealtimeDataset,
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
      const [{ selectEventsDataviews }, { getVesselGroupInDataview }] = await Promise.all([
        loadCategorySelectors(),
        loadDatasetsUtils(),
      ])
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

      if (!eventId && interactionId && eventsDataset && eventFeature.properties.tile) {
        const start = getUTCDate(eventFeature?.startTime).toISOString()
        const end = getUTCDate(eventFeature?.endTime).toISOString()
        const datasetConfig: DataviewDatasetConfig = {
          datasetId: eventsDataset?.id,
          endpoint: EndpointId.ClusterTilesInteraction,
          params: [
            { id: 'z', value: eventFeature.properties.tile?.z },
            { id: 'x', value: eventFeature.properties.tile?.x },
            { id: 'y', value: eventFeature.properties.tile?.y },
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
        const vessels = (interactionResponse as FourwingsEventsInteraction[])?.flatMap(
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
            if (
              clusterEvent.type === EventTypes.Encounter ||
              clusterEvent.type === EventTypes.Gap ||
              clusterEvent.type === EventTypes.Gaps
            ) {
              // Workaround to grab information about each vessel dataset
              // will need discuss with API team to scale this for other types
              let vessels = []
              if (clusterEvent.type === 'encounter') {
                const isTheMainVesselNotFishing =
                  clusterEvent.vessel.type === EventVesselTypeEnum.Carrier ||
                  !clusterEvent.encounter?.vessel ||
                  !clusterEvent.encounter?.vessel.id
                const fishingVessel = isTheMainVesselNotFishing
                  ? clusterEvent.encounter?.vessel
                  : clusterEvent.vessel
                const carrierVessel = isTheMainVesselNotFishing
                  ? clusterEvent.vessel
                  : clusterEvent.encounter?.vessel
                vessels = [fishingVessel, carrierVessel]
              } else {
                vessels = [clusterEvent.vessel]
              }
              let vesselsInfo: IdentityVessel[] = []
              const vesselsDatasets = dataview?.datasets
                ?.flatMap((d) => d.relatedDatasets || [])
                .filter((d) => d?.type === DatasetTypes.Vessels)

              if (vesselsDatasets?.length && vessels.length) {
                const vesselDataset = selectDatasetById(vesselsDatasets[0].id)(state) as Dataset
                const vesselsDatasetConfig = {
                  datasetId: vesselDataset.id,
                  endpoint: EndpointId.VesselList,
                  params: [],
                  query: [
                    { id: 'ids', value: vessels.flatMap((v) => v?.id || []) },
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
              if (clusterEvent.type === 'encounter') {
                const fishingVesselDataset =
                  vesselsInfo.find(
                    (v) =>
                      getVesselProperty(v, 'id', {
                        identitySource: VesselIdentitySourceEnum.SelfReported,
                      }) === vessels[0]?.id
                  )?.dataset || ''
                const carrierVesselDataset =
                  vesselsInfo.find(
                    (v) =>
                      getVesselProperty(v, 'id', {
                        identitySource: VesselIdentitySourceEnum.SelfReported,
                      }) === vessels[1]?.id
                  )?.dataset || ''

                const fishingExtendedVessel: ExtendedEventVessel = {
                  ...(vessels[0] as EventVessel),
                  dataset: fishingVesselDataset,
                }
                const carrierExtendedVessel: ExtendedEventVessel = {
                  ...(vessels[1] as EventVessel),
                  dataset: carrierVesselDataset,
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
              } else {
                return {
                  ...clusterEvent,
                  vessel: {
                    ...(vessels[0] as EventVessel),
                    dataset: vesselsInfo?.[0]?.dataset,
                  },
                  dataset: eventsDataset,
                }
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

export const fetchDetectionThumbnailsThunk = createAsyncThunk<
  { thumbnails: (DetectionThumbnails | undefined)[] } | undefined,
  {
    detectionFeatures: FourwingsPositionsPickingObject[]
  },
  {
    dispatch: AppDispatch
  }
>(
  'map/fetchDetectionThumbnails',
  async ({ detectionFeatures }, { signal, getState, rejectWithValue, dispatch }) => {
    try {
      const { selectActiveDetectionsDataviews } = await loadCategorySelectors()
      const state = getState() as any
      const detectionsDataviews = selectActiveDetectionsDataviews(state) || []
      const thumbnails = await Promise.all(
        detectionFeatures.map(async (detectionFeature) => {
          const dataview = detectionsDataviews.find(
            (d) => d.id === detectionFeature.sublayers?.[0].id
          )
          const datasetId = detectionFeature.sublayers?.flatMap((s) => s.datasets)?.[0]
          const detectionsDataset = dataview?.datasets?.find((d) => d.id === datasetId)
          const thumbnailDatasetId = getRelatedDatasetByType(
            detectionsDataset,
            DatasetTypes.Thumbnails
          )?.id
          if (thumbnailDatasetId) {
            let thumbnailDataset = selectDatasetById(thumbnailDatasetId as string)(state)
            if (!thumbnailDataset) {
              thumbnailDataset = await dispatch(
                fetchDatasetByIdThunk({ id: thumbnailDatasetId as string })
              ).unwrap()
            }
            if (thumbnailDataset) {
              const detectionId = detectionFeature.properties?.id

              const datasetConfig = {
                datasetId: thumbnailDataset.id,
                endpoint: EndpointId.Thumbnails,
                params: [{ id: 'id', value: detectionId }],
              }
              const url = resolveEndpoint(thumbnailDataset, datasetConfig)
              if (url) {
                return await GFWAPI.fetch<DetectionThumbnails>(url, { signal })
              }
            }
          }
          return undefined
        })
      )

      return { thumbnails }
    } catch (e: any) {
      return rejectWithValue(parseAPIError(e))
    }
  }
)

export type PositionRealTimeVessel = {
  vessel: IdentityVessel
  identity: VesselDataIdentity
}

export const fetchRealTimePositionsThunk = createAsyncThunk<
  Record<string, PositionRealTimeVessel> | undefined,
  {
    realTimeFeatures: FourwingsPositionsPickingObject[]
  },
  {
    dispatch: AppDispatch
  }
>(
  'map/fetchRealTimePositions',
  async ({ realTimeFeatures }, { signal, getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState() as any
      const mmsis = uniq(realTimeFeatures.flatMap((feature) => feature.properties?.id || []))
      if (!mmsis.length) {
        return {}
      }
      const guestUser = selectIsGuestUser(state)
      const datasetIds = uniq(
        realTimeFeatures.flatMap(
          (feature) => feature.sublayers?.flatMap((sublayer) => sublayer.datasets || []) || []
        )
      )
      const infoDatasetIds = uniq(
        datasetIds.flatMap((datasetId) => {
          const dataset = selectDatasetById(datasetId)(state)
          if (!dataset) {
            return []
          }
          const relatedDatasets = getRelatedDatasetsByType(
            dataset,
            DatasetTypes.Vessels,
            !guestUser
          )?.map((d) => d.id)
          return relatedDatasets || []
        })
      )
      // The search endpoint needs the resolved dataset, not just the id from relatedDatasets
      const infoDatasets = (
        await Promise.all(
          infoDatasetIds.map(async (id) => {
            const infoDataset = selectDatasetById(id)(state)
            if (infoDataset) {
              return infoDataset
            }
            const action = await dispatch(fetchDatasetByIdThunk({ id }))
            return fetchDatasetByIdThunk.fulfilled.match(action) ? action.payload : undefined
          })
        )
      ).flatMap((dataset) => dataset || [])

      if (!infoDatasets.length) {
        console.warn('No vessel info datasets found for realtime positions', datasetIds)
        return {}
      }

      const vessels = await searchVesselMMSI(infoDatasets, mmsis, signal)
      if (!vessels?.length) {
        return {}
      }

      const entries = mmsis.flatMap((mmsi) => {
        const matches = vessels.flatMap((vessel) =>
          getVesselIdentities(vessel, { identitySource: VesselIdentitySourceEnum.SelfReported })
            .filter((identity) => identity.ssvid === mmsi)
            .map((identity) => ({ vessel, identity }))
        )
        if (!matches.length) {
          return []
        }
        const positionTime = realTimeFeatures.find((f) => f.properties?.id === mmsi)?.properties
          ?.stime
        const positionDate = positionTime ? getUTCDate(positionTime * 1000).toISOString() : ''
        const transmittingMatches = positionDate
          ? matches.filter(
              ({ identity }) =>
                (!identity.transmissionDateFrom || identity.transmissionDateFrom <= positionDate) &&
                (!identity.transmissionDateTo || identity.transmissionDateTo >= positionDate)
            )
          : []
        const candidates = transmittingMatches.length ? transmittingMatches : matches
        if (uniq(candidates.map(({ identity }) => identity.id)).length !== 1) {
          return []
        }
        return [[mmsi, candidates[0]] as const]
      })

      return Object.fromEntries(entries)
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
    const { selectEventsDataviews } = await loadCategorySelectors()
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
      state.clicked = castDraft({ ...action.payload })
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
    builder.addCase(fetchDetectionThumbnailsThunk.pending, (state, action) => {
      state.apiDetectionPositionsStatus = AsyncReducerStatus.Loading
      state.apiDetectionPositionsError = ''
      state.currentDetectionRequestId = action.meta.requestId
    })
    builder.addCase(fetchDetectionThumbnailsThunk.fulfilled, (state, action) => {
      state.apiDetectionPositionsStatus = AsyncReducerStatus.Finished
      state.currentDetectionRequestId = ''
      if (state?.clicked?.features?.length && action.payload?.thumbnails?.length) {
        state.clicked.features = state.clicked.features.flatMap((feature, i) => {
          if (feature.category === 'detections') {
            const properties = {
              ...(feature.properties || ({} as any)),
              thumbnails: action.payload?.thumbnails?.[i],
            }
            return { ...feature, properties }
          }
          return [feature]
        })
      }
    })
    builder.addCase(fetchDetectionThumbnailsThunk.rejected, (state, action) => {
      if (action.error.message === 'Aborted') {
        state.apiDetectionPositionsStatus =
          state.currentDetectionRequestId !== action.meta.requestId
            ? AsyncReducerStatus.Loading
            : AsyncReducerStatus.Idle
      } else {
        state.apiDetectionPositionsStatus = AsyncReducerStatus.Error
        if (action.error.message) {
          state.apiDetectionPositionsError = action.error.message
        }
      }
    })
    builder.addCase(fetchRealTimePositionsThunk.pending, (state, action) => {
      state.apiRealTimePositionsStatus = AsyncReducerStatus.Loading
      state.apiRealTimePositionsError = ''
      state.currentRealTimePositionsRequestId = action.meta.requestId
    })
    builder.addCase(fetchRealTimePositionsThunk.fulfilled, (state, action) => {
      state.apiRealTimePositionsStatus = AsyncReducerStatus.Finished
      state.currentRealTimePositionsRequestId = ''
      const vesselsByMmsi = action.payload
      if (!state?.clicked?.features?.length || !vesselsByMmsi) {
        return
      }
      state.clicked.features = state.clicked.features.map((feature) => {
        const mmsi = (feature as FourwingsPositionsPickingObject).properties?.id
        const realTimeVessel = mmsi ? vesselsByMmsi[mmsi] : undefined
        if (!realTimeVessel) {
          return feature
        }
        const properties = { ...(feature.properties || ({} as any)), realTimeVessel }
        return { ...feature, properties } as SliceExtendedFeature
      })
    })
    builder.addCase(fetchRealTimePositionsThunk.rejected, (state, action) => {
      if (action.error.message === 'Aborted') {
        state.apiRealTimePositionsStatus =
          state.currentRealTimePositionsRequestId !== action.meta.requestId
            ? AsyncReducerStatus.Loading
            : AsyncReducerStatus.Idle
      } else {
        state.apiRealTimePositionsStatus = AsyncReducerStatus.Error
        if (action.error.message) {
          state.apiRealTimePositionsError = action.error.message
        }
      }
    })
    builder.addCase(fetchClusterEventThunk.pending, (state) => {
      state.apiEventStatus = AsyncReducerStatus.Loading
      state.apiEventError = ''
    })
    builder.addCase(fetchClusterEventThunk.fulfilled, (state, action) => {
      state.apiEventStatus = AsyncReducerStatus.Finished
      if (!state.clicked || !state.clicked.features || !action.payload) return
      const feature = state.clicked?.features?.find(
        (feature) => feature.id === action.meta.arg.id
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
          state.apiEventError = (action.payload as ParsedAPIError).message
        }
      }
    })
    builder.addCase(fetchBQEventThunk.pending, (state) => {
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
export const selectDetectionPositionsInteractionStatus = (state: { map: MapState }) =>
  state.map.apiDetectionPositionsStatus
export const selectDetectionPositionsInteractionError = (state: { map: MapState }) =>
  state.map.apiDetectionPositionsError
export const selectRealTimePositionsInteractionStatus = (state: { map: MapState }) =>
  state.map.apiRealTimePositionsStatus
export const selectRealTimePositionsInteractionError = (state: { map: MapState }) =>
  state.map.apiRealTimePositionsError
export const selectApiEventStatus = (state: { map: MapState }) => state.map.apiEventStatus
export const selectApiEventError = (state: { map: MapState }) => state.map.apiEventError

export const { setMapLoaded, setClickedEvent } = slice.actions
export default slice.reducer
